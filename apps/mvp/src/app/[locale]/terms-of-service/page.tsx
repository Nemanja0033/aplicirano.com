"use client";

import { useTranslations } from "next-intl";

export default function TermsOfService() {
  const t = useTranslations("TermsOfService");

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      <p>{t("last_updated")}</p>

      <p>{t("intro")}</p>

      <section>
        <h2 className="text-xl font-semibold">{t("section1.title")}</h2>
        <p>{t("section1.content")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section2.title")}</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t("section2.item_accuracy")}</li>
          <li>{t("section2.item_misuse")}</li>
          <li>{t("section2.item_illegal")}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section3.title")}</h2>
        <p>{t("section3.content")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section4.title")}</h2>
        <p>{t("section4.content")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section5.title")}</h2>
        <p>{t("section5.content")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section6.title")}</h2>
        <p>{t("section6.content")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section7.title")}</h2>
        <p>{t("section7.content")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section8.title")}</h2>
        <p>{t("section8.intro")}</p>
        <p className="font-medium">{t("section8.contact_email")}</p>
      </section>
    </main>
  );
}
