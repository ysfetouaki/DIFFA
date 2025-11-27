import { db } from '@/db';
import { services } from '@/db/schema';

async function main() {
    const sampleServices = [
        {
            title: JSON.stringify({
                en: "Airport Transfer",
                fr: "Transfert Aéroport",
                es: "Traslado al Aeropuerto",
                it: "Trasferimento Aeroportuale"
            }),
            description: JSON.stringify({
                en: "Comfortable and reliable airport transfer service. We ensure timely pickup and drop-off with professional drivers and well-maintained vehicles.",
                fr: "Service de transfert aéroport confortable et fiable. Nous garantissons une prise en charge et un dépôt ponctuels avec des chauffeurs professionnels et des véhicules bien entretenus.",
                es: "Servicio de traslado al aeropuerto cómodo y confiable. Garantizamos recogida y entrega puntuales con conductores profesionales y vehículos bien mantenidos.",
                it: "Servizio di trasferimento aeroportuale confortevole e affidabile. Garantiamo ritiro e consegna puntuali con autisti professionali e veicoli ben mantenuti."
            }),
            icon: "Car",
            order: 0,
            active: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            title: JSON.stringify({
                en: "Restaurant Reservations",
                fr: "Réservations de Restaurant",
                es: "Reservas de Restaurante",
                it: "Prenotazioni Ristorante"
            }),
            description: JSON.stringify({
                en: "Exclusive access to the finest restaurants in Morocco. We handle all reservations and ensure you get the best tables at top-rated dining establishments.",
                fr: "Accès exclusif aux meilleurs restaurants du Maroc. Nous gérons toutes les réservations et vous assurons les meilleures tables dans les établissements gastronomiques les mieux notés.",
                es: "Acceso exclusivo a los mejores restaurantes de Marruecos. Gestionamos todas las reservas y garantizamos las mejores mesas en los establecimientos gastronómicos mejor calificados.",
                it: "Accesso esclusivo ai migliori ristoranti del Marocco. Gestiamo tutte le prenotazioni e garantiamo i migliori tavoli nei ristoranti più rinomati."
            }),
            icon: "UtensilsCrossed",
            order: 1,
            active: true,
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            title: JSON.stringify({
                en: "Hotel Booking",
                fr: "Réservation d'Hôtel",
                es: "Reserva de Hotel",
                it: "Prenotazione Hotel"
            }),
            description: JSON.stringify({
                en: "Find and book the perfect accommodation for your stay. From luxury riads to budget-friendly hotels, we offer the best rates and locations across Morocco.",
                fr: "Trouvez et réservez l'hébergement parfait pour votre séjour. Des riads de luxe aux hôtels économiques, nous proposons les meilleurs tarifs et emplacements dans tout le Maroc.",
                es: "Encuentre y reserve el alojamiento perfecto para su estancia. Desde riads de lujo hasta hoteles económicos, ofrecemos las mejores tarifas y ubicaciones en todo Marruecos.",
                it: "Trova e prenota la sistemazione perfetta per il tuo soggiorno. Dai riad di lusso agli hotel economici, offriamo le migliori tariffe e posizioni in tutto il Marocco."
            }),
            icon: "Hotel",
            order: 2,
            active: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            title: JSON.stringify({
                en: "Flight Tickets",
                fr: "Billets d'Avion",
                es: "Boletos de Avión",
                it: "Biglietti Aerei"
            }),
            description: JSON.stringify({
                en: "Hassle-free flight booking service with competitive prices. We help you find the best routes and deals for your travel to and within Morocco.",
                fr: "Service de réservation de vols sans tracas avec des prix compétitifs. Nous vous aidons à trouver les meilleurs itinéraires et offres pour vos voyages vers et au sein du Maroc.",
                es: "Servicio de reserva de vuelos sin complicaciones con precios competitivos. Le ayudamos a encontrar las mejores rutas y ofertas para sus viajes hacia y dentro de Marruecos.",
                it: "Servizio di prenotazione voli senza problemi con prezzi competitivi. Ti aiutiamo a trovare le migliori rotte e offerte per i tuoi viaggi verso e all'interno del Marocco."
            }),
            icon: "Plane",
            order: 3,
            active: true,
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            title: JSON.stringify({
                en: "Shopping Tours",
                fr: "Visites Shopping",
                es: "Tours de Compras",
                it: "Tour Shopping"
            }),
            description: JSON.stringify({
                en: "Guided shopping experiences through traditional souks and modern boutiques. Discover authentic Moroccan crafts, spices, and treasures with expert local guides.",
                fr: "Expériences de shopping guidées à travers les souks traditionnels et les boutiques modernes. Découvrez l'artisanat, les épices et les trésors marocains authentiques avec des guides locaux experts.",
                es: "Experiencias de compras guiadas por zocos tradicionales y boutiques modernas. Descubra artesanías, especias y tesoros marroquíes auténticos con guías locales expertos.",
                it: "Esperienze di shopping guidate attraverso souk tradizionali e boutique moderne. Scopri artigianato, spezie e tesori marocchini autentici con guide locali esperte."
            }),
            icon: "ShoppingBag",
            order: 4,
            active: true,
            createdAt: new Date('2024-01-14').toISOString(),
            updatedAt: new Date('2024-01-14').toISOString(),
        },
        {
            title: JSON.stringify({
                en: "Photography Services",
                fr: "Services de Photographie",
                es: "Servicios de Fotografía",
                it: "Servizi Fotografici"
            }),
            description: JSON.stringify({
                en: "Professional photography services to capture your Moroccan adventure. From portrait sessions to event coverage, preserve your memories with stunning quality photos.",
                fr: "Services de photographie professionnels pour capturer votre aventure marocaine. Des séances de portrait à la couverture d'événements, préservez vos souvenirs avec des photos de qualité exceptionnelle.",
                es: "Servicios de fotografía profesional para capturar su aventura marroquí. Desde sesiones de retrato hasta cobertura de eventos, preserve sus recuerdos con fotos de calidad impresionante.",
                it: "Servizi fotografici professionali per catturare la tua avventura marocchina. Dalle sessioni di ritratti alla copertura di eventi, preserva i tuoi ricordi con foto di qualità straordinaria."
            }),
            icon: "Camera",
            order: 5,
            active: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        }
    ];

    await db.insert(services).values(sampleServices);
    
    console.log('✅ Services seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});