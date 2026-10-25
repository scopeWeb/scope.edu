(() => {
  const regions = [
    { en: "Africa", bn: "আফ্রিকা", places: [
      "Burkina Faso", "Cameroon", "Central African Republic", "Chad", "Democratic Republic of the Congo", "Mali", "Mozambique", "Niger", "Nigeria", "Somalia", "South Sudan", "Sudan", "Horn of Africa regional response"
    ] },
    { en: "Asia & Middle East", bn: "এশিয়া ও মধ্যপ্রাচ্য", places: [
      "Afghanistan", "Myanmar", "Occupied Palestinian Territory", "Syria", "Yemen", "Syria regional refugee response (3RP)", "Nepal — Rasuwa flood response"
    ] },
    { en: "Americas & Caribbean", bn: "আমেরিকা ও ক্যারিবীয় অঞ্চল", places: [
      "Colombia", "Cuba", "Haiti", "Honduras", "Venezuela", "Venezuela regional refugee and migrant response (RMRP)"
    ] },
    { en: "Europe", bn: "ইউরোপ", places: ["Ukraine"] },
    { en: "Regional & multi-country", bn: "আঞ্চলিক ও একাধিক দেশ", places: [
      "Sudan regional refugee response", "Horn of Africa regional migration response", "Syria regional refugee response", "Venezuela regional RMRP"
    ] }
  ];
  const container = document.getElementById("responseRegions");
  const language = () => document.documentElement.lang === "bn" ? "bn" : "en";

  function render() {
    const lang = language();
    container.innerHTML = regions.map((region) => `
      <section class="response-region">
        <h3>${region[lang]} <span>${lang === "bn" ? "আসছে" : "UPCOMING"}</span></h3>
        <div class="response-list">${region.places.map((place) => `<span class="response-chip">${place}</span>`).join("")}</div>
      </section>`).join("");
  }

  const toggle = document.getElementById("hubLangToggle");
  const getSavedLanguage = () => {
    try { return localStorage.getItem("scope-lang") === "bn" ? "bn" : "en"; }
    catch { return "en"; }
  };

  function setLanguage(language) {
    const lang = language === "bn" ? "bn" : "en";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-en][data-bn]").forEach((element) => {
      element.textContent = element.dataset[lang];
    });
    toggle.textContent = lang === "bn" ? "English" : "বাংলা";
    toggle.setAttribute("aria-label", lang === "bn" ? "Switch language to English" : "বাংলা ভাষায় দেখুন");
    try { localStorage.setItem("scope-lang", lang); } catch { /* Keep language for this page. */ }
    render();
  }

  setLanguage(getSavedLanguage());
  toggle.addEventListener("click", () => setLanguage(language() === "bn" ? "en" : "bn"));
})();
