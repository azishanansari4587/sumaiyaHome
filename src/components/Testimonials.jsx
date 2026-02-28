import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York",
    stars: 5,
    text: "The quality of my Moroccan rug exceeded all expectations. The colors are vibrant, and it's become the centerpiece of my living room. Worth every penny!"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "San Francisco",
    stars: 5,
    text: "I was hesitant to purchase a rug online, but I'm so glad I did! The customer service was excellent, and the rug arrived exactly as pictured."
  },
  {
    id: 3,
    name: "Emma Wilson",
    location: "Chicago",
    stars: 4,
    text: "Beautiful craftsmanship and fast shipping. The only reason for 4 stars is that the color was slightly different than what I expected, but still gorgeous."
  }
];

const Testimonials = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md border border-border">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} fill="currentColor" size={20} />
                ))}
                {[...Array(5 - testimonial.stars)].map((_, i) => (
                  <Star key={i + testimonial.stars} size={20} className="text-gray-300" />
                ))}
              </div>
              <p className="mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
