(() => {
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
    document.querySelectorAll("[data-en-aria][data-bn-aria]").forEach((element) => {
      element.setAttribute("aria-label", element.dataset[`${lang}Aria`]);
    });
    toggle.textContent = lang === "bn" ? "English" : "বাংলা";
    toggle.setAttribute("aria-label", lang === "bn" ? "Switch language to English" : "বাংলা ভাষায় দেখুন");
    try { localStorage.setItem("scope-lang", lang); } catch { /* Language remains available for this page. */ }
  }

  setLanguage(getSavedLanguage());
  toggle.addEventListener("click", () => {
    setLanguage(document.documentElement.lang === "bn" ? "en" : "bn");
  });
})();
