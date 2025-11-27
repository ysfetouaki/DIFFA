"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Masonry from "react-responsive-masonry";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from '@/lib/i18n/hooks';

const galleryImages = [
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/2-1-370x463-3.png",
    alt: "Hébergement de charme au Maroc",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/Design-sans-titre-68-370x463-4.png",
    alt: "Découverte de la gastronomie marocaine",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/Design-sans-titre-70-370x463-5.png",
    alt: "Aventure en quad dans le désert",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/8-370x463-6.png",
    alt: "Excursion à dos de chameau",
  },
];

const ExperienceGallery = () => {
    const t = useTranslations();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 280 + 24;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="bg-white py-12 lg:py-20">
            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full shadow-lg hover:bg-white transition hidden md:flex items-center justify-center"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="h-6 w-6 text-neutral-600" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory py-8 px-4 lg:px-24 lg:justify-center"
                >
                    {galleryImages.map((image, index) => (
                        <div key={index} className="flex-shrink-0 snap-center">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={280}
                                height={280}
                                className="w-[280px] h-[280px] object-cover rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full shadow-lg hover:bg-white transition hidden md:flex items-center justify-center"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="h-6 w-6 text-neutral-600" />
                </button>
            </div>
            
            <div className="text-center mt-12 px-4">
                <p className="font-script text-2xl italic text-[#FFB73F]">
                    {t('gallery.quote')}
                </p>
            </div>
        </section>
    );
};

export default ExperienceGallery;