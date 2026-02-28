import React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { HelpCircle, Mail } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FAQ() {
  const faqs = [
    {
      question: "How do I choose the right size carpet for my room?",
      answer: "For living rooms, your carpet should be large enough that the front legs of your furniture can sit on it. For dining rooms, make sure the carpet extends at least 24 inches beyond the table on all sides to accommodate chairs. For bedrooms, place runners on either side of the bed or use a large carpet that extends beyond the sides and foot of the bed."
    },
    {
      question: "What's the difference between hand-knotted and machine-made carpets?",
      answer: "Hand-knotted carpets are created entirely by skilled artisans who tie each knot by hand, resulting in unique, durable pieces that often appreciate in value over time. Machine-made carpets are produced on power looms, making them more affordable and consistent in pattern, though typically less durable than hand-knotted varieties."
    },
    {
      question: "How should I clean and maintain my carpet?",
      answer: "Regular vacuuming is essential for all carpet types. For deeper cleaning, we recommend professional services every 12-18 months. Immediately blot (don't rub) spills with a clean, dry cloth. For specific cleaning instructions based on your carpet's material, refer to our Carpet Care Guide."
    },
    {
      question: "Do you offer installation services?",
      answer: "Yes, we offer professional installation services for all carpet purchases. Our experienced installers ensure proper fitting and secure placement, which helps maintain your carpet's appearance and extends its lifespan. Installation services can be added during checkout."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused carpets in their original packaging. Custom-sized or custom-designed carpets are non-returnable. For returns, please contact our customer service team to initiate the process. A 15% restocking fee may apply for certain items."
    },
    {
      question: "How long will shipping take?",
      answer: "Shipping times vary based on your location and the carpet's availability. In-stock items typically ship within 2-3 business days. Delivery usually takes 5-10 business days, depending on your location. For custom or backordered items, please allow 4-6 weeks for production before shipping."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Import duties, taxes, and customs fees are the responsibility of the recipient and are not included in our shipping charges."
    },
    {
      question: "Are your carpets eco-friendly?",
      answer: "Many of our carpets are made with sustainable materials and natural dyes. We offer a dedicated Eco-Friendly collection that features carpets made from organic wool, cotton, jute, and other renewable resources. Look for the 'Eco-Friendly' label in our product descriptions."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-forest-700" />
              <h1 className="text-3xl font-serif font-bold text-forest-800">Frequently Asked Questions</h1>
        </div>
        
        <p className="text-lg mb-8 text-forest-700">
              Find answers to common questions about our products, services, shipping, and more. 
              If you can&apos;t find what you&apos;re looking for, please don&apos;t hesitate to contact us.
        </p>
        
        <Accordion type="single" collapsible className="mb-10">
              {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-forest-200">
              <AccordionTrigger className="text-left font-medium text-forest-800 hover:text-forest-600">
                  {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-forest-700">
                  {faq.answer}
              </AccordionContent>
              </AccordionItem>
              ))}
        </Accordion>
        
        <div className="bg-sand-50 border border-sand-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-serif font-bold mb-3 text-sand-800">Still have questions?</h3>
              <p className="mb-4 text-sand-700">Our customer service team is here to help</p>
              <Button asChild className="bg-forest-700 hover:bg-forest-800">
              <Link href="/contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Contact Us
              </Link>
              </Button>
        </div>
        </div>
    </div>
  );
}
