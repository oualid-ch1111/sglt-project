import bcrypt from 'bcryptjs';
const data = {
  users: [
    {
      name: 'Mohamed',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Oualid',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'POMPE VIDE-CAVE À EAU CLAIRE 400 W - MAKITA',
      category: 'SANS BATTERIE - MAKITA',
      image: '/images/piece2.jpg',
      price: 70,
      brand: 'SGLT',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'bfbrj',
    },
    {
      name: 'POMPE HYDRAULIQUE - 700 BAR - 1 BATTERIE 12 AH - MILWAUKEE',
      category: 'SANS BATTERIE - MAKITA',
      image: '/images/piece2.jpg',
      price: 70,
      brand: 'SGLT',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'bfbrj',
    },
    {
      name: 'POMPE À VIDE 18 V - 1 BATTERIE LI-ION 5 AH 50 L MIN 20 PA (150 MICRONS) - MAKITA',
      category: 'SANS BATTERIE - MAKITA',
      image: '/images/piece2.jpg',
      price: 80,
      brand: 'SGLT',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'bfbrj',
    },
    {
      name: 'POMPE À VIDE SANS FIL 18 V X2 - SANS BATTERIE - MAKITA',
      category: 'SANS BATTERIE - MAKITA',
      image: '/images/piece2.jpg',
      price: 40,
      brand: 'SGLT',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'bfbrj',
    },
    {
      name: 'POMPE À CÂBLE COMPLÈTE - 5M - CPI SALINA',
      category: 'SANS BATTERIE - MAKITA',
      image: '/images/piece2.jpg',
      price: 70,
      brand: 'SGLT',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'bfbrj',
    },
  ].map((product) => ({
    ...product,
    slug: product.name.toLowerCase().replace(/ /g, '-'),
  })),
};

export default data;
