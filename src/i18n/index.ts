import i18n from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
const localesPath = path.resolve(__dirname, "../i18n/", "locales");

console.log(
  "Translation path:",
  path.join(localesPath, "{{lng}}/translation.json"),
);

void i18n
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "pt"],
    backend: {
      loadPath: path.join(localesPath, "{{lng}}/translation.json"),
    },
    detection: {
      order: ["header", "querystring"],
      lookupHeader: "accept-language",
      lookupQuerystring: "lang",
    },
  });

export default i18n;
