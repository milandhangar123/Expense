// Utility function to test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch("https://expense-eo6k.onrender.com/");
    const text = await response.text();
    return { success: true, message: text, status: response.status };
  } catch (error) {
    return { success: false, message: error.message, error };
  }
};

// Test API endpoint
export const testLoginEndpoint = async (email, password) => {
  try {
    const response = await fetch("https://expense-eo6k.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json().catch(() => ({ error: "Failed to parse response" }));
    return { 
      success: response.ok, 
      status: response.status, 
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return { success: false, message: error.message, error };
  }
};
