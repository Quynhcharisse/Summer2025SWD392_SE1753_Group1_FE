import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enAdmission from "./locales/en/admission.json";
import enHome from "./locales/en/home.json";
import viAdmission from "./locales/vi/admission.json";
import viHome from "./locales/vi/home.json";

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      home: viHome,
      admission: viAdmission,
    },
    en: {
      home: enHome,
      admission: enAdmission,
    },
  },
  lng: "vi",
  fallbackLng: "en",
  ns: ["home", "admission"],
  defaultNS: "home",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
