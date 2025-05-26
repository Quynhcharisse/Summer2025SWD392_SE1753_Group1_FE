import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../molecules/LanguageSwitcher";

export default function Home() {
  const { t } = useTranslation("home");
  useEffect(() => {
    document.title = t("welcome") + " - Sunshine Preschool";
  }, []);
  return (
    <div>
      <LanguageSwitcher />
      <h1>{t("welcome")}</h1>
      <Link to="/admission">{t("admission_link")}</Link>
      <button>{t("enroll_button")}</button>
    </div>
  );
}
