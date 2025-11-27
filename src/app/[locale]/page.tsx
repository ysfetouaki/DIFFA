import Header from '@/components/sections/header';
import Hero from '@/components/sections/hero';
import ReservationBar from '@/components/sections/reservation-bar';
import WelcomeIntro from '@/components/sections/welcome-intro';
import ExperienceGallery from '@/components/sections/experience-gallery';
import PoolHero from '@/components/sections/pool-hero';
import RoomsSuites from '@/components/sections/rooms-suites';
import ExperiencesShowcase from '@/components/sections/experiences-showcase';
import TestimonialSection from '@/components/sections/testimonial';
import AmenitiesGrid from '@/components/sections/amenities-grid';
import PropertyPhotos from '@/components/sections/property-photos';
import Newsletter from '@/components/sections/newsletter';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        <ReservationBar />
        
        <WelcomeIntro />
        
        <ExperienceGallery />
        
        <PoolHero />
        
        <RoomsSuites />
        
        <ExperiencesShowcase />
        
        <TestimonialSection />
        
        <AmenitiesGrid />
        
        <PropertyPhotos />
        
        <Newsletter />
      </main>
    </div>
  );
}