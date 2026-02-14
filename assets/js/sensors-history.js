function drawChart(valuesA, valuesB) {
    const canvas = document.getElementById("historyChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // background
    ctx.fillStyle = "rgba(245,250,248,.95)";
    ctx.fillRect(0, 0, w, h);

    const pad = 14;

    function plot(values, stroke) {
        if (!values || values.length < 2) return;

        const maxV = Math.max(...values);
        const minV = Math.min(...values);
        const sx = (w - pad * 2) / (values.length - 1);
        const sy = (h - pad * 2) / (maxV - minV || 1);

        ctx.strokeStyle = stroke;
        ctx.lineWidth = 3;
        ctx.beginPath();

        values.forEach((v, i) => {
            const x = pad + i * sx;
            const y = h - pad - (v - minV) * sy;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();
    }

    plot(valuesB, "rgba(30,142,99,.30)"); // خط فاتح
    plot(valuesA, "#1e8e63");            // خط غامق
}

function renderTable(rows) {
    const body = document.getElementById("historyBody");
    body.innerHTML = rows.map(r => `
    <tr>
      <td>${r.timestamp}</td>
      <td>${r.soilMoisture}%</td>
      <td>${r.soilTemperature}°C</td>
      <td>${r.airHumidity}%</td>
      <td>${r.lightIntensity} lx</td>
      <td>${r.soilPH}</td>
    </tr>
  `).join("");
}

async function loadHistory() {
    const msg = document.getElementById("historyMsg");
    msg.textContent = "";

    try {
        // لو عندك endpoint حقيقي غيّره هنا
        const res = await fetch("http://localhost:3000/api/sensors/history");
        if (!res.ok) throw new Error("No backend");

        const data = await res.json();
        // متوقع: data.rows = [{...}]
        const rows = data.rows || data || [];
        renderTable(rows);

        // chart: هنرسم moisture مثلا + خط ثانوي light
        const moisture = rows.map(x => Number(x.soilMoisture));
        const light = rows.map(x => Number(x.lightIntensity) / 20); // scaling للعرض
        drawChart(moisture, light);

    } catch (e) {
        // Mock
        const rows = [
            { timestamp: "2026-01-23 10:15", soilMoisture: 42, soilTemperature: 24, airHumidity: 55, lightIntensity: 780, soilPH: 6.8 },
            { timestamp: "2026-01-23 08:45", soilMoisture: 39, soilTemperature: 23, airHumidity: 57, lightIntensity: 760, soilPH: 6.7 }
        ];
        renderTable(rows);

        const moisture = rows.map(x => x.soilMoisture);
        const light = rows.map(x => x.lightIntensity / 20);
        drawChart(moisture, light);

        msg.textContent = "Showing demo history (backend not connected).";
    }
}

loadHistory();
