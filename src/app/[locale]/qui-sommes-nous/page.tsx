import Header from '@/components/sections/header';
import Image from 'next/image';
import { Award, Heart, Shield, Users, Star, MapPin, Calendar, ThumbsUp } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: "Authenticité",
    description: "Nous privilégions les expériences locales authentiques pour vous immerger dans la vraie culture marocaine"
  },
  {
    icon: Award,
    title: "Qualité",
    description: "Des services de haute qualité avec des guides professionnels et passionnés par leur métier"
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Votre sécurité et votre confort sont nos priorités absolues à chaque étape du voyage"
  },
  {
    icon: Users,
    title: "Flexibilité",
    description: "Des circuits et excursions adaptés à vos besoins, préférences et rythme de voyage"
  }
];

const timeline = [
  {
    year: "2015",
    title: "Fondation",
    description: "Création de Diffa Tours avec une vision : faire découvrir le Maroc authentique"
  },
  {
    year: "2017",
    title: "Expansion",
    description: "Extension de nos services à toutes les régions du Maroc"
  },
  {
    year: "2019",
    title: "Reconnaissance",
    description: "Plus de 5000 voyageurs satisfaits et nombreux prix d'excellence"
  },
  {
    year: "2023",
    title: "Innovation",
    description: "Lancement de circuits éco-responsables et expériences immersives"
  }
];

const stats = [
  { number: "10+", label: "Années d'expérience" },
  { number: "15,000+", label: "Voyageurs satisfaits" },
  { number: "200+", label: "Circuits différents" },
  { number: "50+", label: "Guides experts" }
];

const journey = [
  {
    step: 1,
    icon: MapPin,
    title: "Choisissez votre destination",
    description: "Sélectionnez parmi nos nombreuses excursions"
  },
  {
    step: 2,
    icon: Calendar,
    title: "Réservez facilement",
    description: "Réservation simple et paiement sécurisé"
  },
  {
    step: 3,
    icon: Users,
    title: "Rencontrez votre guide",
    description: "Guides locaux experts et passionnés"
  },
  {
    step: 4,
    icon: ThumbsUp,
    title: "Vivez l'expérience",
    description: "Profitez d'un voyage inoubliable"
  }
];

export default function QuiSommesNousPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/moroccan-tour-company-team-spirit-divers-ed042805-20251124133347.jpg"
            alt="Qui Sommes-Nous - Diffa Tours"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-display font-light mb-4">Qui Sommes-Nous</h1>
              <p className="text-lg md:text-xl font-body max-w-2xl mx-auto">
                Votre partenaire de confiance pour découvrir le Maroc
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 md:py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h6 className="text-xs font-bold uppercase tracking-[2px] text-muted mb-4">
              NOTRE HISTOIRE
            </h6>
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6">
              Diffa Tours, experts du tourisme marocain
            </h2>
            <p className="text-body-lg text-muted leading-relaxed mb-6">
              <strong className="text-primary">Diffa Tours</strong> est une agence de voyage spécialisée dans l'organisation 
              d'excursions et de circuits au Maroc. Avec une passion profonde pour notre pays et une connaissance approfondie 
              de ses richesses culturelles et naturelles, nous créons des expériences de voyage authentiques et mémorables.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-white/90 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Cards Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h6 className="text-xs font-bold uppercase tracking-[2px] text-muted mb-4">
                NOS VALEURS
              </h6>
              <h2 className="text-3xl md:text-4xl font-display text-foreground">
                Ce qui nous anime
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 border-t-4 border-primary"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl mb-3 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 md:py-24 px-4 bg-secondary">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h6 className="text-xs font-bold uppercase tracking-[2px] text-muted mb-4">
                NOTRE PARCOURS
              </h6>
              <h2 className="text-3xl md:text-4xl font-display text-foreground">
                Une histoire de passion et d'engagement
              </h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/30"></div>

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div 
                    key={index} 
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white p-6 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                        <div className="text-3xl font-display font-bold text-primary mb-2">
                          {item.year}
                        </div>
                        <h3 className="font-display text-xl mb-2 text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex w-2/12 justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg z-10"></div>
                    </div>

                    {/* Empty space for alignment */}
                    <div className="hidden md:block w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Customer Journey Roadmap */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h6 className="text-xs font-bold uppercase tracking-[2px] text-muted mb-4">
                VOTRE VOYAGE AVEC NOUS
              </h6>
              <h2 className="text-3xl md:text-4xl font-display text-foreground">
                Comment nous travaillons
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {journey.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Arrow for desktop */}
                    {index < journey.length - 1 && (
                      <div className="hidden lg:block absolute top-12 right-0 transform translate-x-1/2 z-0">
                        <svg className="w-8 h-8 text-primary/30" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="bg-white p-6 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 relative z-10">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 font-display text-xl font-bold">
                        {step.step}
                      </div>
                      <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="font-display text-lg mb-2 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h6 className="text-xs font-bold uppercase tracking-[2px] text-muted mb-4">
                POURQUOI DIFFA TOURS
              </h6>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-8">
                Pourquoi choisir Diffa Tours ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { icon: Star, text: "Guides locaux expérimentés et passionnés" },
                { icon: MapPin, text: "Itinéraires personnalisables selon vos envies" },
                { icon: Users, text: "Petits groupes pour une expérience plus intime" },
                { icon: Award, text: "Prix transparents et compétitifs" },
                { icon: Shield, text: "Service client disponible 24/7" },
                { icon: Heart, text: "Expertise locale et connaissance approfondie du terrain" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-4 bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed pt-2">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg text-center">
              <p className="font-script italic text-2xl md:text-3xl text-primary mb-8">
                Laissez-nous vous guider vers une aventure inoubliable au cœur du Maroc
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Contactez-nous
                </a>
                <a 
                  href="/nos-excursions" 
                  className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded text-sm font-semibold uppercase tracking-wider hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Découvrir nos excursions
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}