import { useTranslation } from "react-i18next";

export default function Admission() {
  const { t } = useTranslation("admission");

  return (
    <div>
      <h2>{t("form_title")}</h2>
      <button>{t("submit_button")}</button>
    </div>
  );
}
