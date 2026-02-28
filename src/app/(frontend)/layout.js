

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata = {
  title: "Sumaiya Home",
  description: "It's a carpet manufacture company",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Navbar/>
            <main>
              {children}
            </main> 
            <ToastContainer position="top-right" autoClose={3000} theme="light" />
          <Footer/>
      </body>
    </html>
  );
}
