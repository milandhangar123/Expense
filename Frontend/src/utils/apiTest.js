// Utility function to test backend connection
import API_BASE_URL from "../config/api";

export const testBackendConnection = async () => {
  const url = API_BASE_URL + "/";
  try {
    const response = await fetch(url);
    const text = await response.text();
    return { success: true, message: text, status: response.status, url };
  } catch (error) {
    return { success: false, message: error.message, error, url };
  }
};

// Test API endpoint
export const testLoginEndpoint = async (email, password) => {
  const url = API_BASE_URL + "/api/auth/login";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({ error: "Failed to parse response" }));
    return { 
      success: response.ok, 
      status: response.status, 
      data,
      headers: Object.fromEntries(response.headers.entries()),
      url,
    };
  } catch (error) {
    return { success: false, message: error.message, error, url };
  }
};
