const analyzeBtn = document.getElementById("analyzeBtn");
const aiStatus = document.getElementById("aiStatus");
const aiSkeleton = document.getElementById("aiSkeleton");
const predText = document.getElementById("predText");
const adviceText = document.getElementById("adviceText");
const aiMsg = document.getElementById("aiMsg");

function setLoading(isLoading) {
    analyzeBtn.disabled = isLoading;
    aiSkeleton.style.display = isLoading ? "block" : "none";
    aiStatus.textContent = isLoading ? "Loading" : "Idle";
}

async function callBackendForPrediction() {
    // ✅ غيّر endpoint لما تعرفه
    // مثال متوقع: POST /api/ai/predict
    const base = "http://localhost:3000";
    const token = localStorage.getItem("token");

    // لو عندك آخر رفع بيانات نخليه يطلع منه
    const last = localStorage.getItem("lastUploadedSensorData");
    const payload = last ? JSON.parse(last) : {};

    const res = await fetch(base + "/api/ai/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "AI predict failed");
    return data;
}

function mockPrediction() {
    return {
        prediction: "Irrigation is recommended",
        advice: "Increase watering in the next 24 hours"
    };
}

analyzeBtn.addEventListener("click", async () => {
    aiMsg.textContent = "";
    setLoading(true);

    try {
        const data = await callBackendForPrediction();

        // map flexible
        const prediction = data.prediction ?? data.label ?? data.result?.prediction ?? "—";
        const advice = data.advice ?? data.recommendation ?? data.result?.advice ?? "—";

        predText.textContent = prediction;
        adviceText.textContent = advice;

        aiStatus.textContent = "Done ✅";
        setTimeout(() => aiStatus.textContent = "Idle", 900);

    } catch (err) {
        console.log(err);
        const data = mockPrediction();
        predText.textContent = data.prediction;
        adviceText.textContent = data.advice;
        aiStatus.textContent = "Demo ✅";
        aiMsg.textContent = "Showing demo AI result (backend not connected).";
    } finally {
        setLoading(false);
    }
});
