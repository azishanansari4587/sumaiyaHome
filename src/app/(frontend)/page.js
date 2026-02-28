import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import BestSellers from "@/components/BestSellers";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div>
      <HeroSection/>
      <FeaturedCollections/>
      <BestSellers/>
      <Newsletter/>
    </div>
  );
}

