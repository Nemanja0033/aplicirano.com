"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  BarChart3,
  Sparkles,
  FileText,
  Menu,
  X,
  Languages,
  Mail,
  Loader2,
  User,
} from "lucide-react";
import { translations } from "../i18n";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

export default function ApliciranoLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [lang, setLang] = useState("sr");
  const t = translations[lang];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mail, setMail] = useState(null);
  const [usersWait, setUsersWait] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/waitlist");
      const data = await res.json();
      setUsersWait(data);
    }

    fetchUsers();
  }, []);

  async function handleWaitlistSubmit(e) {
    e.preventDefault();

    try {
      if (mail.length === 0 || mail.length > 50) {
        toast.warning("Enter valid email");
        return;
      }

      setIsSubmitting(true);

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ waitlist_email_sendedr: mail }),
      });

      if (res.ok) {
        toast.success(
          lang === "en"
            ? "Successfully signed for waitlist"
            : "Uspešno prijavljivanje"
        );
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error(
        lang === "en"
          ? "Something went wrong, please check your email address"
          : "Nepoznata greška, proverite mejl"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const Feature = ({ icon: Icon, title, description, items }) => (
    <div className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const PricingCard = ({
    title,
    subtitle,
    price,
    features,
    isPro,
    ctaText,
  }) => (
    <div
      className={`relative rounded-3xl p-8 ${isPro ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl scale-105" : "bg-white border-2 border-gray-200"}`}
    >
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
          {lang === "sr" ? "Najpopularnije" : "Most Popular"}
        </div>
      )}
      <div className="text-center mb-8">
        <h3
          className={`text-2xl font-bold mb-2 ${isPro ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mb-4 ${isPro ? "text-purple-100" : "text-gray-600"}`}
        >
          {subtitle}
        </p>
        <div className="mb-6">
          <span
            className={`text-4xl font-bold ${isPro ? "text-white" : "text-gray-900"}`}
          >
            {price}
          </span>
        </div>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPro ? "text-purple-200" : "text-purple-500"}`}
            />
            <span className={isPro ? "text-purple-50" : "text-gray-700"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {location.href = '/auth'}}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
          isPro
            ? "bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {ctaText}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-lg shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Aplicirano.com
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                {t.nav.features}
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                {t.nav.pricing}
              </a>
              {/* <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all hover:shadow-lg">
                {t.nav.startFree}
              </button> */}

              <button
                onClick={() => setLang((perv) => (perv === "en" ? "sr" : "en"))}
                className="text-primary flex items-center gap-1 cursor-pointer hover:scale-110 transition-all"
              >
                <Languages size={18} strokeWidth={1} />{" "}
                {lang === "sr" ? "EN" : "SR"}
              </button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-gray-700 hover:text-purple-600"
              >
                {t.nav.features}
              </a>
              <a
                href="#pricing"
                className="block text-gray-700 hover:text-purple-600"
              >
                {t.nav.pricing}
              </a>
              <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                {t.nav.startFree}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative text-center max-w-5xl mx-auto overflow-hidden">
            {/* Fog / glow background */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-400/20 blur-[120px] rounded-full" />
            </div>

            {/* Badge */}
            <div className="inline-block animate-pulse mb-10 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium text-sm">
              {t.hero.badge}
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t.hero.titleMain}{" "}
              <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              {t.hero.subtitle}
            </p>

            {usersWait > 0 && (
              <div className="w-full flex items-center mb-3 animate-pulse justify-center gap-2">
                <span className="bg-gray-100 text-purple-400 z-30 flex items-center justify-center p-1 rounded-full w-10 h-10 border-2 border-gray-100">
                  <User />
                </span>
                <span className="bg-gray-100 relative right-7 z-20 text-purple-400 flex items-center justify-center p-1 rounded-full w-10 h-10 border-2 border-gray-100">
                  <User />
                </span>
                <span className="bg-gray-100 relative right-14 z-10 text-purple-400 flex items-center justify-center p-1 rounded-full w-10 h-10 border-2 border-gray-100">
                  <User />
                </span>
                <span className="text-purple-600 relative right-13">
                  {usersWait} {t.hero.waitlist_label ?? 0}
                </span>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/auth"
                onClick={() => setIsModalOpen(true)}
                className="group px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                {t.hero.ctaPrimary} 
              </a>

              <a
                href="#features"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all border-2 border-purple-200"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>

            <div className="w-auto mt-12">
              <video autoPlay loop muted playsInline className="rounded-4xl border-purple-200 border-5">
                <source src="/demo.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Note */}
            <p className="mt-6 text-sm text-gray-500">{t.hero.note}</p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t.problem.title}
            </h2>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-left">
              <p className="text-gray-700 mb-4 text-lg">{t.problem.intro}</p>

              <ul className="space-y-4">
                {t.problem.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-xl font-semibold text-purple-700">
                {t.problem.conclusion}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Feature
              icon={FileText}
              title={t.features.allApplications.title}
              description={t.features.allApplications.description}
              items={t.features.allApplications.items}
            />

            <Feature
              icon={BarChart3}
              title={t.features.analytics.title}
              description={t.features.analytics.description}
              items={t.features.analytics.items}
            />

            <Feature
              icon={Sparkles}
              title={t.features.ai.title}
              description={t.features.ai.description}
              items={t.features.ai.items}
            />

            <Feature
              icon={FileText}
              title={t.features.cvs.title}
              description={t.features.cvs.description}
              items={t.features.cvs.items}
            />

            {/* <Feature
              icon={FileText}
              title={t.features.atsResumeScan.title}
              description={t.features.atsResumeScan.description}
              items={t.features.atsResumeScan.items}
            /> */}
          </div>
        </div>
      </section>

      {/* Value */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">{t.value.title}</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.value.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all"
              >
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-purple-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            {t.audience.title}
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {t.audience.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-800 font-medium text-lg">
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-gray-600">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title={t.pricing.free.title}
              subtitle={t.pricing.free.subtitle}
              price={t.pricing.free.price}
              features={t.pricing.free.features}
              ctaText={t.pricing.free.cta}
              isPro={false}
            />

            <PricingCard
              title={t.pricing.pro.title}
              subtitle={t.pricing.pro.subtitle}
              price={t.pricing.pro.price}
              features={t.pricing.pro.features}
              ctaText={t.pricing.pro.cta}
              isPro
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            {t.finalCta.title}
          </h2>

          <p className="text-xl text-purple-100 mb-10">{t.finalCta.subtitle}</p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-3"
          >
            {t.finalCta.button}
          </button>

          <p className="mt-6 text-purple-200">{t.finalCta.note}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                Aplicirano
              </div>
              <p className="text-sm">{t.footer.description}</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">
                {t.footer.product}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.nav.features}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.nav.pricing}
                  </a>
                </li>
                <li>
                  <a href="/terms-of-service">{t.nav.terms}</a>
                </li>
                <li>
                  <a href="/privacy-policy">{t.nav.policy}</a>
                </li>
                <li>
                  {/* <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a> */}
                </li>
              </ul>
            </div>

            {/* <div>
              <h4 className="text-white font-semibold mb-4">
                {t.footer.security}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>🔒 Svi podaci su enkriptovani</li>
                <li>✓ Bez kartice za besplatan plan</li>
                <li>✓ GDPR compliant</li>
              </ul>
            </div> */}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>{t.footer.rights}</p>
          </div>
        </div>
      </footer>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-2 cursor-pointer"
            >
              x
            </button>
            <AlertDialogTitle className="flex gap-1 items-center">
              {lang === "en"
                ? "Join the waitlist"
                : "Prijavi se na listu cekanja"}
              <Mail size={20} strokeWidth={1} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "en"
                ? "Be the first one to try Aplicirano.com"
                : "Budi medju prvima koji koriste Aplicirano.com"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form className="grid gap-2" onSubmit={handleWaitlistSubmit}>
            <Input
              onChange={(e) => setMail(e.target.value)}
              placeholder={`e.g ${lang === "en" ? "jhondoe@gmail.com" : "petarpetrovic@gmail.com"}`}
              type="email"
              required={true}
              className="h-10 w-full"
            />
            <Button
              disabled={isSubmitting}
              type="subimt"
              className="bg-purple-600 rounded-sm p-5"
            >
              {lang === "en" ? "Submit" : "Potvrdi"}{" "}
              {isSubmitting && <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}