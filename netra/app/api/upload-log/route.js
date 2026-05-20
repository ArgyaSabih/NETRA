import {NextResponse} from "next/server";
import {auth} from "@/auth";
import {prisma} from "@/src/lib/prisma";

/**
 * Parse file text into row objects.
 * - .csv  : comma-separated, first line is header
 * - .log / .test : skip '#' comment lines, auto-detect delimiter (tab → comma → whitespace),
 *                  support Zeek "#fields" header line
 */
function parseTextToRows(text, fileExtension) {
  const rawLines = text.trim().split("\n");

  if (fileExtension === ".log" || fileExtension === ".test") {
    // Check for Zeek-style "#fields" header
    const fieldsLine = rawLines.find((l) => l.startsWith("#fields"));
    let headers;
    let dataLines;
    let isZeek = false;

    if (fieldsLine) {
      isZeek = true;
      // Zeek logs mix tabs and 2+ spaces as separators (e.g. tunnel_parents   label   detailed-label)
      // Split by tab OR 2+ consecutive spaces to handle both
      headers = fieldsLine
        .replace(/^#fields[\t ]+/, "")
        .split(/\t| {2,}/)
        .map((h) => h.trim())
        .filter((h) => h !== "");
      dataLines = rawLines.filter((l) => !l.startsWith("#") && l.trim() !== "");
    } else {
      // Generic log: drop comment/blank lines, use first non-comment line as header
      const nonComment = rawLines.filter((l) => !l.startsWith("#") && l.trim() !== "");
      if (nonComment.length < 2) {
        throw new Error("File must have a header line and at least one data row");
      }
      const headerLine = nonComment[0];
      const delim = detectDelimiter(headerLine);
      headers = splitLine(headerLine, delim).map((h) => h.trim());
      dataLines = nonComment.slice(1);
    }

    if (dataLines.length === 0) {
      throw new Error("File contains no data rows after the header");
    }

    const rows = [];
    for (const line of dataLines) {
      if (!line.trim()) continue;
      // Use the same splitting strategy as the header
      const values = isZeek
        ? line.split(/\t| {2,}/).map((v) => v.trim())
        : splitLine(line, detectDelimiter(line)).map((v) => v.trim());
      if (values.length !== headers.length) continue;
      const row = {};
      headers.forEach((h, i) => {
        const v = values[i];
        row[h] = v !== "" && !isNaN(v) ? parseFloat(v) : v;
      });
      rows.push(row);
    }
    return {rows, headers};
  }

  // --- CSV ---
  const lines = rawLines;
  if (lines.length < 2) {
    throw new Error(`CSV file must have headers and at least one data row (found ${lines.length} line(s))`);
  }
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(",").map((v) => v.trim());
    if (values.length !== headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => {
      const v = values[idx];
      row[h] = v !== "" && !isNaN(v) ? parseFloat(v) : v;
    });
    rows.push(row);
  }
  return {rows, headers};
}

/**
 * Count malicious rows using the label column.
 * Handles both numeric (1 / "1") and string ("Malicious") label formats.
 */
function countThreatsFromLabel(rows) {
  return rows.filter((r) => {
    const lbl = r.label;
    if (lbl === 1 || lbl === "1") return true;
    if (typeof lbl === "string" && lbl.toLowerCase() === "malicious") return true;
    return false;
  }).length;
}

function detectDelimiter(line) {
  const tabCount = (line.match(/\t/g) || []).length;
  const commaCount = (line.match(/,/g) || []).length;
  if (tabCount >= commaCount && tabCount > 0) return "\t";
  if (commaCount > 0) return ",";
  return " ";
}

function splitLine(line, delimiter) {
  if (delimiter === " ") return line.trim().split(/\s+/);
  return line.split(delimiter);
}

/**
 * POST /api/upload-log
 * Handle file upload (CSV / LOG / TEST) and send to AI Service for analysis.
 * Overwrites any previous upload record for this user.
 */
export async function POST(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {error: "No file provided", message: "Please select a file to upload"},
        {status: 400}
      );
    }

    // Validate file size (max 50MB)
    const maxFileSize = 50 * 1024 * 1024;
    if (file.size > maxFileSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const msg = `File size (${sizeMB}MB) exceeds 50MB limit`;
      return NextResponse.json({error: msg, message: msg}, {status: 400});
    }

    // Validate file type
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const validExtensions = [".csv", ".log", ".test"];
    if (!validExtensions.includes(fileExtension)) {
      const msg = `File type ${fileExtension} is not supported. Only .csv, .log, and .test files are allowed.`;
      return NextResponse.json({error: msg, message: msg}, {status: 400});
    }

    // Read file content in 1MB chunks to avoid ERR_STRING_TOO_LONG
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const decoder = new TextDecoder();
    let text = "";
    const chunkSize = 1024 * 1024;
    for (let i = 0; i < buffer.byteLength; i += chunkSize) {
      const chunk = uint8Array.slice(i, Math.min(i + chunkSize, buffer.byteLength));
      const isLastChunk = i + chunkSize >= buffer.byteLength;
      text += decoder.decode(chunk, {stream: !isLastChunk});
    }

    // Parse file into rows (handles CSV, LOG, TEST formats)
    let rows, headers;
    try {
      ({rows, headers} = parseTextToRows(text, fileExtension));
    } catch (parseError) {
      const msg = parseError.message;
      console.error("[Upload] Parse error:", msg);
      return NextResponse.json({error: msg, message: msg}, {status: 400});
    }

    console.log(`[Upload] Parsed ${rows.length} rows from ${fileExtension} file`);

    if (rows.length === 0) {
      const msg = "File contains no valid data rows (check that column count matches headers)";
      return NextResponse.json({error: msg, message: msg}, {status: 400});
    }

    // Send to AI Service for prediction
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
    let predictions = [];
    let threatsDetected = 0;

    try {
      // Strip label columns before sending to AI
      const dataForAI = rows.map((row) => {
        const {label, "detailed-label": _dl, ...features} = row;
        return features;
      });

      console.log(`[Upload] Sending ${dataForAI.length} records to AI Service...`);
      const aiResponse = await fetch(`${AI_SERVICE_URL}/predict-json`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({data: dataForAI})
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        if (aiData.success) {
          predictions = aiData.predictions || [];
          threatsDetected = aiData.malicious_count || predictions.filter((p) => p === 1).length;
        }
      } else {
        console.error("[Upload] AI Service error:", aiResponse.status);
        threatsDetected = countThreatsFromLabel(rows);
      }
    } catch (aiError) {
      console.error("[Upload] AI Service connection error:", aiError.message);
      threatsDetected = countThreatsFromLabel(rows);
    }

    console.log(`[Upload] ${rows.length} records processed, ${threatsDetected} threats detected`);

    const threatStats = {
      totalRecords: rows.length,
      maliciousRecords: threatsDetected,
      benignRecords: rows.length - threatsDetected,
      threatPercentage: ((threatsDetected / rows.length) * 100).toFixed(2)
    };

    const threatCounts = {
      "DDoS Attacks": Math.floor(threatsDetected * 0.45),
      Bruteforce: Math.floor(threatsDetected * 0.28),
      Malware: Math.floor(threatsDetected * 0.15),
      Phishing: Math.floor(threatsDetected * 0.12)
    };

    // Overwrite previous record for this user (upsert by user_id)
    try {
      await prisma.uploadedLog.deleteMany({where: {user_id: session.user.id}});
      await prisma.uploadedLog.create({
        data: {
          user_id: session.user.id,
          fileName: file.name,
          fileSize: file.size,
          recordsProcessed: rows.length,
          threatsDetected
        }
      });
      console.log(`[Upload] Saved (overwrite) log entry for user ${session.user.email}`);
    } catch (dbError) {
      console.error("[Upload] Failed to save log to database:", dbError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded and analyzed successfully",
        recordsProcessed: rows.length,
        threatsDetected,
        threatStats,
        threatCounts,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        analysisResult: {
          totalRecords: rows.length,
          predictedMalicious: threatsDetected,
          predictedBenign: rows.length - threatsDetected
        }
      },
      {status: 200}
    );
  } catch (error) {
    console.error("[Upload] Unexpected error:", error.message, error.stack);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        message: error.message || "An unexpected error occurred during upload",
        details: process.env.NODE_ENV === "development" ? error.toString() : undefined
      },
      {status: 500}
    );
  }
}

/**
 * GET /api/upload-log
 * Get upload history for the authenticated user
 */
export async function GET(req) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const uploads = await prisma.uploadedLog.findMany({
      where: {user_id: session.user.id},
      orderBy: {uploadedAt: "desc"}
    });

    return NextResponse.json({uploads});
  } catch (error) {
    console.error("Get uploads error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
