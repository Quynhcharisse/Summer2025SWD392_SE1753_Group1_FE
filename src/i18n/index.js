import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enAdmission from "./locales/en/admission.json";
import enHome from "./locales/en/home.json";
import enForm from "./locales/en/form.json";
import enAuth from "./locales/en/auth.json";
import enParent from "./locales/en/parent.json";
import viAdmission from "./locales/vi/admission.json";
import viHome from "./locales/vi/home.json";
import viForm from "./locales/vi/form.json";
import viAuth from "./locales/vi/auth.json";
import viParent from "./locales/vi/parent.json";

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      home: viHome,
      admission: viAdmission,
      form: viForm,
      auth: viAuth,
      parent: viParent
    },
    en: {
      home: enHome,
      admission: enAdmission,
      form: enForm,
      auth: enAuth,
      parent: enParent
    },
  },
  lng: "en",
  fallbackLng: "en",
  ns: ["home", "admission", "form", "auth", "parent"],
  defaultNS: "home",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
