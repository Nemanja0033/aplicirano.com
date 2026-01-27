"use client";

import { useTranslations } from "next-intl";
import { useAuthContext } from "../context/AuthProvider";
import { Button } from "./ui/button";

export default function UpgradeButton() {
  const t = useTranslations("Navbar");
  const { token } = useAuthContext();
  const handleUpgrade = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
    >
      {t("subscription_button")}
    </Button>
  );
}
