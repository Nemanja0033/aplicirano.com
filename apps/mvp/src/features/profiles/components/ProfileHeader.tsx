import { useTranslations } from "next-intl";

export const ProfileHeader = () => {
  const t = useTranslations("ProfilePage");
  return (
    <section className="w-full grid place-items-start p-4 border-b bg-white dark:bg-sidebar">
      <div className="grid gap-1 w-full">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>
    </section>
  );
};
