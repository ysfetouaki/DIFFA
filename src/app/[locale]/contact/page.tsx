"use client";

import Header from '@/components/sections/header';
import ContactForm from '@/components/contact-form';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ContactPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    setIsVisible(true);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section with Parallax */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 transition-transform duration-100"
            style={{
              transform: `translateY(${scrollY * 0.5}px) scale(1.1)`,
            }}
          >
            <img
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/9956bb_cdd31c8975c34219ab5897156b24f808mv2-1-2.avif"
              alt="Palais Riad Berbère Interior"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70 z-10" />
          </div>
          
          <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
            <div className="glass-effect border-2 border-white/30 p-8 md:p-12 rounded-2xl backdrop-blur-md shadow-2xl hover:border-white/50 transition-all duration-500">
              <h6 className="font-secondary uppercase text-xs tracking-[3px] mb-4 text-white/90 animate-fade-in-down">
                NOUS CONTACTER
              </h6>
              <h1 
                className="font-display text-5xl md:text-6xl lg:text-7xl font-light mb-6"
                style={{ 
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                Contact
              </h1>
              <p className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                Nous sommes à votre écoute pour toute demande d'information
              </p>
              
              {/* Decorative Elements */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-white/60"></div>
                <div className="w-2 h-2 rounded-full bg-primary glow-primary animate-pulse"></div>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-white/60"></div>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 border border-white/20 rounded-full animate-float hidden lg:block"></div>
          <div className="absolute bottom-1/4 right-10 w-16 h-16 border border-white/20 rotate-45 animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
        </section>

        {/* Contact Info Cards with 3D Effect */}
        <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Address Card */}
              <div 
                className="text-center group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out'
                }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                      <MapPin className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-display text-2xl mb-4 text-foreground group-hover:text-primary transition-colors duration-300">Adresse</h3>
                    <p className="text-sm text-muted leading-relaxed">
                      Palais Riad Berbère<br />
                      2.5 Km Oasis Hassan II<br />
                      Avenue Al Adarissa<br />
                      40000 Marrakech
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div 
                className="text-center group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out 0.1s'
                }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                      <Phone className="w-10 h-10 text-accent group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-display text-2xl mb-4 text-foreground group-hover:text-accent transition-colors duration-300">Téléphone</h3>
                    <a href="tel:+212661822441" className="text-sm text-muted hover:text-primary transition-colors inline-block transform hover:scale-105">
                      +212 661 822 441
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div 
                className="text-center group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out 0.2s'
                }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                      <Mail className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-display text-2xl mb-4 text-foreground group-hover:text-primary transition-colors duration-300">Email</h3>
                    <a href="mailto:Contact@palaisriadberbere.com" className="text-sm text-muted hover:text-primary transition-colors break-all inline-block transform hover:scale-105">
                      Contact@palaisriadberbere.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div 
                className="text-center group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out 0.3s'
                }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                      <Clock className="w-10 h-10 text-accent group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-display text-2xl mb-4 text-foreground group-hover:text-accent transition-colors duration-300">Horaires</h3>
                    <p className="text-sm text-muted leading-relaxed">
                      7 jours sur 7<br />
                      24h/24
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section with Enhanced Design */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: Form Introduction */}
              <div className="space-y-8">
                <div>
                  <h6 className="font-secondary uppercase text-xs tracking-[3px] text-accent mb-4 animate-fade-in-down">
                    ENVOYEZ-NOUS UN MESSAGE
                  </h6>
                  <h2 className="font-display text-4xl md:text-5xl mb-6 text-foreground">
                    Contactez-nous
                  </h2>
                  <p className="text-body-lg text-muted mb-8 leading-relaxed">
                    Que ce soit pour une réservation, une demande d'information ou toute autre question, 
                    notre équipe se fera un plaisir de vous répondre dans les plus brefs délais.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-6 group transform transition-all duration-300 hover:translate-x-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl mb-2 group-hover:text-primary transition-colors">Notre emplacement</h4>
                      <p className="text-sm text-muted leading-relaxed">
                        Situé au cœur de Marrakech, à proximité des principaux sites touristiques
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group transform transition-all duration-300 hover:translate-x-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                      <Phone className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">Appelez-nous</h4>
                      <p className="text-sm text-muted leading-relaxed">
                        Disponible 24h/24 pour répondre à toutes vos questions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group transform transition-all duration-300 hover:translate-x-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl mb-2 group-hover:text-primary transition-colors">Écrivez-nous</h4>
                      <p className="text-sm text-muted leading-relaxed">
                        Nous vous répondrons dans les 24 heures
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Divider */}
                <div className="flex items-center gap-3 pt-8">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                  <div className="w-3 h-3 rounded-full border-2 border-primary animate-pulse"></div>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="transform transition-all duration-500 hover:scale-[1.02]">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Map Section with Shadow Effect */}
        <section className="h-[500px] w-full relative">
          <div className="absolute inset-0 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.4956856989486!2d-8.0089!3d31.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM3JzQ2LjIiTiA4wrAwMCczMi4wIlc!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Palais Riad Berbère Location"
              className="grayscale-[30%] hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </section>

        {/* CTA Section with Gradient Background */}
        <section className="py-24 px-6 bg-gradient-to-br from-white via-gray-50 to-white text-center relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="max-w-[900px] mx-auto relative z-10">
            <h6 className="font-secondary uppercase text-xs tracking-[3px] text-accent mb-4 animate-fade-in-down">
              RÉSERVEZ VOTRE SÉJOUR
            </h6>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
              Prêt à vivre une expérience inoubliable ?
            </h2>
            <p className="text-body-lg text-muted mb-10 leading-relaxed max-w-[700px] mx-auto">
              Réservez dès maintenant votre séjour au Palais Riad Berbère et laissez-vous enchanter 
              par l'authenticité marocaine.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/"
                className="group inline-flex items-center justify-center bg-primary text-primary-foreground px-10 py-5 font-medium uppercase tracking-wider hover:bg-accent transition-all duration-300 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span>Réserver maintenant</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/chambre-et-suites"
                className="group inline-flex items-center justify-center bg-white text-primary border-2 border-primary px-10 py-5 font-medium uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span>Découvrir nos chambres</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            
            {/* Decorative Bottom Element */}
            <div className="flex items-center justify-center gap-3 mt-12">
              <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <div className="w-3 h-3 rounded-full border-2 border-primary animate-pulse"></div>
              <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}