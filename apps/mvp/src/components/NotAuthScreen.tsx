import { useTranslations } from "next-intl";
import { Button } from "./ui/button";

export const NotAuthScreen = () => {
  const t = useTranslations("AuthScreen");
  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <div className="grid gap-5">
        <img src="/auth-anim.svg" className="w-96" alt="" />
        <h1 className="text-muted-foreground text-3xl">
          {t("label")}
        </h1>
        <Button onClick={() => {location.href = '/auth'}} size={"lg"} className="h-16">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
};
