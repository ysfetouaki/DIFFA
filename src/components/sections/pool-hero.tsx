import Image from "next/image";

const PoolHero = () => {
  return (
    <section className="relative w-full h-[400px] md:h-[650px]">
      <Image
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/beautiful-coastal-view-of-agadir-or-tagh-2c659912-20251123184351.jpg"
        alt="Découvrez les plages paradisiaques d'Agadir et Taghazout avec Diffa Tours"
        fill
        sizes="100vw"
        className="object-cover object-center"
        quality={80}
        loading="lazy"
      />
    </section>
  );
};

export default PoolHero;