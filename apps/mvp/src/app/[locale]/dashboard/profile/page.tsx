"use client";

import Loader from "@/src/components/Loader";
import GlobalLoader from "@/src/components/gloabal-loader";
import { NotAuthScreen } from "@/src/components/NotAuthScreen";
import { useProfiles } from "@/src/features/profiles/hooks/useProfiles";
import { ProfileHeader } from "@/src/features/profiles/components/ProfileHeader";
import { ProfileList } from "@/src/features/profiles/components/ProfileList";
import { AddProfileForm } from "@/src/features/profiles/components/AddProfileForm";
import { DeleteProfileModal } from "@/src/features/profiles/components/DeleteProfileModal";

export default function ProfilePage() {
  const {
    t,
    token,
    profiles,
    isProfilesLoading,
    name,
    setName,
    isSubmitting,
    isAddingNewProfile,
    setIsAddingNewProfile,
    currentUserData,
    canCreate,
    handleCreate,
    confirmOpen,
    setConfirmOpen,
    selectedProfileToDelete,
    confirmDelete,
    onConfirmDelete,
    isDeleting,
  } = useProfiles();

  if (isProfilesLoading) {
    return <Loader type="NORMAL" />;
  }

  if (!token) {
    return <NotAuthScreen />;
  }

  return (
    <main className="w-full h-full flex justify-center items-start">
      {isDeleting && <GlobalLoader />}

      <DeleteProfileModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        selectedProfile={selectedProfileToDelete}
        onConfirm={onConfirmDelete}
        isDeleting={isDeleting}
      />

      <section className="p-3 w-full grid place-items-center gap-5">
        <ProfileHeader />

        <section className="w-full rounded-lg bg-white dark:bg-background p-5">
          <div className="grid gap-4 w-full">
            <div className="fle w-full items-center justify-between">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {t("used_label", { count: profiles?.length ?? 0 })}
                </span>
              </div>

              <AddProfileForm
                name={name}
                setName={setName}
                handleCreate={handleCreate}
                isSubmitting={isSubmitting}
                canCreate={canCreate}
                currentUserData={currentUserData}
              />
            </div>

            <ProfileList
              profiles={profiles}
              onDelete={confirmDelete}
              isDeleting={isDeleting}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
