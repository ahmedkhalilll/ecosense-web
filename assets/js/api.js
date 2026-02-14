// غيّر الرابط ده لرابط السيرفر بتاعك
const API_BASE = "http://localhost:3000";

async function request(path, { method = "GET", body = null, headers = {} } = {}) {
    const token = localStorage.getItem("token");
    const res = await fetch(API_BASE + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...headers
        },
        body: body ? JSON.stringify(body) : null
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

window.API = {
    auth: {
        register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
        verifyOtp: (payload) => request("/api/auth/verify-otp", { method: "POST", body: payload }),
        resendOtp: (payload) => request("/api/auth/resend-otp", { method: "POST", body: payload }),
        login: (payload) => request("/api/auth/login", { method: "POST", body: payload })
    },

    dashboard: {
        overview: () => request("/api/dashboard/overview")
        // لو عندك endpoint مختلف غيّره هنا
    },

    sensors: {
        latest: (deviceId) => request(`/api/sensors/latest${deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : ""}`),
        summary: (range = "24h", deviceId) =>
            request(`/api/sensors/summary?range=${encodeURIComponent(range)}${deviceId ? `&deviceId=${encodeURIComponent(deviceId)}` : ""}`)
    },

    alerts: {
        active: (deviceId) => request(`/api/alerts/active${deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : ""}`)
    }
};

