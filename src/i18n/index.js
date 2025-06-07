import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enAdmission from "./locales/en/admission.json";
import enHome from "./locales/en/home.json";
import enForm from "./locales/en/form.json";
import viAdmission from "./locales/vi/admission.json";
import viHome from "./locales/vi/home.json";
import viForm from "./locales/vi/form.json";

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      home: viHome,
      admission: viAdmission,
      form: viForm,
    },
    en: {
      home: enHome,
      admission: enAdmission,
      form: enForm,
    },
  },
  lng: "vi",
  fallbackLng: "en",
  ns: ["home", "admission", "form"],
  defaultNS: "home",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
