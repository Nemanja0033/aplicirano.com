import { useTranslations } from "next-intl";

export const ChatHeader = () => {
  const t = useTranslations("ChatbotPage");
  return (
    <div className="w-full dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] grid place-items-start p-5 rounded-lg shadow-md bg-white dark:bg-sidebar">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
    </div>
  );
};
