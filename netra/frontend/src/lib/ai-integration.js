/**
 * AI Service Integration Utilities
 * Mengintegrasikan prediksi dari AI Service dengan Dashboard
 */

/**
 * Analyze network traffic dan mengirim ke AI Service
 * @param {Object} trafficData - Data traffic network
 * @returns {Promise<Object>} Prediction result
 */
export async function analyzeTrafficWithAI(trafficData) {
  try {
    const response = await fetch("http://localhost:8000/predict-new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(trafficData)
    });

    if (!response.ok) {
      throw new Error(`AI Service error: ${response.statusText}`);
    }

    const prediction = await response.json();
    return prediction;
  } catch (error) {
    console.error("Error analyzing traffic with AI:", error);
    throw error;
  }
}

/**
 * Fungsi untuk mapping prediction hasil ke Log format
 * @param {Object} prediction - Hasil prediksi dari AI Service
 * @param {string} sourceIp - IP address sumber
 * @returns {Object} Log entry yang siap di-save
 */
export function predictionToLog(prediction, sourceIp) {
  const threatTypeMap = {
    1: {type: "Malicious", severity: "CRITICAL", eventType: "Malware/Intrusion"},
    0: {type: "Benign", severity: "INFO", eventType: "Normal Traffic"}
  };

  const threatInfo = threatTypeMap[prediction.label] || {
    type: "Unknown",
    severity: "INFO",
    eventType: "Unknown Threat"
  };

  return {
    severity: threatInfo.severity,
    sourceIp: sourceIp,
    eventType: threatInfo.eventType,
    message: `Traffic analyzed: ${threatInfo.type} (Confidence: ${(prediction.confidence * 100).toFixed(2)}%)`,
    action: threatInfo.severity === "CRITICAL" ? "INVESTIGATE" : "Details"
  };
}

/**
 * Kirim detection result ke dashboard
 * @param {Object} logData - Log entry untuk di-save
 * @returns {Promise<Object>} Response dari dashboard API
 */
export async function reportDetectionToDashboard(logData) {
  try {
    const response = await fetch("/api/dashboard/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      throw new Error(`Dashboard API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error reporting detection to dashboard:", error);
    throw error;
  }
}

/**
 * Full pipeline: Analyze -> Predict -> Report
 * @param {Object} trafficData - Data traffic untuk dianalisis
 * @param {string} sourceIp - IP address sumber
 */
export async function processTrafficDetection(trafficData, sourceIp) {
  try {
    // 1. Kirim ke AI Service untuk prediksi
    console.log("Analyzing traffic with AI Service...");
    const prediction = await analyzeTrafficWithAI(trafficData);

    // 2. Map prediksi ke log format
    const logEntry = predictionToLog(prediction, sourceIp);

    // 3. Report ke dashboard
    console.log("Reporting detection to dashboard...");
    const result = await reportDetectionToDashboard(logEntry);

    return {
      success: true,
      prediction,
      log: result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in traffic detection pipeline:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Batch processing untuk multiple traffic samples
 * @param {Array<Object>} trafficSamples - Array of traffic data
 * @returns {Promise<Array>} Array of results
 */
export async function batchProcessTraffic(trafficSamples) {
  const results = [];

  for (const sample of trafficSamples) {
    try {
      const result = await processTrafficDetection(sample.data, sample.sourceIp);
      results.push(result);

      // Rate limiting: tunggu 100ms antar request
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error processing sample from ${sample.sourceIp}:`, error);
      results.push({
        success: false,
        error: error.message,
        sourceIp: sample.sourceIp
      });
    }
  }

  return results;
}

/**
 * Update threat statistics berdasarkan predictions
 * @param {Array<Object>} predictions - Array of predictions
 * @returns {Object} Threat statistics
 */
export function calculateThreatStats(predictions) {
  const stats = {
    totalAnalyzed: predictions.length,
    malicious: 0,
    benign: 0,
    threatPercentage: 0
  };

  predictions.forEach((pred) => {
    if (pred.label === -1) {
      stats.malicious++;
    } else {
      stats.benign++;
    }
  });

  stats.threatPercentage = (stats.malicious / stats.totalAnalyzed) * 100;

  return stats;
}

/**
 * Format threat categories untuk dashboard
 * Berdasarkan predicted threat types
 * @param {Array<Object>} predictions - Array of predictions dengan threat type
 * @returns {Array<Object>} Formatted threat categories
 */
export function generateThreatCategories(predictions) {
  const threatCounts = {
    "DDoS Attacks": 0,
    Bruteforce: 0,
    Malware: 0,
    Phishing: 0,
    Other: 0
  };

  // Analyze predictions dan categorize
  predictions.forEach((pred) => {
    if (pred.threatType) {
      threatCounts[pred.threatType] = (threatCounts[pred.threatType] || 0) + 1;
    }
  });

  const total = Object.values(threatCounts).reduce((a, b) => a + b, 0);

  // Convert ke format dashboard
  return Object.entries(threatCounts).map(([name, count]) => ({
    name,
    percentage: total > 0 ? (count / total) * 100 : 0,
    count,
    color: getColorForThreat(name)
  }));
}

/**
 * Helper: Get color untuk threat type
 */
function getColorForThreat(threatType) {
  const colorMap = {
    "DDoS Attacks": "bg-red-500",
    Bruteforce: "bg-orange-500",
    Malware: "bg-purple-500",
    Phishing: "bg-blue-500",
    Other: "bg-slate-500"
  };
  return colorMap[threatType] || "bg-slate-500";
}

/**
 * Monitor AI Service health
 * @returns {Promise<Object>} Health status
 */
export async function checkAIServiceHealth() {
  try {
    const startTime = Date.now();
    const response = await fetch("http://localhost:8000/health", {
      method: "GET",
      timeout: 5000
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return {
      status: "healthy",
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
