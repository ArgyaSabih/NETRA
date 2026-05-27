"use client";

import {useState, useRef, useContext, useEffect, useCallback} from "react";
import {useSession} from "next-auth/react";
import {FiUploadCloud, FiCheckCircle, FiAlertCircle, FiX, FiDownload, FiMenu} from "react-icons/fi";
import {useRouter} from "next/navigation";
import Sidebar from "@/src/components/shared/Sidebar";
import {LogDataContext} from "@/src/components/contexts/LogDataProvider";
import {LogChartContext} from "../contexts/ChartDataProvider";

const supportedFormats = [".LOG", ".CSV", ".TEST"];

const formatFileSize = (bytes) => {
  if (bytes == null) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const formatRelativeTime = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

export default function UploadLogForm() {
  const {data: session} = useSession();
  const {setLogsFromUpload} = useContext(LogDataContext);
  const {setChartfromUpload} = useContext(LogChartContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [recentUploads, setRecentUploads] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const mapUpload = useCallback(
    (u) => ({
      id: u.id,
      name: u.fileName,
      status: "Completed",
      timestamp: formatRelativeTime(u.uploadedAt),
      size: formatFileSize(u.fileSize),
      threatsFound:
        typeof u.threatsDetected === "number"
          ? u.threatsDetected > 0
            ? `${u.threatsDetected} Threats Found`
            : "Clean"
          : undefined
    }),
    []
  );

  const fetchRecentUploads = useCallback(async () => {
    try {
      const res = await fetch("/api/upload-log");
      if (!res.ok) return;
      const json = await res.json();
      const uploads = Array.isArray(json.uploads) ? json.uploads : [];
      setRecentUploads(uploads.slice(0, 4).map(mapUpload));
    } catch (err) {
      console.error("[UploadForm] Failed to fetch recent uploads:", err);
    } finally {
      setLoadingUploads(false);
    }
  }, [mapUpload]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (session?.user?.id) {
        fetchRecentUploads();
      } else {
        setLoadingUploads(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [session?.user?.id, fetchRecentUploads]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = async (file) => {
    if (!session?.user?.id) {
      setUploadStatus("error");
      setStatusMessage("Please log in to upload files");
      return;
    }

    const maxSize = 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus("error");
      setStatusMessage("File size exceeds 1GB limit");
      return;
    }

    const validExtensions = [".log", ".csv", ".test"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus("error");
      setStatusMessage(
        `File type ${fileExtension} is not supported. Only .log, .csv, and .test files are allowed.`
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 300);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const response = await fetch(`${backendUrl}/api/upload-log`, {
        method: "POST",
        headers: {
          // No Content-Type; browser sets it with multipart boundary automatically
          "x-user-id": session?.user?.id
        },
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || "Upload failed";
        console.error("[UploadForm] Upload error response:", errorData);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUploadProgress(100);
      setUploadStatus("success");
      setStatusMessage(`File uploaded successfully! ${data.recordsProcessed} records analyzed.`);

      // Pass table data to context for LiveLogStream
      if (data.tableData && data.fullTable) {
        setLogsFromUpload(data.tableData);
        setChartfromUpload(data.fullTable);
      } else {
        console.warn("[UploadForm] No table data found in response");
      }

      const threatsCount = data.threatsDetected ?? data.data?.threatsDetected;
      const newUpload = {
        id: data.data?.id ?? `tmp-${Date.now()}`,
        name: file.name,
        status: "Completed",
        timestamp: "Just now",
        size: formatFileSize(file.size),
        threatsFound:
          typeof threatsCount === "number"
            ? threatsCount > 0
              ? `${threatsCount} Threats Found`
              : "Clean"
            : undefined
      };
      setRecentUploads((prev) => [newUpload, ...prev].slice(0, 4));

      // Re-sync with server so IDs/timestamps/threat counts match persisted truth.
      fetchRecentUploads();

      setTimeout(() => {
        fileInputRef.current.value = "";
        setUploadProgress(0);
        setIsUploading(false);
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      setUploadProgress(0);
      setIsUploading(false);
      setUploadStatus("error");
      const errorMsg = error.message || "An error occurred during upload";
      setStatusMessage(errorMsg);
      console.error("[UploadForm] Upload failed:", errorMsg, error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#070b14] text-white">
      <Sidebar activePage="upload-log" sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-white/10 bg-[#09111f]/95 px-4 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl md:hidden hover:bg-white/[0.08]"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div>
              <p className="text-xs font-inter-semibold tracking-[0.18em] text-emerald-300 uppercase">
                Log analysis
              </p>
              <h1 className="mt-1 text-xl tracking-tight font-inter-bold">Upload Network Log</h1>
              <p className="text-sm text-slate-400">
                Securely upload system logs for real-time AI threat analysis.
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),#070b14]">
          <div className="grid grid-cols-1 gap-6 p-6 mx-auto lg:grid-cols-3 max-w-7xl">
            {/* Upload Section */}
            <div className="space-y-6 lg:col-span-2">
              {/* Drop Zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  rounded-[2rem] p-12 text-center shadow-[0_24px_70px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(255,255,255,0.08)]
                  ${
                    isDragging
                      ? "bg-emerald-500/12 ring-4 ring-emerald-500/15"
                      : "bg-white/[0.06] hover:bg-white/[0.08]"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950">
                    <FiUploadCloud />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-inter-bold">Drag and drop log files here</h3>
                    <p className="text-sm text-slate-400">or click to browse from your local drive</p>
                  </div>
                  <button
                    onClick={handleSelectFiles}
                    disabled={isUploading}
                    className="mt-4 min-h-11 rounded-2xl bg-white px-6 py-2 text-sm text-slate-950 shadow-[0_18px_45px_rgba(0,0,0,0.2)] font-inter-semibold hover:bg-slate-100 disabled:opacity-50"
                  >
                    Select Files
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInput}
                  accept=".log,.csv,.test"
                  className="hidden"
                  disabled={isUploading}
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="rounded-3xl bg-white/[0.06] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uploading and analyzing...</span>
                      <span className="text-sm text-slate-400 tabular-nums">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full h-2 overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-[width] duration-300"
                        style={{width: `${uploadProgress}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {uploadStatus === "success" && (
                <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-4 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]">
                  <FiCheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-green-400">Upload Successful</h3>
                    <p className="mt-1 text-sm text-green-300">{statusMessage}</p>
                  </div>
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="flex items-start gap-3 rounded-2xl bg-red-500/10 p-4 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)]">
                  <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-red-400">Upload Failed</h3>
                    <p className="mt-1 text-sm text-red-300">{statusMessage}</p>
                  </div>
                </div>
              )}

              {/* Supported Formats */}
              <div className="rounded-3xl bg-white/[0.06] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <h3 className="mb-3 text-sm text-slate-300 font-inter-semibold">SUPPORTED FORMATS</h3>
                <div className="flex flex-wrap gap-2">
                  {supportedFormats.map((format, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-white/[0.08] px-3 py-1 text-sm text-slate-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Uploads Section */}
            <div className="h-fit rounded-[2rem] bg-white/[0.06] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Uploads</h2>
                <a href="#" className="text-xs text-emerald-300 hover:text-emerald-200">
                  View All
                </a>
              </div>

              <div className="space-y-3">
                {loadingUploads ? (
                  <p className="text-xs text-center text-slate-500 py-4">Loading...</p>
                ) : recentUploads.length === 0 ? (
                  <p className="text-xs text-center text-slate-500 py-4">No uploads yet.</p>
                ) : null}
                {recentUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="rounded-2xl bg-white/[0.05] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] hover:bg-white/[0.08]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-slate-400">
                        {upload.status === "Completed" ? (
                          <FiCheckCircle size={16} className="text-green-500" />
                        ) : upload.status === "Parsing Error" ? (
                          <FiAlertCircle size={16} className="text-red-500" />
                        ) : (
                          <FiUploadCloud size={16} className="text-blue-500 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{upload.name}</p>
                        <p className="text-xs text-slate-400">
                          {upload.status}
                          {upload.threatsFound && ` - ${upload.threatsFound}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{upload.timestamp}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-slate-400 tabular-nums">{upload.size}</p>
                        <button className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.08] hover:text-slate-300">
                          <FiDownload size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}
