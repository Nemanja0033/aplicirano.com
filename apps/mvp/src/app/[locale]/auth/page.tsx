"use client";
import { Button } from "@/src/components/ui/button";
import { useAuthContext } from "@/src/context/AuthProvider";
import { useAuth } from "@/src/features/user/hooks/useAuth";
import { useRouter } from "@/src/i18n/navigation";
import { signInWithPopup } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebaseConfig";
import { toast } from "sonner";

export default function AuthPage() {
  const { user } = useAuthContext();
  const t = useTranslations("AuthPage");
  const m = useTranslations("AuthMarketing");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { handleSignIn } = useAuth();
  const router = useRouter();
  const { token } = useAuthContext();

  // useEffect(() => {
  //   if(token){
  //     location.href = '/dashboard'
  //   }
  // }, [token]);

  async function signIn() {
    await handleSignIn();
    location.href = "/dashboard";
  }

  async function login() {
    try {
      const signInObserver = await signInWithPopup(auth, provider);
      const token = await signInObserver.user.getIdToken();

      const res = await fetch("/api/auth/", {
        method: "POST",
        body: JSON.stringify({ isLogin: true }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        const message =
          typeof errorData?.error === "string"
            ? errorData.error
            : t("error_upload_failed");
        toast.error(message);

        return;
      }

      location.href = "/dashboard";
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* MARKETING SIDE */}
      <section className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/90 to-primary text-white">
        <div>
          <h1 className="text-4xl font-semibold leading-tight whitespace-pre-line">
            {m("headline")}
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-md">
            {m("description")}
          </p>
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <p>✔ {m("features.one")}</p>
          <p>✔ {m("features.two")}</p>
          <p>✔ {m("features.three")}</p>
        </div>
      </section>

      {/* AUTH SIDE */}
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 grid gap-3 text-center">
            <img
              src="/auth.svg"
              alt="Auth illustration"
              className="w-64 mx-auto"
            />
            <h2 className="text-3xl font-semibold">{t("title")}</h2>
            <p className="text-muted-foreground text-xl">{t("subtitle")}</p>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 cursor-pointer"
            />
            <label htmlFor="terms" className="text-muted-foreground">
              {t("terms_label")}{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                className="underline text-primary"
              >
                {t("terms_link")}
              </a>
            </label>
          </div>

          {/* AUTH BUTTON */}
          <Button
            disabled={!acceptedTerms}
            onClick={signIn}
            size="lg"
            className="w-full h-16 text-base font-medium flex gap-3"
          >
            <img src="/google.svg" className="w-5" alt="" />
            {t("google_auth")}
          </Button>
          <div className="grid gap-2">
            <span className="text-muted-foreground text-sm">
              {t("have_acc")}
            </span>
            <Button onClick={login} size={"lg"} className="h-16">
              {t("google_login")}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
