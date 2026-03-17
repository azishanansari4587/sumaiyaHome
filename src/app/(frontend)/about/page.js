import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Shirt, HandMetal, PaintRoller, Ruler, Scissors, CircleDashed, Package } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header with Breadcrumbs */}
      <header className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/about">About</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-4">Our Craft</h1>
          <p className="text-muted-foreground mt-2 md:text-lg max-w-2xl">
            Passionate artisans weaving stories and traditions into every handcrafted rug since 1987.
          </p>
        </div>
      </header>

      {/* About Intro Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                At SUMAIYA INTERNATIONAL Inc., we transform spaces with high-quality remnants, rugs, and home décor that perfectly blend style, comfort, and durability. As a trusted supplier, we offer an extensive range of remnant rugs, handmade rugs, decorative poufs, beach mats, pillows, and curated home accessories designed to complement both modern and traditional interiors.

                Our story began in India, where my grandfather started a passion-driven business creating beautiful, functional floor coverings. My father continued this legacy, and after completing my college education, I moved to the United States and gained experience with leading retail home furnishing companies. Inspired by this journey, I founded SUMAIYA INTERNATIONAL Inc. in Dalton, Georgia, to bring stylish, reliable, and affordable products to homes and businesses worldwide.

                We are committed to excellence in every detail—quality craftsmanship, timely delivery, and competitive pricing—so our retail partners and buyers can confidently offer products that delight customers and elevate any space.

                With SUMAIYA INTERNATIONAL Inc., you’re not just sourcing décor—you’re partnering with a trusted supplier dedicated to helping your business grow while bringing beauty and comfort to every home.
              </p>
             
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-lg overflow-hidden border shadow-md">
                <AspectRatio ratio={4/3}>
                  <img 
                    src="https://sumaiyarugs.com/wp-content/uploads/2022/09/DIANA_RS-min-scaled.jpg" 
                    alt="Artisan working on a traditional handwoven rug" 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;