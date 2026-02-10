"use client";
import { useTranslations } from "next-intl";
import { useAuthContext } from "../context/AuthProvider";
import { Button } from "./ui/button";
import { usePurchaseModal } from "../store/purchase-store";
import { AlertDialog, AlertDialogContent } from "./ui/alert-dialog";
import { CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import GlobalLoader from "./gloabal-loader";
import { useIsMobile } from "../hooks/use-mobile";

export default function UpgradeButton() {
  const t = useTranslations("Navbar");
  const { token } = useAuthContext();
  const { isOpen, openModal, closeModal } = usePurchaseModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && isOpen && contentRef.current) {
      setTimeout(() => {
        console.log("FUNC TRIGERED")
        contentRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [isOpen, isMobile]);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again.");
    } finally {
      // intentionally left to keep loader until redirect
    }
  };

  return (
    <>
      <Button onClick={openModal}>{t("subscription_button")}</Button>
      <AlertDialog open={isOpen} onOpenChange={closeModal}>
        <AlertDialogContent className="md:flex grid gap-2 min-w-[70vw] overflow-auto md:min-w-[781px] p-0 max-h-[80vh] md:min-h-[469px] justify-between items-center">
          <img
            src="/pro-banner.png"
            className="h-full md:w-1/2 w-[400px] rounded-l-xl"
            alt=""
          />
          <div className="p-5 flex flex-col justify-between gap-6 h-full w-full">
            <section className="md:gap-[24px] grid">
              <div className="gap-8 grid">
                <div className="flex justify-between w-full">
                  <h2 className="text-primary font-medium text-xl">Pro plan</h2>
                  <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-muted-foreground cursor-pointer"
                  >
                    X
                  </button>
                </div>
                <div className="grid gap-[9px]">
                  <h3 className="text-primary font-medium text-xl">999 RSD</h3>
                  <span className="text-sm">Pay once, use forever.</span>
                </div>
              </div>

              <div
                ref={contentRef}
                className="gap-3 grid mt-5 font-medium text-primary text-sm"
              >
                <span className="flex gap-3 items-center">
                  <CircleCheck height={16} width={16} /> Unlimited applications
                </span>
                <span className="flex gap-3 items-center">
                  <CircleCheck height={16} width={16} /> Advanced statistics
                </span>
                <span className="flex gap-3 items-center">
                  <CircleCheck height={16} width={16} /> More messages with AI
                  Chatbot
                </span>
                <span className="flex gap-3 items-center">
                  <CircleCheck height={16} width={16} /> Unlimited resumes
                </span>
                <span className="flex gap-3 items-center">
                  <CircleCheck height={16} width={16} /> Priority feature
                  updates
                </span>
              </div>

              <div className="w-full grid mt-5">
                <Button onClick={handleCheckout}>Upgrade to Pro</Button>
                <Button onClick={closeModal} variant={"ghost"}>
                  No thanks
                </Button>
              </div>
            </section>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {isProcessing && <GlobalLoader />}
    </>
  );
}
