import Image from 'next/image';
import { Car, Plane, Hotel, Users, MapPin, Utensils } from 'lucide-react';
import Header from '@/components/sections/header';

const services = [
  {
    icon: Car,
    title: "Location de véhicules",
    description: "Louez des véhicules confortables avec ou sans chauffeur pour vos déplacements au Maroc. Options 4x4, minibus et voitures de luxe disponibles."
  },
  {
    icon: Plane,
    title: "Transferts aéroport",
    description: "Service de transfert professionnel depuis et vers tous les aéroports du Maroc. Ponctualité et confort garantis."
  },
  {
    icon: Hotel,
    title: "Réservation d'hébergements",
    description: "Réservation de riads, hôtels et hébergements traditionnels dans toutes les villes du Maroc selon votre budget."
  },
  {
    icon: Users,
    title: "Guides privés",
    description: "Guides touristiques professionnels parlant plusieurs langues pour vous accompagner lors de vos visites."
  },
  {
    icon: MapPin,
    title: "Circuits sur mesure",
    description: "Conception d'itinéraires personnalisés adaptés à vos envies, votre budget et la durée de votre séjour."
  },
  {
    icon: Utensils,
    title: "Expériences culinaires",
    description: "Cours de cuisine marocaine, dîners traditionnels et découverte de la gastronomie locale avec des chefs."
  }
];

export default function AutresServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/professional-travel-services-scene-in-mo-0a833c10-20251124133346.jpg"
            alt="Autres Services - Diffa Tours"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-display font-light mb-4">Autres Services</h1>
              <p className="text-lg md:text-xl font-body max-w-2xl mx-auto">
                Des services complets pour un voyage sans souci
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h6 className="text-xs font-bold uppercase tracking-[2px] text-muted mb-4">
                SERVICES COMPLÉMENTAIRES
              </h6>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6">
                Tous les services pour votre voyage au Maroc
              </h2>
              <p className="text-body-lg text-muted max-w-3xl mx-auto leading-relaxed">
                En plus de nos excursions et circuits, Diffa Tours vous propose une gamme complète de services 
                pour faciliter votre voyage et enrichir votre expérience au Maroc.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white p-8 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl mb-3 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="bg-secondary p-8 md:p-12 rounded-lg">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="font-display text-2xl md:text-3xl mb-6 text-foreground">
                  Besoin d'un service particulier ?
                </h3>
                <p className="text-body-lg text-muted mb-8 leading-relaxed">
                  Nous proposons également des services sur mesure selon vos besoins : organisation d'événements, 
                  team building, voyages d'affaires, assistance VIP, et bien plus encore. N'hésitez pas à nous 
                  contacter pour discuter de votre projet.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact" 
                    className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    Contactez-nous
                  </a>
                  <a 
                    href="#reservation" 
                    className="inline-block bg-white text-foreground px-8 py-4 rounded text-sm font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors border-2 border-primary"
                  >
                    Demander un devis
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}