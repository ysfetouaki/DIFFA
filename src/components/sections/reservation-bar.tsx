"use client";

import { useState } from "react";
import { useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from '@/lib/i18n/hooks';
import { Calendar, MapPin, Users, Search } from "lucide-react";

const ReservationBar = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  
  const [destination, setDestination] = useState("Marrakech");
  const [excursionType, setExcursionType] = useState("Circuit");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [departDate, setDepartDate] = useState("2025-11-23");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination,
      type: excursionType,
      adults: adults.toString(),
      children: children.toString(),
      date: departDate
    });
    router.push(`/reservation?${params.toString()}`);
  };

  return (
    <section id="reservation" className="relative z-10 -mt-[100px] w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto bg-[rgba(112,207,241,0.9)] backdrop-blur-[8px] rounded-lg text-white font-body">
        <form
          className="grid grid-cols-1 lg:grid-cols-5 lg:items-center"
          onSubmit={handleSearch}
        >
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-white/20 sm:divide-x sm:divide-y lg:divide-y-0">
            {/* Date de départ */}
            <div className="p-4">
              <label htmlFor="depart-date" className="block text-sm font-normal text-white/90 select-none">
                {t('reservation.departDate')}
              </label>
              <input
                id="depart-date"
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="mt-1 bg-transparent border-none text-white font-medium text-base w-full focus:outline-none focus:ring-0"
              />
            </div>

            {/* Destination */}
            <div className="p-4">
              <label htmlFor="destination" className="block text-sm font-normal text-white/90 select-none">
                {t('reservation.destination')}
              </label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-1 bg-transparent border-none text-white font-medium text-base w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              >
                <option value="Marrakech" className="text-foreground bg-background">{t('reservation.destinations.marrakech')}</option>
                <option value="Agadir" className="text-foreground bg-background">{t('reservation.destinations.agadir')}</option>
                <option value="Taghazout" className="text-foreground bg-background">{t('reservation.destinations.taghazout')}</option>
                <option value="Circuits" className="text-foreground bg-background">{t('reservation.destinations.circuits')}</option>
              </select>
            </div>

            {/* Type d'excursion */}
            <div className="p-4">
              <label htmlFor="excursion-type" className="block text-sm font-normal text-white/90 select-none">
                {t('reservation.excursionType')}
              </label>
              <select
                id="excursion-type"
                value={excursionType}
                onChange={(e) => setExcursionType(e.target.value)}
                className="mt-1 bg-transparent border-none text-white font-medium text-base w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              >
                <option value="Circuit" className="text-foreground bg-background">{t('reservation.types.circuit')}</option>
                <option value="Visite guidée" className="text-foreground bg-background">{t('reservation.types.guidedTour')}</option>
                <option value="Aventure" className="text-foreground bg-background">{t('reservation.types.adventure')}</option>
                <option value="Culture" className="text-foreground bg-background">{t('reservation.types.culture')}</option>
              </select>
            </div>

            {/* Nombre de personnes */}
            <div className="p-4">
              <label className="block text-sm font-normal text-white/90 select-none">
                {t('reservation.persons')}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="bg-transparent border-none text-white font-medium text-base focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n} className="text-foreground bg-background">
                      {n} {n > 1 ? t('reservation.adultsPlural') : t('reservation.adults')}
                    </option>
                  ))}
                </select>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="bg-transparent border-none text-white font-medium text-base focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  {[0,1,2,3,4,5,6].map(n => (
                    <option key={n} value={n} className="text-foreground bg-background">
                      {n} {n > 1 ? t('reservation.childrenPlural') : t('reservation.children')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="lg:col-span-1 p-4 flex items-center justify-center">
            <button
              type="submit"
              className="w-full text-center bg-[#FFB73F] text-white py-3 px-8 rounded-md font-semibold text-sm transition-all duration-300 hover:bg-[#e69d1a] hover:scale-105 hover:shadow-lg whitespace-nowrap"
            >
              {t('reservation.search')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ReservationBar;