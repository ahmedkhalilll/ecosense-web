// Landing chips + fake sensor updates
let mode = "realtime";

const chips = document.querySelectorAll(".chip");
const aiText = document.getElementById("aiText");
const aiStatus = document.getElementById("aiStatus");

const elMoist = document.getElementById("m_moist");
const elTemp = document.getElementById("m_temp");
const elPH = document.getElementById("m_ph");
const elLux = document.getElementById("m_lux");

chips?.forEach(btn => {
    btn.addEventListener("click", () => {
        chips.forEach(b => b.classList.remove("chip-active"));
        btn.classList.add("chip-active");
        mode = btn.dataset.chip;

        if (!aiText || !aiStatus) return;

        if (mode === "secure") {
            aiStatus.textContent = "Secured";
            aiText.textContent = "Data encryption enabled. Recommendations remain available.";
        } else {
            aiStatus.textContent = "Active";
            aiText.textContent = "Increase irrigation in next 24 hours";
        }
    });
});

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function tick() {
    if (!elMoist || mode !== "realtime") return;

    const moist = clamp(parseInt(elMoist.textContent, 10) + (Math.random() > .5 ? 1 : -1), 30, 60);
    const temp = clamp(parseInt(elTemp.textContent, 10) + (Math.random() > .6 ? 1 : 0) - (Math.random() > .7 ? 1 : 0), 18, 34);
    const ph = clamp((parseFloat(elPH.textContent) + (Math.random() - .5) * 0.08), 5.6, 7.6);
    const lux = clamp(parseInt(elLux.textContent, 10) + Math.round((Math.random() - .5) * 40), 200, 1200);

    elMoist.textContent = moist;
    elTemp.textContent = temp;
    elPH.textContent = ph.toFixed(1);
    elLux.textContent = lux;

    if (aiText) {
        if (moist < 38) aiText.textContent = "Soil is dry. Increase irrigation in next 24 hours.";
        else if (moist > 55) aiText.textContent = "Soil is wet. Reduce irrigation and check drainage.";
        else aiText.textContent = "Optimal moisture. Maintain current irrigation schedule.";
    }
}
setInterval(tick, 1200);

document.getElementById("googleBtn")?.addEventListener("click", () => {
    alert("Google sign-in placeholder ✅");
});
