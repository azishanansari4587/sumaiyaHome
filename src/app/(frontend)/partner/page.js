"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Info, ArrowRight } from "lucide-react";


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import PhoneNumber from "@/components/PhoneNumber";
import { toast } from "react-toastify";


// Form schema using Zod
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL.",
  }).optional().or(z.literal("")),
  businessType: z.string().min(1, {
    message: "Please select your business type.",
  }),
  duns: z.string().optional().or(z.literal("")),
  buyerName: z.string().min(2, {
    message: "Buyer name must be at least 2 characters.",
  }),
  taxID: z.string().min(10, {
    message: "Please enter a valid tax ID / EIN / Federal tax ID.",
  }),
  message: z.string().min(10, {
    message: "Your message must be at least 10 characters.",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
});

const Partner = () => {

  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      businessType: "",
      message: "",
      duns: "",
      buyerName: "",
      taxID: "",
      termsAccepted: false,
    },
  });


  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success("Application submitted successfully!");
      form.reset(); // Optional: reset the form
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Become a Partner</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
              Join our growing network of rug distributors, designers, and retailers to access premium products, exclusive benefits, and collaborative opportunities.
            </p>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 font-serif">How to Become a Partner</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our partnership approval process is straightforward and designed to ensure mutual success.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-16">
            <div className="bg-muted p-6 rounded-lg text-center max-w-xs">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="font-bold mb-2">Apply</h3>
              <p>Complete our partnership application form with details about your business.</p>
            </div>
            <div className="hidden md:block text-primary">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div className="md:hidden text-primary">
              <ArrowRight className="transform rotate-90 h-6 w-6" />
            </div>
            <div className="bg-muted p-6 rounded-lg text-center max-w-xs">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="font-bold mb-2">Review</h3>
              <p>Our team will evaluate your application based on our partnership criteria.</p>
            </div>
            <div className="hidden md:block text-primary">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div className="md:hidden text-primary">
              <ArrowRight className="transform rotate-90 h-6 w-6" />
            </div>
            <div className="bg-muted p-6 rounded-lg text-center max-w-xs">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="font-bold mb-2">Onboarding</h3>
              <p>Approved partners receive access to our partner portal and support resources.</p>
            </div>
          </div>

          {/* Application Form */}
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow border">
            <h3 className="text-2xl font-bold mb-6 font-serif">Partnership Application</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address*</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number*</FormLabel>
                        <FormControl>
                          <PhoneNumber {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (if applicable)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type*</FormLabel>
                      {/* <FormControl>
                        <Input placeholder="Retailer, Designer, Distributor, etc." {...field} />
                      </FormControl> */}
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bussiness type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="architect">Architect</SelectItem>
                              <SelectItem value="interior-designer">Interior Designer</SelectItem>
                              <SelectItem value="retailer">Retailer</SelectItem>
                              <SelectItem value="whole-seller">Whole Seller</SelectItem>
                              <SelectItem value="hotel-owner">Hotel Owner</SelectItem>
                              <SelectItem value="store">Store</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="duns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duns#</FormLabel>
                        <FormControl>
                          <Input placeholder="DUNS#" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="buyerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buyer Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Buyer name" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                  <FormField
                    control={form.control}
                    name="taxID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID*</FormLabel>
                        <FormControl>
                          <Input placeholder="Tax ID / EIN / Federal tax ID" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell us about your business*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share details about your business, target market, and why you're interested in partnering with us."
                          className="min-h-32"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the terms and conditions and privacy policy
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full md:w-auto">Submit Application</Button>
              </form>
            </Form>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 font-serif">Ready to Partner With Us?</h2>
              <p className="text-xl mb-6">
                Have more questions or ready to get started? Our partnership team is here to help.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="secondary" size="lg" onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Apply Now
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground hover:bg-primary-foreground/10">
                  <Info className="mr-2 h-5 w-5" /> Contact Partnership Team
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Partner;