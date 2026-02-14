const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const imgMsg = document.getElementById("imgMsg");

const previewImg = document.getElementById("previewImg");
const previewPlaceholder = document.getElementById("previewPlaceholder");

let selectedFile = null;

function showPreview(file) {
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.style.display = "block";
    previewPlaceholder.style.display = "none";
}

function setFile(file) {
    selectedFile = file;
    uploadBtn.disabled = !file;
    imgMsg.textContent = file ? `Selected: ${file.name}` : "";
    if (file) showPreview(file);
}

dropzone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
});

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
});

async function uploadToBackend(file) {
    const base = "http://localhost:3000";
    const token = localStorage.getItem("token");

    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(base + "/images/upload", {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: fd
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data;
}

uploadBtn.addEventListener("click", async () => {
    imgMsg.textContent = "";
    if (!selectedFile) return;

    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";

    try {
        const data = await uploadToBackend(selectedFile);

        imgMsg.textContent = "Uploaded ✅";

        // لو الباك بيرجع prediction مثلاً
        const resultBox = document.getElementById("resultBox");
        const resultText = document.getElementById("resultText");
        resultBox.style.display = "block";

        resultText.textContent =
            data.prediction || data.result || data.message || "Uploaded successfully";

    } catch (err) {
        console.log(err);
        imgMsg.textContent = "Preview only (backend not connected) ✅";
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload";
    }
});
