import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'apparel',
    subcategories: [
      { id: 'mens-clothing', name: "Men's Clothing", icon: 'man' },
      { id: 'womens-clothing', name: "Women's Clothing", icon: 'woman' },
      { id: 'shoes', name: 'Shoes', icon: 'steps' },
      { id: 'accessories', name: 'Accessories', icon: 'watch' },
      { id: 'bags', name: 'Bags', icon: 'shopping_bag' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'devices',
    subcategories: [
      { id: 'phones', name: 'Phones', icon: 'smartphone' },
      { id: 'laptops', name: 'Laptops', icon: 'laptop' },
      { id: 'tablets', name: 'Tablets', icon: 'tablet' },
      { id: 'audio', name: 'Audio', icon: 'headphones' },
      { id: 'cameras', name: 'Cameras', icon: 'photo_camera' },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: 'content_cut',
    subcategories: [
      { id: 'skincare', name: 'Skincare', icon: 'spa' },
      { id: 'makeup', name: 'Makeup', icon: 'brush' },
      { id: 'haircare', name: 'Haircare', icon: 'air' },
    ],
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    icon: 'home',
    subcategories: [
      { id: 'furniture', name: 'Furniture', icon: 'chair' },
      { id: 'lighting', name: 'Lighting', icon: 'light' },
      { id: 'bedding', name: 'Bedding', icon: 'bed' },
      { id: 'decor', name: 'Decor', icon: 'wall_art' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    icon: 'restaurant',
    subcategories: [
      { id: 'fresh', name: 'Fresh Produce', icon: 'eco' },
      { id: 'snacks', name: 'Snacks', icon: 'cookie' },
      { id: 'beverages', name: 'Beverages', icon: 'local_cafe' },
    ],
  },
  {
    id: 'baby',
    name: 'Baby',
    icon: 'child_care',
    subcategories: [
      { id: 'clothing-baby', name: 'Clothing', icon: 'checkroom' },
      { id: 'feeding', name: 'Feeding', icon: 'lunch_dining' },
      { id: 'toys', name: 'Toys', icon: 'toys' },
    ],
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'sports_soccer',
    subcategories: [
      { id: 'fitness', name: 'Fitness', icon: 'fitness_center' },
      { id: 'outdoor', name: 'Outdoor', icon: 'hiking' },
      { id: 'sportswear', name: 'Sportswear', icon: 'apparel' },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: 'flatware',
    subcategories: [
      { id: 'cookware', name: 'Cookware', icon: 'skillet' },
      { id: 'appliances', name: 'Appliances', icon: 'blender' },
      { id: 'storage', name: 'Storage', icon: 'inventory_2' },
    ],
  },
];

export const popularBrands = [
  { id: 'b1', name: 'CURATOR', style: 'tracking-widest italic uppercase' },
  { id: 'b2', name: 'LUXE', style: 'font-serif italic' },
  { id: 'b3', name: 'TECHWEAR', style: 'font-mono' },
  { id: 'b4', name: 'K-WAVE', style: 'font-extrabold' },
];
