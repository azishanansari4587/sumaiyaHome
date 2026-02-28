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
                The story of Sumaiya International Inc. began with a dream.

                  Our founder envisioned a brand that would honor India’s rich crafting traditions while redefining luxury for the modern world. Growing up surrounded by textile artisans, he witnessed firsthand the dedication, skill, and passion behind every hand-woven piece. It became his mission to bring this artistry to a global stage.

                  With a deep respect for craftsmanship and an eye for modern aesthetics, he established Sumaiya International Inc. — a brand that bridges heritage and contemporary design. What started as a small initiative born from passion has grown into an international name trusted for quality, authenticity, and elegance.

                  Today, his vision continues to guide the brand:
                  to create beautiful, meaningful pieces that turn houses into homes and preserve the legacy of artisans for future generations.
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