async function loadDashboard() {

    try {
        // نجرب نكلم الباك
        const res = await fetch("http://localhost:3000/api/dashboard/overview");

        if (!res.ok) throw new Error("No backend response");

        const data = await res.json();

        updateUI(data);

    } catch (error) {

        console.log("Using mock data...");

        // 👇 بيانات تجريبية مؤقتة
        const mockData = {
            moisture: 42,
            temperature: 24,
            alerts: 3,
            chart: [10, 25, 15, 40, 35, 50, 45, 60]
        };

        updateUI(mockData);
    }
}

function updateUI(data) {
    document.getElementById("soilMoistureVal").textContent = data.moisture;
    document.getElementById("soilTempVal").textContent = data.temperature;
    document.getElementById("alertsVal").textContent = data.alerts;

    drawChart(data.chart);
}

function drawChart(values) {
    const canvas = document.getElementById("chart");
    const ctx = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#1e8e63";
    ctx.lineWidth = 3;
    ctx.beginPath();

    values.forEach((v, i) => {
        const x = (w / values.length) * i;
        const y = h - v * 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.stroke();
}

loadDashboard();
