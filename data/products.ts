// data/products.ts
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  fromPrice: string;
  tags: string[];
  imageUrl: string;
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Chocolate Chunk + Sea Salt",
    slug: "chocolate-chunk-sea-salt",
    description: "Crispy edges, gooey center, big chocolate chunks, flaky salt finish.",
    fromPrice: "$3.50",
    tags: ["Best seller", "Gooey", "Classic"],
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1800&q=80",
    featured: true,
  },
  {
    id: "p2",
    name: "Red Velvet Cream",
    slug: "red-velvet-cream",
    description: "Soft red velvet with a creamy middle — extra indulgent.",
    fromPrice: "$3.80",
    tags: ["Soft", "Creamy"],
    imageUrl:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "p3",
    name: "Peanut Butter Melt",
    slug: "peanut-butter-melt",
    description: "Rich peanut butter flavor with a melt-in-your-mouth bite.",
    fromPrice: "$3.60",
    tags: ["Nutty", "Fan favorite"],
    imageUrl:
      "https://images.unsplash.com/photo-1509440159598-8b9f6937f2a6?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "p4",
    name: "Double Chocolate",
    slug: "double-chocolate",
    description: "Cocoa dough + chocolate chips. Deep, rich, fudgy.",
    fromPrice: "$3.70",
    tags: ["Chocolate", "Fudgy"],
    imageUrl:
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1800&q=80",
    featured: true,
  },
  {
    id: "p5",
    name: "Oatmeal Raisin",
    slug: "oatmeal-raisin",
    description: "Chewy oats, warm spice, lightly sweet — the cozy classic.",
    fromPrice: "$3.30",
    tags: ["Chewy", "Cozy"],
    imageUrl:
      "https://images.unsplash.com/photo-1600369672770-985fd30004eb?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "p6",
    name: "Salted Caramel",
    slug: "salted-caramel",
    description: "Caramel pockets with a little salt finish. Sweet, buttery, addictive.",
    fromPrice: "$3.90",
    tags: ["Premium", "Caramel"],
    imageUrl:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1800&q=80",
    featured: true,
  },
  {
    id: "p7",
    name: "White Choc Macadamia",
    slug: "white-choc-macadamia",
    description: "Buttery macadamia crunch with sweet white chocolate.",
    fromPrice: "$3.90",
    tags: ["Crunchy", "Premium"],
    imageUrl:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "p8",
    name: "Lemon Sugar",
    slug: "lemon-sugar",
    description: "Bright lemon zest with a soft, delicate crumble.",
    fromPrice: "$3.40",
    tags: ["Fresh", "Zesty"],
    imageUrl:
      "https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "p9",
    name: "S’mores",
    slug: "smores",
    description: "Chocolate + marshmallow vibes with a toasted finish.",
    fromPrice: "$4.10",
    tags: ["Seasonal", "Sticky"],
    imageUrl:
      "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=1800&q=80",
  },
];