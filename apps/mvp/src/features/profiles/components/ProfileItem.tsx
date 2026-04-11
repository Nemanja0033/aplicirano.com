import { EllipsisVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Profile } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

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
    <div className="flex items-center justify-between p-[24px] rounded-[8px] md:w-[356px] border bg-white dark:bg-sidebar">
      <div className="grid">
        <span className="font-medium">{profile.name}</span>
        <span className="text-sm text-muted-foreground">
          {t("created_label", {
            date: new Date(profile.createdAt).toLocaleDateString(),
          })}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="text-muted-foreground cursor-pointer">
            <EllipsisVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <button
              onClick={() => onDelete({ id: profile.id, name: profile.name })}
              disabled={isDeleting}
              className="text-sm flex gap-2 items-center cursor-pointer"
              aria-label={`Delete profile ${profile.name}`}
            >
              <Trash2 size={15} />
              Delete profile
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* 
      <button
        onClick={() => onDelete({ id: profile.id, name: profile.name })}
        disabled={isDeleting}
        className="text-red-700 cursor-pointer"
        aria-label={`Delete profile ${profile.name}`}
      >
        <Trash2 size={20} />
      </button> */}
    </div>
  );
};
