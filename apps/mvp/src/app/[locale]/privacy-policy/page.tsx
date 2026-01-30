"use client";

import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      <p>{t("last_updated")}</p>

      <p>{t("intro")}</p>

      <section>
        <h2 className="text-xl font-semibold">{t("section1.title")}</h2>
        <p>{t("section1.intro")}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t("section1.item_account")}</li>
          <li>{t("section1.item_applications")}</li>
          <li>{t("section1.item_documents")}</li>
          <li>{t("section1.item_usage")}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section2.title")}</h2>
        <p>{t("section2.intro")}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t("section2.item_provide")}</li>
          <li>{t("section2.item_enable")}</li>
          <li>{t("section2.item_improve")}</li>
          <li>{t("section2.item_support")}</li>
        </ul>
        <p>{t("section2.no_sell")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section3.title")}</h2>
        <p>{t("section3.intro1")}</p>
        <p>{t("section3.intro2")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section4.title")}</h2>
        <p>{t("section4.intro1")}</p>
        <p>{t("section4.intro2")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section5.title")}</h2>
        <p>{t("section5.intro")}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t("section5.item_access")}</li>
          <li>{t("section5.item_request")}</li>
          <li>{t("section5.item_withdraw")}</li>
        </ul>
        <p>{t("section5.manage_account")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{t("section6.title")}</h2>
        <p>{t("section6.intro")}</p>
        <p className="font-medium">{t("section6.contact_email")}</p>
      </section>
    </main>
  );
}
