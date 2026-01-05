"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, BarChart3, Sparkles, FileText, ArrowRight, Menu, X } from 'lucide-react';

export default function ApliciranoLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const PricingCard = ({ title, subtitle, price, features, isPro, ctaText }) => (
    <div className={`relative rounded-3xl p-8 ${isPro ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl scale-105' : 'bg-white border-2 border-gray-200'}`}>
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
          Najpopularnije
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold mb-2 ${isPro ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm mb-4 ${isPro ? 'text-purple-100' : 'text-gray-600'}`}>{subtitle}</p>
        <div className="mb-6">
          <span className={`text-4xl font-bold ${isPro ? 'text-white' : 'text-gray-900'}`}>{price}</span>
        </div>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPro ? 'text-purple-200' : 'text-purple-500'}`} />
            <span className={isPro ? 'text-purple-50' : 'text-gray-700'}>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
        isPro 
          ? 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl' 
          : 'bg-purple-600 text-white hover:bg-purple-700'
      }`}>
        {ctaText}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Aplicirano.com
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Mogućnosti</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">Cene</a>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all hover:shadow-lg">
                Započni besplatno
              </button>
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-purple-600">Mogućnosti</a>
              <a href="#pricing" className="block text-gray-700 hover:text-purple-600">Cene</a>
              <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                Započni besplatno
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium text-sm">
              ✨ Dostupno od 31. Januara!
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Aplicirano - lakši način da pratiš{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                prijave za posao
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Sve tvoje prijave, statistika i pametni alati na jednom mestu. Bez haosa. Bez gubljenja vremena. Bez zaboravljenih prijava.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                Započni besplatno
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all border-2 border-purple-200">
                Pogledaj kako funkcioniše
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Bez kreditne kartice • Instant pristup • Otkaži kad god želiš
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Traženje posla ne mora da bude haotično
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-left">
              <p className="text-gray-700 mb-4 text-lg">Ako si ikada:</p>
              <ul className="space-y-4">
                {[
                  'Zaboravio gde si poslao prijavu',
                  'Slao isti CV na različite pozicije',
                  'Čekao odgovor bez ikakvog pregleda napretka'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xl font-semibold text-purple-700">
                ...Aplicirano je napravljeno za tebe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Sve što ti treba na jednom mestu
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Organizuj prijave, prati napredak i donosi pametnije odluke
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Feature
              icon={FileText}
              title="Sve prijave na jednom mestu"
              description="Dodaj, uvezi i prati sve svoje prijave za posao — brzo i jednostavno. Bez Excela, bez beleški, bez gubljenja konteksta."
              items={[
                'Dodavanje i ažuriranje prijava',
                'Import iz CSV / TXT fajlova',
                'Praćenje statusa po poziciji',
                'Brz pregled svih aktivnosti'
              ]}
            />
            <Feature
              icon={BarChart3}
              title="Vidi šta funkcioniše — a šta ne"
              description="Aplicirano ti daje jasan uvid u tvoje rezultate. Koliko prijava šalješ, gde dobijaš odgovore i koliko proces traje."
              items={[
                'Pregled broja prijava',
                'Odzivi i vremenski tok',
                'Analiza napretka kroz vreme',
                'Donošenje odluka na osnovu podataka'
              ]}
            />
            <Feature
              icon={Sparkles}
              title="Pametna pomoć kada ti je najpotrebnija"
              description="AI asistent ti pomaže da budeš korak ispred. Postavljaj pitanja, pripremaj CV i cover lettere i planiraj sledeće korake."
              items={[
                'AI odgovori vezani za tvoje prijave',
                'Pomoć pri pisanju CV-ja i cover lettera',
                'Saveti za naredne korake',
                'Manje stresa, više fokusa'
              ]}
            />
            <Feature
              icon={FileText}
              title="Sve verzije CV-ja, uredno na jednom mestu"
              description="Čuvaj više verzija svog CV-ja i lako izaberi pravi prilikom svake prijave. Idealno za različite pozicije i tehnologije."
              items={[
                'Više CV verzija po korisniku',
                'Jasni nazivi i pregled',
                'Povezivanje CV-ja sa prijavama',
                'Manje grešaka, bolja organizacija'
              ]}
            />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Zašto Aplicirano?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Za IT tržište', desc: 'Napravljeno sa razumevanjem IT hiring procesa' },
              { title: 'Fokus na produktivnost', desc: 'Bez komplikacija, samo ono što ti treba' },
              { title: 'Realan pristup', desc: 'Prilagođeno stvarnom procesu zapošljavanja' },
              { title: 'Raste sa tobom', desc: 'Od prvog razgovora do prvog radnog dana' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-purple-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Kome je Aplicirano namenjeno?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              'Juniorima koji šalju mnogo prijava',
              'Medior i senior developerima',
              'Svima u IT sektoru koji žele red i kontrolu',
              'Kandidatima koji žele pametniji pristup traženju posla'
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-800 font-medium text-lg">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Jednostavno i pošteno plaćanje
            </h2>
            <p className="text-xl text-gray-600">
              Počni besplatno, nadogradi kad ti odgovara
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Besplatno"
              subtitle="Za početak i testiranje"
              price="0 RSD"
              features={[
                'Do 1000 prijava',
                'Osnovna statistika',
                'Ograničen AI pristup',
                'Do 3 CV verzije'
              ]}
              ctaText="Započni besplatno"
              isPro={false}
            />
            <PricingCard
              title="Pro"
              subtitle="Jednom plati — koristi zauvek"
              price="One-time"
              features={[
                'Neograničen broj prijava',
                'Kompletna statistika',
                'Veći AI limit mesečno',
                'Neograničen broj CV verzija',
                'Prioritetni feature update-ovi'
              ]}
              ctaText="Otključaj Pro verziju"
              isPro={true}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Manje haosa. Više fokusa. Bolji rezultati.
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Aplicirano ti pomaže da ostaneš organizovan i povećaš šanse za uspeh.
          </p>
          <button className="px-10 py-5 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-3">
            Započni besplatno danas
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="mt-6 text-purple-200">
            ✓ Bez kreditne kartice • ✓ Setup za 2 minuta • ✓ Potpuna kontrola
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">Aplicirano</div>
              <p className="text-sm">
                Alat koji ti pomaže da pratiš prijave i poboljšaš proces traženja posla.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Proizvod</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Mogućnosti</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cene</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Sigurnost</h4>
              <ul className="space-y-2 text-sm">
                <li>🔒 Svi podaci su enkriptovani</li>
                <li>✓ Bez kartice za besplatan plan</li>
                <li>✓ GDPR compliant</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 Aplicirano. Sva prava zadržana.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}