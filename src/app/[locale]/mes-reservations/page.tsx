'use client';

import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function MesReservationsPage() {
  const { formatPrice } = useCurrency();
  
  // This will be replaced with actual reservation data from API
  const reservations = [
    {
      id: 'RES-001',
      activityName: 'Visite guidée de la Médina',
      destination: 'Marrakech',
      date: '2025-12-15',
      time: '10:00',
      participants: 2,
      priceMAD: 700,
      status: 'confirmed',
      bookingDate: '2025-11-20'
    },
    {
      id: 'RES-002',
      activityName: 'Circuit Désert 3 Jours',
      destination: 'Circuits',
      date: '2026-01-10',
      time: '08:00',
      participants: 4,
      priceMAD: 10000,
      status: 'pending',
      bookingDate: '2025-11-22'
    },
    {
      id: 'RES-003',
      activityName: 'Cours de Surf Débutant',
      destination: 'Taghazout',
      date: '2025-11-10',
      time: '14:00',
      participants: 1,
      priceMAD: 350,
      status: 'completed',
      bookingDate: '2025-10-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5" />;
      case 'pending': return <AlertCircle className="w-5 h-5" />;
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-light mb-2">Mes Réservations</h1>
              <p className="text-muted">Gérez et consultez toutes vos réservations</p>
            </div>
            <Link 
              href="/nos-excursions"
              className="hidden md:inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Nouvelle réservation
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium whitespace-nowrap">
              Toutes
            </button>
            <button className="px-4 py-2 bg-white text-foreground rounded-lg font-medium hover:bg-secondary whitespace-nowrap">
              À venir
            </button>
            <button className="px-4 py-2 bg-white text-foreground rounded-lg font-medium hover:bg-secondary whitespace-nowrap">
              Terminées
            </button>
            <button className="px-4 py-2 bg-white text-foreground rounded-lg font-medium hover:bg-secondary whitespace-nowrap">
              Annulées
            </button>
          </div>

          {/* Reservations List */}
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div 
                key={reservation.id} 
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-2xl">{reservation.activityName}</h3>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        {getStatusLabel(reservation.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted">Réservation #{reservation.id} • Réservée le {new Date(reservation.bookingDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-display font-bold text-primary">{formatPrice(reservation.priceMAD)}</p>
                    <p className="text-sm text-muted">Total</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted">Destination</p>
                      <p className="font-medium">{reservation.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted">Date</p>
                      <p className="font-medium">{new Date(reservation.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted">Heure</p>
                      <p className="font-medium">{reservation.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Users className="w-5 h-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted">Participants</p>
                      <p className="font-medium">{reservation.participants} {reservation.participants > 1 ? 'personnes' : 'personne'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {reservation.status === 'confirmed' && (
                    <>
                      <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        Voir les détails
                      </button>
                      <button className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                        Modifier
                      </button>
                      <button className="px-6 py-3 border-2 border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/10 transition-colors">
                        Annuler
                      </button>
                    </>
                  )}
                  {reservation.status === 'pending' && (
                    <>
                      <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        Confirmer le paiement
                      </button>
                      <button className="px-6 py-3 border-2 border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/10 transition-colors">
                        Annuler
                      </button>
                    </>
                  )}
                  {reservation.status === 'completed' && (
                    <>
                      <button className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                        Laisser un avis
                      </button>
                      <button className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                        Réserver à nouveau
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (show when no reservations) */}
          {reservations.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-3">Aucune réservation</h3>
              <p className="text-muted mb-6 max-w-md mx-auto">
                Vous n'avez pas encore de réservation. Découvrez nos excursions et circuits pour vivre une expérience inoubliable au Maroc.
              </p>
              <Link 
                href="/nos-excursions"
                className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Découvrir nos excursions
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
