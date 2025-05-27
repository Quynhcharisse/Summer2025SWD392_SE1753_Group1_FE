import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChangeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => handleChangeLang("vi")}
        className={i18n.language === "vi" ? "font-bold underline" : ""}
      >
        Tiếng Việt
      </button>{" "}
      |
      <button
        onClick={() => handleChangeLang("en")}
        className={i18n.language === "en" ? "font-bold underline" : ""}
      >
        English
      </button>
    </div>
  );
}
