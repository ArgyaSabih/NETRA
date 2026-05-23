import { auth } from "@/auth";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Make API calls to the Express backend
 * Automatically includes user ID from session
 */
export async function callBackendAPI(endpoint, options = {}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Backend API error:", error);
    throw error;
  }
}

/**
 * GET request to backend
 */
export async function backendGet(endpoint) {
  return callBackendAPI(endpoint, { method: "GET" });
}

/**
 * POST request to backend
 */
export async function backendPost(endpoint, data) {
  return callBackendAPI(endpoint, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

/**
 * PUT request to backend
 */
export async function backendPut(endpoint, data) {
  return callBackendAPI(endpoint, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

/**
 * DELETE request to backend
 */
export async function backendDelete(endpoint) {
  return callBackendAPI(endpoint, { method: "DELETE" });
}
