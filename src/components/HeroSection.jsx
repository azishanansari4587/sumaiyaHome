"use client"

import React, { useState, useEffect, useRef } from "react"
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

// ── Inline keyframe styles ────────────────────────────────────────────────
const animStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .banner-tagline {
    font-family: 'Playfair Display', serif;
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) both;
    animation-delay: 0.15s;
  }
  .banner-name {
    font-family: 'Cormorant Garamond', serif;
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) both;
    animation-delay: 0.45s;
    background: linear-gradient(90deg, #fff 0%, #ffe9c6 40%, #fff 60%, #ffe9c6 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) both 0.45s,
               shimmer 4s linear 1.5s infinite;
  }
  .banner-line {
    transform-origin: left;
    animation: lineGrow 0.7s cubic-bezier(.22,1,.36,1) both;
    animation-delay: 0.75s;
  }
  .banner-sub {
    animation: fadeIn 0.8s ease both;
    animation-delay: 0.9s;
  }
`;

const HeroSection = () => {
  const [slides, setSlides] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [api, setApi] = useState(null)
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

  // Track active slide for text re-animation
  useEffect(() => {
    if (!api) return
    api.on("select", () => setActiveIndex(api.selectedScrollSnap()))
  }, [api])

  if (!slides.length)
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-100">
        <Spinner />
      </div>
    )

  return (
    <>
      <style>{animStyles}</style>
      <section className="relative h-[60vh] sm:h-[75vh] md:h-screen w-full overflow-hidden bg-gray-900">
        <Carousel
          setApi={setApi}
          loop
          opts={{ loop: true }}
          plugins={[autoplay.current]}
          className="w-full h-full"
        >
          <CarouselContent className="w-full h-full flex -ml-0 mt-0">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="w-full h-full relative pl-0">

                {/* ── Background image with subtle scale-in ── */}
                <div
                  className="relative w-full h-[60vh] sm:h-[75vh] md:h-screen overflow-hidden"
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.name || `Slide ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[10000ms] ease-out scale-110"
                    style={index === activeIndex ? { transform: "scale(1)" } : {}}
                  />

                  {/* ── Gradient overlay ── */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

                  {/* ── Text content ── */}
                  {index === activeIndex && (
                    <div className="absolute inset-0 flex flex-col justify-end sm:justify-center px-6 sm:px-12 md:px-20 pb-12 sm:pb-0">

                      {/* Top label */}
                      <div className="banner-sub mb-3 flex items-center gap-3">
                        <span className="h-px w-8 bg-amber-300/80" />
                        <span
                          style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.25em" }}
                          className="text-amber-200/90 text-xs sm:text-sm font-light uppercase tracking-widest"
                        >
                          Sumaiya Home
                        </span>
                      </div>

                      {/* Main banner name */}
                      {slide.name ? (
                        <h1
                          className="banner-name text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-3"
                        >
                          {slide.name}
                        </h1>
                      ) : (
                        <h1
                          className="banner-tagline text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3"
                        >
                          Luxury at Every Step
                        </h1>
                      )}

                      {/* Animated divider line */}
                      <div className="banner-line mb-4 h-[2px] w-16 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full" />

                      {/* Sub tagline */}
                      {/* <p
                        className="banner-sub text-white/75 text-sm sm:text-base md:text-lg max-w-md font-light"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Handcrafted rugs &amp; premium home décor — crafted for spaces that inspire.
                      </p> */}
                    </div>
                  )}
                </div>

              </CarouselItem>
            ))}
          </CarouselContent>

          {/* ── Dot indicators ── */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeIndex ? "w-8 bg-amber-300" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* ── Navigation Arrows ── */}
          <CarouselPrevious className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm flex items-center justify-center rounded-full cursor-pointer shadow-lg transition-all">
            <ChevronLeft size={22} />
          </CarouselPrevious>
          <CarouselNext className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm flex items-center justify-center rounded-full cursor-pointer shadow-lg transition-all">
            <ChevronRight size={22} />
          </CarouselNext>
        </Carousel>
      </section>
    </>
  )
}

export default HeroSection
