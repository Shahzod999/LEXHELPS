import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import arAuth from "./ar/auth.json";
import deAuth from "./de/auth.json";
import enAuth from "./en/auth.json";
import esAuth from "./es/auth.json";
import frAuth from "./fr/auth.json";
import hiAuth from "./hi/auth.json";
import itAuth from "./it/auth.json";
import jaAuth from "./ja/auth.json";
import koAuth from "./ko/auth.json";
import ptAuth from "./pt/auth.json";
import ruAuth from "./ru/auth.json";
import zhAuth from "./zh/auth.json";

const resources = {
  en: {
    auth: enAuth,
  },
  es: {
    auth: esAuth,
  },
  ru: {
    auth: ruAuth,
  },
  fr: {
    auth: frAuth,
  },
  de: {
    auth: deAuth,
  },
  it: {
    auth: itAuth,
  },
  pt: {
    auth: ptAuth,
  },
  zh: {
    auth: zhAuth,
  },
  ja: {
    auth: jaAuth,
  },
  ko: {
    auth: koAuth,
  },
  ar: {
    auth: arAuth,
  },
  hi: {
    auth: hiAuth,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  ns: ["auth"],
  defaultNS: "auth",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
