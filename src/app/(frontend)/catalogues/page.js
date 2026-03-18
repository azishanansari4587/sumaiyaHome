"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const CatalogueSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
        <div className="bg-[#E8D5C0] h-80" />
        <div className="p-6 bg-[#FBF4EC] space-y-3">
          <div className="h-4 bg-[#E8D5C0] rounded w-3/4 mx-auto" />
          <div className="h-10 bg-[#E8D5C0] rounded-full w-1/2 mx-auto" />
        </div>
      </div>
    ))}
  </div>
)

// ─── Catalogue Card ───────────────────────────────────────────────────────────
const CatalogueCard = ({ cat, index }) => (
  <div
    className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Image */}
    <div className="relative w-full h-80 overflow-hidden bg-[#E8D5C0]">
      <Image
        src={cat.imageUrl || "/placeholder.jpg"}
        alt={cat.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A0E]/80 via-[#2C1A0E]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      {/* Badge */}
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center gap-1.5 bg-[#7A4E2D]/90 backdrop-blur-sm text-[#F5EDE3] text-[11px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#C8956B]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8956B] inline-block" />
          Catalogue
        </span>
      </div>

      {/* Hover CTA overlay */}
      {cat.pdfUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <a
            href={cat.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#C8956B] hover:bg-[#7A4E2D] text-white text-sm font-semibold px-6 py-3 rounded-full shadow-xl transition-all duration-300 translate-y-4 group-hover:translate-y-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview PDF
          </a>
        </div>
      )}
    </div>

    {/* Card Body */}
    <div className="p-6 bg-[#FBF4EC] border border-t-0 border-[#E8D5C0] rounded-b-2xl flex flex-col items-center gap-4">
      <h2
        className="text-center font-semibold text-[#2C1A0E] text-lg leading-snug"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {cat.title}
      </h2>

      {/* Decorative rule */}
      <div className="flex items-center gap-2 w-full justify-center">
        <span className="h-px w-8 bg-[#C8956B]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#C8956B]" />
        <span className="h-px w-8 bg-[#C8956B]" />
      </div>

      {cat.pdfUrl ? (
        <a
          href={cat.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#7A4E2D] hover:bg-[#2C1A0E] text-[#F5EDE3] text-sm font-medium tracking-wide px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group/btn"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Brochure
        </a>
      ) : (
        <span className="text-xs text-[#9A7055] italic">PDF coming soon</span>
      )}
    </div>
  </div>
)

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
    <div className="w-20 h-20 rounded-full bg-[#F5EDE3] flex items-center justify-center border border-[#E8D5C0]">
      <svg className="w-8 h-8 text-[#C8956B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <div>
      <p className="text-[#2C1A0E] font-semibold text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        No Catalogues Available Yet
      </p>
      <p className="text-[#9A7055] text-sm mt-1">Check back soon for our latest collections.</p>
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
const Catalogues = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/catalogues")
      .then((res) => res.json())
      .then((data) => setCatalogues(data.catalogues || []))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFAF5]">

      {/* ── Google Font (Cormorant) ── */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');`}</style>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#2C1A0E] py-28">

        {/* Decorative circle blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#7A4E2D]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#C8956B]/20 blur-3xl pointer-events-none" />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #C8956B 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative container mx-auto px-6 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-8 bg-[#C8956B]" />
            <span className="text-[#C8956B] text-xs font-semibold tracking-[4px] uppercase">
              Sumaiya International
            </span>
            <span className="h-px w-8 bg-[#C8956B]" />
          </div>

          <h1
            className="text-5xl md:text-7xl font-semibold text-[#F5EDE3] mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Catalogues
            <span className="block text-[#C8956B]">&amp; Brochures</span>
          </h1>

          <p className="text-[#C8956B]/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Explore our handcrafted collections. Browse, download, and discover the perfect pieces for every space.
          </p>

          {/* Stats row
          <div className="flex items-center justify-center gap-10 mt-12 pt-10 border-t border-[#7A4E2D]/40">
            {[
              { num: "3+", label: "Generations" },
              { num: "6+", label: "Collections" },
              { num: "100%", label: "Handcrafted" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-semibold text-[#F5EDE3]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{num}</p>
                <p className="text-[10px] tracking-widest uppercase text-[#9A7055] mt-0.5">{label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── Catalogues Grid ── */}
      <section className="container mx-auto px-6 py-20">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="h-px flex-1 bg-[#E8D5C0]" />
          <span
            className="text-[#7A4E2D] text-sm font-semibold tracking-widest uppercase px-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Browse All Catalogues
          </span>
          <span className="h-px flex-1 bg-[#E8D5C0]" />
        </div>

        {loading ? (
          <CatalogueSkeleton />
        ) : catalogues.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalogues.map((cat, index) => (
              <CatalogueCard key={cat.id} cat={cat} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* ── Bottom CTA Banner ── */}
      <section className="bg-[#F5EDE3] border-t border-[#E8D5C0]">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-2xl font-semibold text-[#2C1A0E]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Looking for a custom order?
            </h3>
            <p className="text-[#9A7055] text-sm mt-1">
              Contact us for wholesale pricing, custom sizes &amp; bulk orders.
            </p>
          </div>
          <a
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-[#7A4E2D] hover:bg-[#2C1A0E] text-[#F5EDE3] text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

    </div>
  )
}

export default Catalogues