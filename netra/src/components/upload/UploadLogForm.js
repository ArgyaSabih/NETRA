"use client";

import {useState, useRef} from "react";
import {FiUploadCloud, FiCheckCircle, FiAlertCircle, FiX, FiDownload} from "react-icons/fi";
import {useRouter} from "next/navigation";

export default function UploadLogForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [statusMessage, setStatusMessage] = useState("");
  const [recentUploads, setRecentUploads] = useState([
    {
      id: 1,
      name: "auth_server_01.log",
      status: "AI Analyzing...",
      timestamp: "Just now",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "syslog_udp.csv",
      status: "Completed",
      timestamp: "2h ago",
      size: "1.2 MB",
      threatsFound: "3 Threats Found"
    },
    {
      id: 3,
      name: "router_dump_final.json",
      status: "Parsing Error",
      timestamp: "5h ago",
      size: "856 KB"
    },
    {
      id: 4,
      name: "web_access_logs.txt",
      status: "Completed",
      timestamp: "Yesterday",
      size: "542 KB",
      threatsFound: "Clean"
    }
  ]);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const supportedFormats = [".LOG", ".CSV", ".JSON", ".TXT", ".XML"];

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
    // Validate file size (max 1GB)
    const maxSize = 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus("error");
      setStatusMessage("File size exceeds 1GB limit");
      return;
    }

    // Validate file type
    const validExtensions = [".log", ".csv", ".json", ".txt", ".xml"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus("error");
      setStatusMessage(`File type ${fileExtension} is not supported`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 300);

      // Upload file
      const response = await fetch("/api/upload-log", {
        method: "POST",
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

      // Add to recent uploads
      const newUpload = {
        id: recentUploads.length + 1,
        name: file.name,
        status: "Completed",
        timestamp: "Just now",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        threatsFound: `${data.threatsDetected} Threats Found`
      };

      setRecentUploads([newUpload, ...recentUploads.slice(0, 3)]);

      // Reset form
      setTimeout(() => {
        fileInputRef.current.value = "";
        setUploadProgress(0);
        setIsUploading(false);

        // Redirect to dashboard
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
    <div className="min-h-screen text-white bg-slate-950">
      {/* Header */}
      <div className="p-6 border-b bg-slate-900 border-slate-800">
        <h1 className="mb-2 text-3xl font-bold">Upload Your Network Log</h1>
        <p className="text-slate-400">Securely upload system logs for real-time AI threat analysis.</p>
      </div>

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
              border-2 border-dashed rounded-lg p-12 text-center transition-all
              ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
              }
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl text-slate-500">
                <FiUploadCloud />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-semibold">Drag and drop log files here</h3>
                <p className="text-sm text-slate-400">or click to browse from your local drive</p>
              </div>
              <button
                onClick={handleSelectFiles}
                disabled={isUploading}
                className="px-6 py-2 mt-4 transition-colors border rounded-lg bg-slate-900 border-slate-700 hover:bg-slate-800 disabled:opacity-50"
              >
                📁 Select Files
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInput}
              accept=".log,.csv,.json,.txt,.xml"
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="p-6 border rounded-lg bg-slate-900/50 border-slate-700">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading and analyzing...</span>
                  <span className="text-sm text-slate-400">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{width: `${uploadProgress}%`}}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {uploadStatus === "success" && (
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-green-500/10 border-green-500/50">
              <FiCheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-green-400">Upload Successful</h3>
                <p className="mt-1 text-sm text-green-300">{statusMessage}</p>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-red-500/10 border-red-500/50">
              <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-400">Upload Failed</h3>
                <p className="mt-1 text-sm text-red-300">{statusMessage}</p>
              </div>
            </div>
          )}

          {/* Supported Formats */}
          <div className="p-6 border rounded-lg bg-slate-900/50 border-slate-700">
            <h3 className="mb-3 text-sm font-semibold text-slate-300">✓ SUPPORTED FORMATS</h3>
            <div className="flex flex-wrap gap-2">
              {supportedFormats.map((format, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm border rounded bg-slate-800 border-slate-700 text-slate-300"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>

          {/* Ready for Analysis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-blue-500/10 border-blue-500/50">
              <p className="mb-2 text-sm text-slate-400">Ready for Analysis?</p>
              <p className="text-xs text-slate-500">All engines v4.3.1 are online</p>
              <button className="w-full px-4 py-2 mt-3 text-sm text-blue-400 transition-colors border rounded bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30 disabled:opacity-50">
                💫 Start AI Analysis
              </button>
            </div>

            <div className="p-4 border rounded-lg bg-slate-900/50 border-slate-700">
              <p className="mb-2 text-sm text-slate-400">DAILY QUOTA</p>
              <p className="mb-2 text-xl font-bold">3.2 GB Used</p>
              <div className="w-full h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-purple-500" style={{width: "32%"}}></div>
              </div>
              <p className="mt-1 text-xs text-slate-500">10 GB Total</p>
            </div>
          </div>

          {/* Current Upload Progress */}
          {!isUploading && recentUploads.length > 0 && (
            <div className="p-6 border rounded-lg bg-slate-900/50 border-slate-700">
              <h3 className="mb-4 text-sm font-semibold text-slate-300">Current Upload Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">firewall_traffic_2023-10-27.log</span>
                    <span className="text-xs font-medium text-slate-500">6.4%</span>
                  </div>
                  <div className="w-full h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-blue-500" style={{width: "6.4%"}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Uploads Section */}
        <div className="p-6 border rounded-lg bg-slate-900/50 border-slate-700 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Uploads</h2>
            <a href="#" className="text-xs text-blue-400 hover:text-blue-300">
              View All
            </a>
          </div>

          <div className="space-y-3">
            {recentUploads.map((upload) => (
              <div
                key={upload.id}
                className="p-3 transition-colors border rounded-lg bg-slate-800/50 border-slate-700 hover:bg-slate-800"
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
                      {upload.threatsFound && ` • ${upload.threatsFound}`}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{upload.timestamp}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-slate-400">{upload.size}</p>
                    <button className="mt-1 text-slate-500 hover:text-slate-300">
                      <FiDownload size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
