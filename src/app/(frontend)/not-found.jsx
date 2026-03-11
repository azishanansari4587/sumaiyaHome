"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream/30 px-6 py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-blue-400/10 rounded-full blur-[100px] -z-10"
      />
      
      <div className="max-w-3xl w-full text-center space-y-8 z-10">
        
        {/* Animated 404 Text */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative inline-block"
        >
          <h1 className="text-[10rem] md:text-[16rem] font-black text-gray-900/5 tracking-tighter leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">
              Page Not Found
            </h2>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="space-y-6 max-w-lg mx-auto"
        >
          <p className="text-lg text-gray-600">
            Oops! It seems you've wandered off the map. The page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all w-full sm:w-auto justify-center shadow-sm hover:shadow"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <Link 
              href="/"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="pt-16 max-w-md mx-auto"
        >
            <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Here are some helpful links</p>
            <div className="flex flex-wrap justify-center items-center gap-3">
                <Link href="/rugs" className="text-sm text-gray-600 hover:text-primary transition-colors hover:underline">Rugs</Link>
                <span className="text-gray-300">•</span>
                <Link href="/decor" className="text-sm text-gray-600 hover:text-primary transition-colors hover:underline">Decor</Link>
                <span className="text-gray-300">•</span>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary transition-colors hover:underline">Contact Us</Link>
                <span className="text-gray-300">•</span>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-primary transition-colors hover:underline">My Account</Link>
            </div>
        </motion.div>

      </div>
    </div>
  );
}
