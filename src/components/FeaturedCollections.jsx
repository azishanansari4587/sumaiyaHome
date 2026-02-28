"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Spinner from "./Spinner";
import Image from "next/image";

const FeaturedCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        // if (!response.ok) throw new Error("Failed to fetch collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <Spinner />
    );
  }


  return (
    <section className="section-padding bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">

          <h2 className="relative text-3xl md:text-4xl font-serif font-semibold mb-4 text-center">
            <span className="after:content-[''] after:block after:mx-auto after:mt-2 after:w-[100px] after:h-[2px] after:bg-primary">
              KEY COLLECTIONS
            </span>
          </h2>


          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections, each telling a unique story through patterns and textures.
          </p>
        </div>
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {collections.map((collection) => (
              <div key={collection.id} className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-white">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-serif font-medium mb-2">{collection.name}</h3>
                  {/* <p className="mb-4 opacity-90">{collection.description}</p> */}
                  <Button variant="outline" className="w-full border-white text-black hover:bg-white/20" asChild>
                    <Link href={`/collection/${collection.slug}`}>Explore Collection</Link>
                  </Button>
                </div>
              </div>
            ))
            }
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No Collections found</h3>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedCollections;
