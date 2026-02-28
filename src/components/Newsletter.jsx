"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'react-toastify';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('api/subscriber', {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            const data = await res.json();
            // setMessage(data.message || data.error);
            // setShowSuccess(true);
            setEmail('');

            toast.success(data.message);
        } catch (error) {
            toast.error(error.message);
        }

    }

  return (
    <section className="section-padding bg-mocha text-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Stay Connected</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, interior design tips, and new collection releases.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              required
            />
            <Button type="submit" className="bg-white text-mocha hover:bg-white/90 whitespace-nowrap">
              Subscribe
            </Button>
          </form>
          
          <p className="mt-4 text-sm text-white/60">
            By subscribing, you agree to our Privacy Policy and consent to receive marketing emails.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;