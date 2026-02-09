import { useTranslations } from "next-intl";

export const ResumeHeader = () => {
  const t = useTranslations("ResumePage");
  return (
    <section className="md:w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] w-fit grid gap-5 p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
      <div className="grid gap-1 w-full border-b py-3">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>
    </section>
  );
};
