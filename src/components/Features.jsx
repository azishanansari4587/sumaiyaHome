import { Truck, Package, Star, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Truck size={32} />,
    title: "Free Shipping",
    description: "Free shipping on all orders over $150"
  },
  {
    icon: <Package size={32} />,
    title: "Easy Returns",
    description: "30-day hassle-free return policy"
  },
  {
    icon: <Star size={32} />,
    title: "Quality Materials",
    description: "Handcrafted with premium natural fibers"
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Secure Payment",
    description: "100% secure payment processing"
  }
];

const Features = () => {
  return (
    <section className="section-padding bg-sand">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;