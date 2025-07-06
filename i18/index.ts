import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import arAuth from "./ar/auth.json";
import arCommon from "./ar/common.json";
import deAuth from "./de/auth.json";
import deCommon from "./de/common.json";
import enAuth from "./en/auth.json";
import enCommon from "./en/common.json";
import esAuth from "./es/auth.json";
import esCommon from "./es/common.json";
import frAuth from "./fr/auth.json";
import frCommon from "./fr/common.json";
import hiAuth from "./hi/auth.json";
import hiCommon from "./hi/common.json";
import itAuth from "./it/auth.json";
import itCommon from "./it/common.json";
import jaAuth from "./ja/auth.json";
import jaCommon from "./ja/common.json";
import koAuth from "./ko/auth.json";
import koCommon from "./ko/common.json";
import ptAuth from "./pt/auth.json";
import ptCommon from "./pt/common.json";
import ruAuth from "./ru/auth.json";
import ruCommon from "./ru/common.json";
import zhAuth from "./zh/auth.json";
import zhCommon from "./zh/common.json";
import uzAuth from "./uz/auth.json";
import uzCommon from "./uz/common.json";

const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
  },
  es: {
    auth: esAuth,
    common: esCommon,
  },
  ru: {
    auth: ruAuth,
    common: ruCommon,
  },
  fr: {
    auth: frAuth,
    common: frCommon,
  },
  de: {
    auth: deAuth,
    common: deCommon,
  },
  it: {
    auth: itAuth,
    common: itCommon,
  },
  pt: {
    auth: ptAuth,
    common: ptCommon,
  },
  zh: {
    auth: zhAuth,
    common: zhCommon,
  },
  ja: {
    auth: jaAuth,
    common: jaCommon,
  },
  ko: {
    auth: koAuth,
    common: koCommon,
  },
  ar: {
    auth: arAuth,
    common: arCommon,
  },
  hi: {
    auth: hiAuth,
    common: hiCommon,
  },
  uz: {
    auth: uzAuth,
    common: uzCommon,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  ns: ["auth", "common"],
  defaultNS: "auth",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
