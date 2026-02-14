async function loadSensors() {

    try {
        // لو عندك باك غير اللينك
        const res = await fetch("http://localhost:3000/api/sensors/latest");

        if (!res.ok) throw new Error("No backend");

        const data = await res.json();
        updateUI(data);

    } catch (e) {
        console.log("Using mock sensor data");

        const mock = {
            soilMoisture: 42,
            soilTemperature: 24,
            airHumidity: 55,
            soilPH: 6.8,
            chart: [10, 25, 15, 40, 35, 50, 45, 60]
        };

        updateUI(mock);
    }
}

function updateUI(data) {
    document.getElementById("moistVal").textContent = data.soilMoisture;
    document.getElementById("tempVal").textContent = data.soilTemperature;
    document.getElementById("humidityVal").textContent = data.airHumidity;
    document.getElementById("phVal").textContent = data.soilPH;

    drawChart(data.chart);
}

function drawChart(values) {
    const canvas = document.getElementById("sensorChart");
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

loadSensors();
