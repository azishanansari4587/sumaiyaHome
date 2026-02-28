// import { Button } from "@/components/ui/button";

// const HeroSection = () => {
//   return (
//     <section className="relative h-[90vh] overflow-hidden">
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
//         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80')" }}
//       >
//         <div className="absolute inset-0 bg-black/30"></div>
//       </div>

//       <div className="relative container mx-auto h-full flex flex-col justify-center items-start px-4 md:px-8">
//         <div className="max-w-xl animate-fade-in">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-white mb-4">
//             Transform Your Space
//           </h1>
//           <p className="text-xl text-white/90 mb-8">
//             Discover our curated collection of handcrafted rugs that blend tradition with modern aesthetics.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Button size="lg" className="bg-white text-primary hover:bg-white/90">
//               Rugs Collection
//             </Button>
//             {/* <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
//               Design Consultation
//             </Button> */}
//           </div>
//         </div>
//       </div>
//     </section>


//     //* Splendid Emporium Carpet *//
//   );
// };

// export default HeroSection;

"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Spinner from "./Spinner"

const HeroSection = () => {
  const [slides, setSlides] = useState([])
  const carouselRef = useRef(null)
  const autoplay = useRef(Autoplay({ delay: 10000, stopOnInteraction: false }))

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" })
        const data = await res.json()
        setSlides(data)
      } catch (err) {
        console.error("Failed to fetch banners:", err)
      }
    }
    fetchBanners()
  }, [])



  if (!slides.length)
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-100">
        <Spinner />
      </div>
    )

  return (
    <section className="relative h-[60vh] sm:h-[75vh] md:h-screen w-full overflow-hidden">
      <Carousel
        ref={carouselRef}
        loop
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="w-full h-full relative"
      >
        <CarouselContent className="w-full h-full relative">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="w-full relative h-[60vh] sm:h-[75vh] md:h-screen"
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.imageUrl}
                  alt={`Slide ${index}`}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 hover:bg-primary text-white flex items-center justify-center rounded-full cursor-pointer shadow-lg transition">
          <ChevronLeft size={20} className="sm:hidden" />
          <ChevronLeft size={28} className="hidden sm:block" />
        </CarouselPrevious>
        <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 hover:bg-primary text-white flex items-center justify-center rounded-full cursor-pointer shadow-lg transition">
          <ChevronRight size={20} className="sm:hidden" />
          <ChevronRight size={28} className="hidden sm:block" />
        </CarouselNext>
      </Carousel>
    </section>
  )
}

export default HeroSection

