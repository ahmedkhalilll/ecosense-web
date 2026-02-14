function drawSimpleChart(canvasId, values) {
    const canvas = document.getElementById(canvasId);
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

async function loadStatistics() {

    try {
        const res = await fetch("http://localhost:3000/api/sensors/statistics");
        if (!res.ok) throw new Error("No backend");

        const data = await res.json();
        updateUI(data);

    } catch (e) {
        console.log("Using mock statistics");

        const mock = {
            avgMoisture: 38,
            avgTemp: 23,
            alerts: ["Low soilMoisture detected", "High airTemperature detected"],
            moistSeries: [20, 30, 25, 35, 40, 38],
            tempSeries: [18, 20, 22, 21, 23, 24]
        };

        updateUI(mock);
    }
}

function updateUI(data) {
    document.getElementById("avgMoisture").textContent = data.avgMoisture;
    document.getElementById("avgTemp").textContent = data.avgTemp;
    document.getElementById("alertsCount").textContent = data.alerts.length;

    drawSimpleChart("moistChart", data.moistSeries);
    drawSimpleChart("tempChart", data.tempSeries);

    const list = document.getElementById("alertsList");
    list.innerHTML = data.alerts.map(a => `<li>${a}</li>`).join("");
}

loadStatistics();
