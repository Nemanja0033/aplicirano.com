import { useTranslations } from "next-intl";

export const ResumeHeader = () => {
  const t = useTranslations("ResumePage");
  return (
    <section className="md:w-full w-fit grid gap-5 p-2 bg-white dark:bg-sidebar">
      <div className="grid gap-1 w-full border-b py-3">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>
    </section>
  );
};
