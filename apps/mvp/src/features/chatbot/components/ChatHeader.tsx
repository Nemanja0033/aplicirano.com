import { useTranslations } from "next-intl";

export const ChatHeader = () => {
  const t = useTranslations("ChatbotPage");
  return (
    <div className="w-full grid place-items-start p-4 border-b bg-white dark:bg-sidebar">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
    </div>
  );
};
