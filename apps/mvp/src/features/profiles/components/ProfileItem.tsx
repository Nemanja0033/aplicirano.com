import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Profile } from "../types";

interface ProfileItemProps {
  profile: Profile;
  onDelete: (profile: { id: string; name: string }) => void;
  isDeleting: boolean;
}

export const ProfileItem = ({
  profile,
  onDelete,
  isDeleting,
}: ProfileItemProps) => {
  const t = useTranslations("ProfilePage");

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border dark:border-[#151046] bg-white dark:bg-sidebar">
      <div className="grid">
        <span className="font-medium">{profile.name}</span>
        <span className="text-sm text-muted-foreground">
          {t("created_label", {
            date: new Date(profile.createdAt).toLocaleDateString(),
          })}
        </span>
      </div>

      <button
        onClick={() => onDelete({ id: profile.id, name: profile.name })}
        disabled={isDeleting}
        className="text-red-700 cursor-pointer"
        aria-label={`Delete profile ${profile.name}`}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};
