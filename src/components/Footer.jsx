import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import Logo1 from "../assets/Logo1.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#165c72] text-white">
      <div className="container mx-auto pt-16 pb-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="bg-white p-4 w-44"><Image src={Logo1} alt='' width={160} /></div>
            <p className="text-white/70 mb-6 py-2">
              Creating beautiful, handcrafted rugs that transform your space and last for generations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link href="/rugs" className="hover:text-white transition-colors">All Rugs</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Collection</Link></li>
              <li><Link href="/remnant" className="hover:text-white transition-colors">Remnant</Link></li>
              <li><Link href="/decor" className="hover:text-white transition-colors">Decor</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/carpetCare" className="hover:text-white transition-colors">Care Instructions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">About Us</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="/about" className="hover:text-white transition-colors">Our Story</a></li>
              {/* <li><a href="/partner" className="hover:text-white transition-colors">Become A Partner</a></li> */}
              <li><a href="/catalogues" className="hover:text-white transition-colors">Catalogue</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/60 mb-4 md:mb-0">
              © {new Date().getFullYear()} Sumaiya International Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
