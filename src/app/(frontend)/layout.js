

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sumaiyahome.com'),
  title: {
    default: "Sumaiya Home - Premium Carpets & Rugs",
    template: "%s | Sumaiya Home",
  },
  description: "Discover premium carpets, rugs, remnant, and outdoor decor from Sumaiya Home, a leading carpet manufacturer offering luxury at affordable prices.",
  keywords: ["carpets", "rugs", "remnant", "home decor", "outdoor rugs", "carpet manufacturer", "Sumaiya Home", "luxury rugs"],
  openGraph: {
    title: "Sumaiya Home - Premium Carpets & Rugs",
    description: "Discover premium carpets, rugs, remnant, and outdoor decor from Sumaiya Home.",
    url: "https://www.sumaiyahome.com",
    siteName: "Sumaiya Home",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumaiya Home - Premium Carpets & Rugs",
    description: "Discover premium carpets, rugs, remnant, and outdoor decor from Sumaiya Home.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
        <Footer />
      </body>
    </html>
  );
}
