async function sendToBackend(payload) {
    // ✅ لو عندك endpoint حقيقي: غيّره هنا أو في api.js
    // مثال متوقع: POST /api/sensors/upload
    const base = "http://localhost:3000";
    const token = localStorage.getItem("token");

    const res = await fetch(base + "/api/sensors/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data;
}

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const msg = document.getElementById("uploadMsg");
    msg.textContent = "";

    const fd = new FormData(e.target);

    const payload = {
        soilMoisture: Number(fd.get("soilMoisture")),
        soilTemperature: Number(fd.get("soilTemperature")),
        airTemperature: Number(fd.get("airTemperature")),
        airHumidity: Number(fd.get("airHumidity")),
        lightIntensity: Number(fd.get("lightIntensity")),
        soilPH: Number(fd.get("soilPH")),
    };

    try {
        // جرّب backend
        await sendToBackend(payload);

        msg.textContent = "Uploaded ✅";
        e.target.reset();

    } catch (err) {
        console.log(err);

        // Demo fallback
        msg.textContent = "Saved locally (demo). Backend not connected ✅";
        localStorage.setItem("lastUploadedSensorData", JSON.stringify(payload));
    }
});
