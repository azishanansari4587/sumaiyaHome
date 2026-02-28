import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { Book, ExternalLink } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CarpetCare = () => {
  return (
     <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
               <Book className="h-5 w-5 text-forest-700" />
               <h1 className="text-3xl font-serif font-bold text-forest-800">Carpet Care Guide</h1>
          </div>
          
          <p className="text-lg mb-8 text-forest-700">
               Proper care and maintenance will extend the life of your carpet and keep it looking beautiful for years to come. 
               Follow our comprehensive guide for different carpet types.
          </p>
          
          <Tabs defaultValue="general" className="mb-12">
               <TabsList className="grid w-full grid-cols-4 mb-8">
               <TabsTrigger value="general">General Care</TabsTrigger>
               <TabsTrigger value="wool">Wool Carpets</TabsTrigger>
               <TabsTrigger value="silk">Silk Carpets</TabsTrigger>
               <TabsTrigger value="synthetic">Synthetic Carpets</TabsTrigger>
               </TabsList>
               
               <TabsContent value="general" className="space-y-6">
               <h2 className="text-2xl font-serif font-bold text-forest-800">General Carpet Care</h2>
               
               <div className="space-y-4">
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Regular Maintenance</h3>
                    <p className="text-forest-700">
                    Vacuum your carpet at least once a week, more frequently in high-traffic areas. Use a vacuum with good suction and a rotating brush. For delicate carpets, use a suction-only vacuum or a vacuum with an adjustable height setting.
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Dealing with Spills</h3>
                    <p className="text-forest-700">
                    Act quickly! Blot (never rub) the spill with a clean, white absorbent cloth or paper towel to remove as much liquid as possible. Work from the outside of the stain inward to prevent spreading. For specific stain removal, refer to the appropriate section for your carpet type.
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Professional Cleaning</h3>
                    <p className="text-forest-700">
                    Have your carpets professionally cleaned every 12-18 months, depending on foot traffic and household conditions. Professional cleaning removes deeply embedded dirt and refreshes the appearance of your carpet.
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Protecting Your Carpet</h3>
                    <p className="text-forest-700">
                    Use doormats at entrances to reduce soil tracked into your home. Consider using area rugs in high-traffic zones. Rearrange furniture periodically to change traffic patterns and prevent uneven wear. Use furniture coasters under heavy pieces to prevent crushing carpet fibers.
                    </p>
               </div>
               </div>
               </TabsContent>
               
               <TabsContent value="wool" className="space-y-6">
               <h2 className="text-2xl font-serif font-bold text-forest-800">Wool Carpet Care</h2>
               
               <div className="space-y-4">
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Special Considerations</h3>
                    <p className="text-forest-700">
                    Wool carpets are naturally soil-resistant but require gentle care. Avoid excessive moisture as wool can shrink. Never use bleach or alkaline cleaners which can damage wool fibers.
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Stain Removal</h3>
                    <p className="text-forest-700">
                    For liquid spills, blot with a dry cloth first. For food or oil-based stains, use a wool-safe carpet cleaner. Always test cleaners in an inconspicuous area first. Avoid rubbing which can damage the pile and spread the stain.
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Moth Prevention</h3>
                    <p className="text-forest-700">
                    Wool can be susceptible to moth damage. Regular vacuuming helps prevent moth infestation. Consider using cedar blocks or other moth deterrents, especially in less frequented areas. Periodic professional cleaning also helps deter moths.
                    </p>
               </div>
               </div>
               </TabsContent>
               
               <TabsContent value="silk" className="space-y-6">
               <h2 className="text-2xl font-serif font-bold text-forest-800">Silk Carpet Care</h2>
               
               <div className="space-y-4">
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Delicate Handling</h3>
                    <p className="text-forest-700">
                    Silk carpets require the most delicate care. Use a suction-only vacuum without a beater bar. Vacuum less frequently than other carpets to prevent fiber damage.
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Professional Cleaning Only</h3>
                    <p className="text-forest-700">
                    For silk carpets, we strongly recommend professional cleaning only. Do not attempt DIY cleaning as silk is extremely sensitive to moisture and cleaning agents. Professional cleaning should be done by specialists in Oriental and fine rugs.
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Sunlight Protection</h3>
                    <p className="text-forest-700">
                    Silk is particularly susceptible to sun damage. Avoid placing silk carpets in direct sunlight or use window treatments to protect from UV rays. Rotate your silk carpet periodically to ensure even exposure.
                    </p>
               </div>
               </div>
               </TabsContent>
               
               <TabsContent value="synthetic" className="space-y-6">
               <h2 className="text-2xl font-serif font-bold text-forest-800">Synthetic Carpet Care</h2>
               
               <div className="space-y-4">
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Stain Resistance</h3>
                    <p className="text-forest-700">
                    Synthetic carpets (nylon, polyester, olefin) are generally more stain-resistant than natural fibers. However, prompt attention to spills is still important. Use manufacturer-recommended cleaning solutions for best results.
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Cleaning Options</h3>
                    <p className="text-forest-700">
                    Most synthetic carpets can handle steam cleaning and commercial carpet shampoos. Always test cleaners in an inconspicuous area first. For spot cleaning, use a mild detergent solution (1 teaspoon of dish soap to 1 quart of warm water).
                    </p>
               </div>
               
               <div>
                    <h3 className="text-xl font-medium mb-2 text-forest-800">Static Control</h3>
                    <p className="text-forest-700">
                    Synthetic carpets, especially nylon, can generate static electricity in dry conditions. Maintain humidity levels between 40-60% to reduce static. Anti-static sprays designed for carpets can also help.
                    </p>
               </div>
               </div>
               </TabsContent>
          </Tabs>
          
          <div className="grid md:grid-cols-2 gap-6 mb-10">
               <Card className="bg-clay-50 border-clay-200">
               <CardContent className="pt-6">
               <h3 className="text-xl font-serif font-bold mb-3 text-clay-800">Common Stains</h3>
               <ul className="space-y-2 text-clay-700">
                    <li><span className="font-medium">Coffee/Tea:</span> Blot, then apply a mixture of vinegar, water, and a non-bleach detergent.</li>
                    <li><span className="font-medium">Red Wine:</span> Blot, then apply club soda or a specialized wine stain remover.</li>
                    <li><span className="font-medium">Pet Accidents:</span> Blot, then use an enzymatic cleaner specifically for pet stains.</li>
                    <li><span className="font-medium">Oil/Grease:</span> Apply cornstarch or baking soda, let sit, then vacuum. Follow with appropriate cleaner.</li>
               </ul>
               </CardContent>
               </Card>
               
               <Card className="bg-sand-50 border-sand-200">
               <CardContent className="pt-6">
               <h3 className="text-xl font-serif font-bold mb-3 text-sand-800">Professional Services</h3>
               <p className="text-sand-700 mb-4">
                    We offer professional carpet cleaning and restoration services. Our experts use specialized techniques for different carpet types.
               </p>
               <Button asChild className="w-full bg-forest-700 hover:bg-forest-800">
                    <Link href="/contact" className="flex items-center justify-center gap-2">
                    Request Cleaning Service <ExternalLink className="h-4 w-4" />
                    </Link>
               </Button>
               </CardContent>
               </Card>
          </div>
          
          <div className="text-center">
               <p className="text-forest-700 mb-4">
               For more detailed information or questions about specific carpet care needs, please don&apos;t hesitate to contact us.
               </p>
               <Button asChild variant="outline" className="border-forest-300">
               <Link href="/contact">Contact Our Carpet Care Specialists</Link>
               </Button>
          </div>
          </div>
     </div>
  )
}

export default CarpetCare