/* =====================================================
   1) بيانات الشركة والفريق — ده المكان الوحيد اللي هتعدل فيه
   ===================================================== */
const COMPANY = {
  name: "CENTRA",
  tagline: "Cybersecurity Team — Partnerships Follow-Up Portal",
  logo: "images/centra-logo.png"          // حط لوجو الشركة هنا
};

/* لإضافة مهندس: انسخ كتلة { ... } كاملة وعدل عليها.
   photo = مسار صورة الشخص | logo = مسار لوجو الشركة (داخل فولدر images) */
const TEAM = [
  { name: "Mohamed Abdelalim", role: "Cybersecurity Engineer", photo: "images/team/mohamed-abdelalim.jpg",
    partners: [
      { name: "F5",      logo: "images/partners/f5.png" },
      { name: "Splunk",  logo: "images/partners/splunk.png" },
      { name: "Tenable", logo: "images/partners/tenable.png" } ] },

  { name: "Anas Osama", role: "Cybersecurity Engineer", photo: "images/team/anas-osama.jpg",
    partners: [
      { name: "Fidelis Security", logo: "images/partners/fidelis.png" },
      { name: "Infoblox",         logo: "images/partners/infoblox.png" } ] },

  { name: "Mohab Hassan", role: "Cybersecurity Engineer", photo: "images/team/mohab-hassan.jpg",
    partners: [
      { name: "Proofpoint", logo: "images/partners/proofpoint.png" },
      { name: "Trellix",    logo: "images/partners/trellix.png" },
      { name: "Fortinet",   logo: "images/partners/fortinet.png" },
      { name: "A10",        logo: "images/partners/a10.png" },
      { name: "Utimaco",    logo: "images/partners/utimaco.png" },
      { name: "Thales",     logo: "images/partners/thales.png" } ] },

  { name: "Mohamed Nabil", role: "Cybersecurity Engineer", photo: "images/team/mohamed-nabil.jpg",
    partners: [ { name: "Cisco", logo: "images/partners/cisco.png" } ] },

  { name: "Nada Amr", role: "Cybersecurity Engineer", photo: "images/team/nada-amr.jpg",
    partners: [ { name: "Palo Alto Networks", logo: "images/partners/paloalto.png" } ] }
];

/* =====================================================
   2) دالة خانة الصورة (Slot)
   لو الصورة موجودة بتظهر، لو مش موجودة بيظهر placeholder
   وتقدر تضغط على الخانة وترفع صورة (معاينة مؤقتة فقط)
   ===================================================== */
const initials = n => n.split(" ").map(w => w[0]).slice(0, 2).join("");
const slot = (src, alt, placeholder) => `
  <label class="slot">
    <span class="ph">${placeholder}</span>
    <img src="${src}" alt="${alt}" onerror="this.remove()">
    <input type="file" accept="image/*">
  </label>`;

/* =====================================================
   3) بناء الصفحة
   ===================================================== */
// الهيدر
document.getElementById("companyName").textContent = COMPANY.name;
document.getElementById("companyLogo").innerHTML = slot(COMPANY.logo, COMPANY.name + " logo", "Upload<br>Logo");
document.getElementById("year").textContent = new Date().getFullYear();

// الإحصائيات
const totalPartners = TEAM.reduce((s, p) => s + p.partners.length, 0);
document.getElementById("stats").innerHTML = [
  [TEAM.length, "Engineers"], [totalPartners, "Partners"]
].map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");

// كروت المهندسين
document.getElementById("team").innerHTML = TEAM.map(p => `
  <article class="card">
    <div class="person">
      <div class="photo-wrap">${slot(p.photo, p.name, initials(p.name))}</div>
      <h2>${p.name}</h2>
      <div class="role">${p.role}</div>
      <div class="count">${p.partners.length} Partner${p.partners.length > 1 ? "s" : ""}</div>
    </div>
    <div class="divider"></div>
    <div class="partners">
      ${p.partners.map(c => `
        <div class="partner">
          <div style="height:76px">${slot(c.logo, c.name, c.name)}</div>
          <p>${c.name}</p>
        </div>`).join("")}
    </div>
  </article>`).join("");

/* =====================================================
   4) رفع صورة للمعاينة (بتظهر عندك بس لحد ما تعمل Refresh)
   للحفظ الدائم: حط الملف في فولدر images بنفس الاسم المكتوب فوق
   ===================================================== */
document.addEventListener("change", e => {
  if (!e.target.matches(".slot input")) return;
  const file = e.target.files[0], box = e.target.closest(".slot");
  if (!file) return;
  box.querySelector("img")?.remove();
  const img = new Image();
  img.src = URL.createObjectURL(file);
  box.prepend(img);
});

/* =====================================================
   5) ظهور الكروت تدريجياً عند النزول (Animation)
   ===================================================== */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { setTimeout(() => en.target.classList.add("show"), en.target.dataset.d); io.unobserve(en.target); }
}), { threshold: .1 });
document.querySelectorAll(".card").forEach((c, i) => { c.dataset.d = i * 120; io.observe(c); });

/* =====================================================
   6) كتابة الـ Tagline بتأثير الكتابة (Typing)
   ===================================================== */
const tg = document.getElementById("tagline"); let k = 0;
(function type(){ tg.textContent = COMPANY.tagline.slice(0, k++); if (k <= COMPANY.tagline.length) setTimeout(type, 45); })();

/* =====================================================
   7) خلفية الشبكة المتحركة (نقاط وخطوط)
   ===================================================== */
const cv = document.getElementById("bg"), cx = cv.getContext("2d");
let W, H, pts = [];
function resize(){ W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({ length: Math.min(80, W / 18) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 })); }
addEventListener("resize", resize); resize();
(function draw(){
  cx.clearRect(0, 0, W, H);
  pts.forEach((a, i) => {
    a.x = (a.x + a.vx + W) % W; a.y = (a.y + a.vy + H) % H;
    cx.fillStyle = "rgba(0,229,255,.7)"; cx.fillRect(a.x, a.y, 2, 2);
    for (let j = i + 1; j < pts.length; j++) {
      const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) { cx.strokeStyle = `rgba(0,229,255,${.18 * (1 - d / 130)})`; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
    }
  });
  requestAnimationFrame(draw);
})();
