async function buildNav() {
    const header = document.querySelector(".topbar");
    if (!header) return;

    const pages = await fetch("assets/data/pages.json").then(r => r.json());
    const current = (location.pathname.split("/").pop() || "main.html").toLowerCase();

    const token = localStorage.getItem("token");
    const visible = pages.filter(p => (p.auth ? !!token : true));

    // لو انت عايز تخفي Register/Login بعد ما يسجل دخول
    // ممكن تزود شرط هنا

    // اجبار: لو auth page ومفيش token -> يرجع main
    const currentPage = pages.find(p => p.href.toLowerCase() === current);
    if (currentPage?.auth && !token) location.href = "main.html";

    const navLinks = visible.map(p => `
    <a class="nav-link ${p.href.toLowerCase() === current ? "active" : ""}" href="${p.href}">
    ${p.title}
    </a>
    `).join("");

    // لو الصفحة عندها topbar بالفعل، هنضيف links جنبها
    // لازم يكون عندك مكان للـ nav داخل الهيدر
    let nav = header.querySelector(".nav-links");
    if (!nav) {
        nav = document.createElement("nav");
        nav.className = "nav-links";
        header.appendChild(nav);
    }
    nav.innerHTML = navLinks;
}

buildNav();
