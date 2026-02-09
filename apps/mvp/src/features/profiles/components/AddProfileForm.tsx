import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

interface AddProfileFormProps {
  isAddingNewProfile: boolean;
  setIsAddingNewProfile: (val: boolean) => void;
  name: string;
  setName: (val: string) => void;
  handleCreate: (e?: React.FormEvent) => void;
  isSubmitting: boolean;
  canCreate: boolean;
  currentUserData: any;
}

export const AddProfileForm = ({
  isAddingNewProfile,
  setIsAddingNewProfile,
  name,
  setName,
  handleCreate,
  isSubmitting,
  canCreate,
  currentUserData,
}: AddProfileFormProps) => {
  const t = useTranslations("ProfilePage");

  if (!isAddingNewProfile) {
    return (
      <button
        onClick={() => setIsAddingNewProfile(true)}
        className="flex items-center justify-between p-5 hover:opacity-70 transition-all cursor-pointer rounded-lg border dark:border-[#151046] bg-white dark:bg-sidebar"
      >
        <span>{t("add_button")}</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleCreate}
      className="flex items-center justify-start w-full gap-3 h-fit"
    >
      <div className="grid w-full">
        <Input
          className="w-full h-12"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("form_placeholder")}
          disabled={!canCreate || isSubmitting}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          className="h-12"
          type="submit"
          disabled={isSubmitting || currentUserData?.profileLimit === 0}
        >
          {isSubmitting
            ? t("form_creating")
            : currentUserData?.profileLimit !== 0
              ? t("form_create")
              : t("form_limit")}
        </Button>
      </div>
    </form>
  );
};
