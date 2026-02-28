"use client"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import ContactForm, { formSchema } from "@/components/ContactForm";
import { toast } from "react-toastify";
import { useState } from "react";
import { useForm } from "react-hook-form"; // ✅ Missing import added here
import { zodResolver } from "@hookform/resolvers/zod";




const Contact = () => {

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent successfully!");
      form.reset();
    } catch {
      toast.error("Failed to send message!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-cream py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our rugs or need assistance with your order? Our team is here to help.
            </p>
          </div>
        </div>

        {/* Contact Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif font-medium mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-muted p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <p className="text-muted-foreground mt-1">+1 (706) 229-3575</p>
                    <p className="text-sm text-muted-foreground mt-1">Mon-Fri: 9am - 5pm </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-muted p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-muted-foreground mt-1">sales@sumaiyarugs.com</p>
                    <p className="text-sm text-muted-foreground mt-1">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-muted p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Visit Our Showroom</h3>
                    <p className="text-muted-foreground mt-1">3345 S. Dixie Highway Dalton</p>
                    <p className="text-muted-foreground">GA 30720</p>
                    <p className="text-sm text-muted-foreground mt-1">Open Mon-Fri: 9:00 am - 5:00 pm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-muted p-3 rounded-full mr-4">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Live Chat</h3>
                    <p className="text-muted-foreground mt-1">Available on our website</p>
                    <p className="text-sm text-muted-foreground mt-1">Mon-Fri: 9am - 5pm </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 rounded-lg bg-muted h-64 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Interactive Map Location</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm form={form} onSubmit={onSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;