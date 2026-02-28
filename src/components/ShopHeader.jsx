
import React from "react";

const ShopHeader = () => {
  return (
    <div className="bg-cream py-12 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-4">Shop Our Rugs</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our handcrafted collection of premium rugs, made with sustainable materials 
          and traditional techniques. Find the perfect piece for your space.
        </p>
      </div>
    </div>
  );
};

export default ShopHeader;