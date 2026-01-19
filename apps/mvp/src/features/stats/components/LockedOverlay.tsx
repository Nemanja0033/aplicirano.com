import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

const LockedOverlay = () => {
  const t = useTranslations("StatsPage");

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
      <span className="text-white font-semibold text-lg">
        {t("locked_title")}
      </span>
      <span className="text-gray-200 text-sm text-center mt-1">{t("locked_subtitle")}</span>
      <Button className="mt-3">{t("upgrade_button")}</Button>
    </div>
  );
};

export default LockedOverlay;
