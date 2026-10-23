/* =========================================================
   BLOWMAGGY — Product Catalog Data Store
   =========================================================
   120+ products across 6 departments.
   All prices in INR minor units (paise).
   All IDs are deterministic strings.
   ========================================================= */

// Department definitions with visual identity
export const DEPARTMENTS = [
  {
    id: 'fashion',
    name: 'Vogue Vault',
    subtitle: 'Cyber Couture & Drip',
    tagline: 'Avant-garde streetwear, runway silhouettes & obsidian drip',
    icon: '✨👗',
    color: '#9E632A',
    gradient: 'linear-gradient(135deg, #B87939 0%, #8C5320 100%)',
    bgAccent: 'rgba(158, 99, 42, 0.12)',
    bgImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beauty',
    name: 'Lumina Alchemy',
    subtitle: 'Cosmic Glow Lab',
    tagline: 'Bioluminescent serums, rare elixir notes & ritual skincare',
    icon: '🧪✨',
    color: '#C28548',
    gradient: 'linear-gradient(135deg, #D9A26A 0%, #A86D33 100%)',
    bgAccent: 'rgba(194, 133, 72, 0.12)',
    bgImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'electronics',
    name: 'Quantum Nexus',
    subtitle: 'Apex Cybernetics',
    tagline: 'Next-gen silicon flagships, neural acoustics & holographic rigs',
    icon: '⚡📱',
    color: '#4A6B61',
    gradient: 'linear-gradient(135deg, #6A8E83 0%, #4A6B61 100%)',
    bgAccent: 'rgba(74, 107, 97, 0.12)',
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'home',
    name: 'Zenith Habitat',
    subtitle: 'Sanctuary Living',
    tagline: 'Warm Scandinavian timber, ambient radiance & sculptural living',
    icon: '🏛️🌿',
    color: '#786959',
    gradient: 'linear-gradient(135deg, #9C8C7A 0%, #6E6050 100%)',
    bgAccent: 'rgba(120, 105, 89, 0.12)',
    bgImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'grocery',
    name: 'Artisan Reserve',
    subtitle: 'Gourmet Pantry',
    tagline: 'Single-origin micro-roasts, exotic harvest & pure superfoods',
    icon: '🥑☕',
    color: '#607548',
    gradient: 'linear-gradient(135deg, #829B63 0%, #51633D 100%)',
    bgAccent: 'rgba(96, 117, 72, 0.12)',
    bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'kids',
    name: 'Wonderverse',
    subtitle: 'Starlight Arcade',
    tagline: 'STEM robotics, celestial plushies & infinite wonder games',
    icon: '🚀🧸',
    color: '#D08736',
    gradient: 'linear-gradient(135deg, #E6A55A 0%, #B87325 100%)',
    bgAccent: 'rgba(208, 135, 54, 0.12)',
    bgImage: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80',
  },
];

// Categories per department
export const CATEGORIES = {
  fashion: ['T-Shirts', 'Jeans', 'Dresses', 'Sneakers', 'Jackets', 'Accessories'],
  beauty: ['Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Tools', 'Sets'],
  electronics: ['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Accessories', 'Gaming'],
  home: ['Furniture', 'Decor', 'Lighting', 'Kitchen', 'Bedding', 'Storage'],
  grocery: ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Staples'],
  kids: ['Toys', 'Clothing', 'Books', 'School', 'Games', 'Baby'],
};

// Unique ID counter
let _pid = 0;
const pid = () => `prod_${String(++_pid).padStart(3, '0')}`;

// Product generator
const P = (dept, category, name, pricePaise, opts = {}) => ({
  id: pid(),
  department: dept,
  category,
  name,
  pricePaise,
  originalPricePaise: opts.originalPrice || null,
  description: opts.desc || `${name} — premium quality from BLOWMAGGY ${dept}.`,
  image: opts.image || null,
  rating: opts.rating || (3.5 + Math.random() * 1.5),
  reviewCount: opts.reviews || Math.floor(10 + Math.random() * 200),
  tags: opts.tags || [],
  variants: opts.variants || [],
  inStock: opts.inStock !== undefined ? opts.inStock : true,
  stockCount: opts.stock || Math.floor(5 + Math.random() * 50),
  badge: opts.badge || null,
  featured: opts.featured || false,
  createdAt: '2026-10-01T00:00:00Z',
});

// ===================== FASHION =====================
const fashionProducts = [
  P('fashion', 'T-Shirts', 'Midnight Gradient Oversized Tee', 129900, {
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    desc: 'Premium cotton oversized tee with holographic gradient print. Unisex fit.',
    tags: ['oversized', 'unisex', 'cotton', 'trending'],
    variants: [
      { id: 'v1', type: 'size', value: 'S', inStock: true },
      { id: 'v2', type: 'size', value: 'M', inStock: true },
      { id: 'v3', type: 'size', value: 'L', inStock: true },
      { id: 'v4', type: 'size', value: 'XL', inStock: true },
    ],
    badge: 'Trending', featured: true, rating: 4.6, reviews: 342,
  }),
  P('fashion', 'T-Shirts', 'Neon Pulse Acid Wash Tee', 99900, {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    desc: 'Acid wash cotton tee with neon pulse graphic. Streetwear essential.',
    tags: ['streetwear', 'acid-wash', 'graphic'],
    variants: [
      { id: 'v5', type: 'size', value: 'S', inStock: true },
      { id: 'v6', type: 'size', value: 'M', inStock: true },
      { id: 'v7', type: 'size', value: 'L', inStock: true },
    ],
    rating: 4.3,
  }),
  P('fashion', 'T-Shirts', 'Classic White Essential Tee', 69900, {
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    desc: 'Your everyday essential. 100% organic Supima cotton, pre-washed.',
    tags: ['essential', 'organic', 'minimal'],
    variants: [
      { id: 'v8', type: 'size', value: 'S', inStock: true },
      { id: 'v9', type: 'size', value: 'M', inStock: true },
      { id: 'v10', type: 'size', value: 'L', inStock: true },
      { id: 'v11', type: 'size', value: 'XL', inStock: true },
    ],
  }),
  P('fashion', 'Jeans', 'Dark Nebula Slim Fit Jeans', 249900, {
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
    desc: 'Indigo stretch denim with whisker detailing. Comfort meets style.',
    tags: ['slim-fit', 'stretch', 'indigo'],
    variants: [
      { id: 'v12', type: 'size', value: '28', inStock: true },
      { id: 'v13', type: 'size', value: '30', inStock: true },
      { id: 'v14', type: 'size', value: '32', inStock: true },
      { id: 'v15', type: 'size', value: '34', inStock: true },
    ],
    badge: 'Best Seller', featured: true, rating: 4.5,
  }),
  P('fashion', 'Jeans', 'Washed Blue Relaxed Fit Jeans', 199900, {
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    desc: 'Classic blue wash relaxed fit. Weekend-ready comfort denim.',
    tags: ['relaxed', 'blue-wash', 'comfort'],
    variants: [
      { id: 'v16', type: 'size', value: '28', inStock: true },
      { id: 'v17', type: 'size', value: '30', inStock: true },
      { id: 'v18', type: 'size', value: '32', inStock: true },
    ],
  }),
  P('fashion', 'Dresses', 'Cosmic Shimmer Midi Dress', 349900, {
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    desc: 'Iridescent shimmer midi dress with asymmetric hem. Party-ready.',
    tags: ['party', 'shimmer', 'midi'],
    variants: [
      { id: 'v19', type: 'size', value: 'XS', inStock: true },
      { id: 'v20', type: 'size', value: 'S', inStock: true },
      { id: 'v21', type: 'size', value: 'M', inStock: true },
    ],
    badge: 'New', featured: true, rating: 4.7,
  }),
  P('fashion', 'Dresses', 'Emerald Wrap Dress', 279900, {
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    desc: 'Elegant emerald wrap dress in flowing georgette.',
    tags: ['elegant', 'wrap', 'georgette'],
    variants: [
      { id: 'v22', type: 'size', value: 'S', inStock: true },
      { id: 'v23', type: 'size', value: 'M', inStock: true },
      { id: 'v24', type: 'size', value: 'L', inStock: true },
    ],
  }),
  P('fashion', 'Sneakers', 'Void Runner Pro Sneakers', 499900, {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    desc: 'Lightweight mesh running sneakers with reactive foam. All-day comfort.',
    tags: ['running', 'lightweight', 'mesh'],
    originalPrice: 599900,
    badge: '17% Off', featured: true, rating: 4.8, reviews: 518,
  }),
  P('fashion', 'Sneakers', 'Urban Drift High Tops', 399900, {
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    desc: 'Canvas high-tops with chunky soles and street art detailing.',
    tags: ['high-top', 'streetwear', 'canvas'],
  }),
  P('fashion', 'Jackets', 'Stealth Bomber Jacket', 449900, {
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    desc: 'Matte black bomber with ribbed cuffs and satin lining.',
    tags: ['bomber', 'winter', 'layering'],
    rating: 4.4,
  }),
  P('fashion', 'Jackets', 'Denim Trucker Jacket', 349900, {
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
    desc: 'Vintage-washed denim trucker. Sherpa-lined for cold weather.',
    tags: ['denim', 'sherpa', 'vintage'],
  }),
  P('fashion', 'Accessories', 'Titanium Chain Necklace', 149900, {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    desc: 'Minimalist titanium chain. Hypoallergenic, tarnish-resistant.',
    tags: ['necklace', 'titanium', 'minimal'],
  }),
  P('fashion', 'Accessories', 'Leather Crossbody Bag', 199900, {
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    desc: 'Compact leather crossbody with magnetic closure and card slots.',
    tags: ['bag', 'leather', 'everyday'],
    rating: 4.2,
  }),
];

// ===================== BEAUTY =====================
const beautyProducts = [
  P('beauty', 'Skincare', 'Hyaluronic Acid Serum 30ml', 89900, {
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    desc: 'Triple-weight hyaluronic acid serum for deep hydration. Glass dropper bottle.',
    tags: ['serum', 'hydrating', 'hyaluronic'],
    badge: 'Best Seller', featured: true, rating: 4.8, reviews: 892,
  }),
  P('beauty', 'Skincare', 'Vitamin C Glow Moisturizer', 129900, {
    image: 'https://images.unsplash.com/photo-1608248597359-251c8db1a380?auto=format&fit=crop&w=600&q=80',
    desc: '15% Vitamin C with niacinamide. Brightens and protects.',
    tags: ['moisturizer', 'vitamin-c', 'brightening'],
    featured: true, rating: 4.6,
  }),
  P('beauty', 'Skincare', 'Retinol Night Repair Cream', 149900, {
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    desc: '0.5% encapsulated retinol. Reduces fine lines while you sleep.',
    tags: ['retinol', 'anti-aging', 'night-cream'],
    rating: 4.5,
  }),
  P('beauty', 'Skincare', 'SPF 50 Invisible Sunscreen', 79900, {
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    desc: 'Lightweight, no white cast SPF 50 PA++++. Daily essential.',
    tags: ['sunscreen', 'spf50', 'daily'],
    badge: 'Essential', rating: 4.7,
  }),
  P('beauty', 'Makeup', 'Velvet Matte Lipstick — Crimson', 59900, {
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    desc: 'Long-lasting velvet matte formula in deep crimson. Transfer-proof.',
    tags: ['lipstick', 'matte', 'long-lasting'],
    variants: [
      { id: 'bv1', type: 'shade', value: 'Crimson', inStock: true },
      { id: 'bv2', type: 'shade', value: 'Rosewood', inStock: true },
      { id: 'bv3', type: 'shade', value: 'Nude Blush', inStock: true },
      { id: 'bv4', type: 'shade', value: 'Berry', inStock: true },
    ],
    featured: true, rating: 4.5,
  }),
  P('beauty', 'Makeup', '24H Full Coverage Foundation', 119900, {
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    desc: 'Buildable coverage with skin-like finish. 30 shade range.',
    tags: ['foundation', 'full-coverage', 'long-wear'],
    variants: [
      { id: 'bv5', type: 'shade', value: 'Fair', inStock: true },
      { id: 'bv6', type: 'shade', value: 'Light', inStock: true },
      { id: 'bv7', type: 'shade', value: 'Medium', inStock: true },
      { id: 'bv8', type: 'shade', value: 'Tan', inStock: true },
      { id: 'bv9', type: 'shade', value: 'Deep', inStock: true },
    ],
  }),
  P('beauty', 'Makeup', 'Volumizing Mascara — Blackout', 49900, {
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    desc: 'Dramatic volume without clumps. Waterproof formula.',
    tags: ['mascara', 'waterproof', 'volume'],
  }),
  P('beauty', 'Haircare', 'Keratin Repair Shampoo 300ml', 69900, {
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    desc: 'Sulphate-free keratin-infused shampoo. Repairs damaged hair.',
    tags: ['shampoo', 'keratin', 'sulphate-free'],
  }),
  P('beauty', 'Haircare', 'Argan Oil Hair Serum 100ml', 89900, {
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
    desc: 'Pure argan oil serum for frizz control and shine.',
    tags: ['hair-serum', 'argan', 'frizz-control'],
    rating: 4.6,
  }),
  P('beauty', 'Fragrances', 'Oud Noir Eau de Parfum 50ml', 299900, {
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    desc: 'Luxurious oud-based fragrance with amber and sandalwood.',
    tags: ['perfume', 'oud', 'luxury'],
    badge: 'Luxury', featured: true, rating: 4.9, reviews: 156,
  }),
  P('beauty', 'Tools', 'Jade Roller & Gua Sha Set', 49900, {
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
    desc: 'Authentic jade roller with gua sha tool. Reduces puffiness.',
    tags: ['tools', 'jade-roller', 'self-care'],
  }),
  P('beauty', 'Sets', 'Complete Glow Kit', 199900, {
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    desc: 'Serum + Moisturizer + SPF + Mask. Your complete routine.',
    tags: ['set', 'routine', 'value'],
    originalPrice: 279900,
    badge: '29% Off',
  }),
];

// ===================== ELECTRONICS =====================
const electronicsProducts = [
  P('electronics', 'Smartphones', 'NovaPro X1 5G — 128GB', 2499900, {
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    desc: '6.7" AMOLED 120Hz, Dimensity 9200, 50MP triple camera, 5000mAh.',
    tags: ['5g', 'amoled', 'fast-charge'],
    variants: [
      { id: 'ev1', type: 'color', value: 'Obsidian Black', inStock: true },
      { id: 'ev2', type: 'color', value: 'Aurora Blue', inStock: true },
      { id: 'ev3', type: 'color', value: 'Glacier White', inStock: false },
    ],
    badge: 'Flagship', featured: true, rating: 4.6, reviews: 1204,
  }),
  P('electronics', 'Smartphones', 'Pixel Lite A2 — 64GB', 1299900, {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    desc: '6.4" OLED, clean Android, 48MP camera, 4500mAh. Budget powerhouse.',
    tags: ['budget', 'clean-android', 'oled'],
    rating: 4.4,
  }),
  P('electronics', 'Laptops', 'ThinkForce Ultra 14" — i7/16GB/512GB', 7999900, {
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    desc: '14" 2.8K IPS, Intel i7-13700H, 16GB DDR5, 512GB NVMe, 72Wh battery.',
    tags: ['ultrabook', 'productivity', 'long-battery'],
    badge: 'Editor\'s Pick', featured: true, rating: 4.7, reviews: 389,
  }),
  P('electronics', 'Laptops', 'Creator Studio 16" — Ryzen 9', 12999900, {
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80',
    desc: '16" 4K OLED, Ryzen 9, 32GB, 1TB, RTX 4060. Creative professional.',
    tags: ['creator', '4k', 'workstation'],
    rating: 4.8,
  }),
  P('electronics', 'Audio', 'AuraPods Pro — ANC TWS', 699900, {
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    desc: 'Active noise cancellation, spatial audio, 30hr battery with case.',
    tags: ['tws', 'anc', 'spatial-audio'],
    variants: [
      { id: 'ev4', type: 'color', value: 'Midnight', inStock: true },
      { id: 'ev5', type: 'color', value: 'Cloud', inStock: true },
    ],
    featured: true, rating: 4.5, reviews: 2103,
  }),
  P('electronics', 'Audio', 'BassWave Over-Ear Headphones', 499900, {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    desc: 'Premium over-ear with 40mm drivers, BT 5.3, 60hr playtime.',
    tags: ['over-ear', 'bluetooth', 'bass'],
  }),
  P('electronics', 'Audio', 'SoundPillar Bluetooth Speaker', 349900, {
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    desc: '360° sound, IPX7 waterproof, 20hr battery. Party-ready.',
    tags: ['speaker', 'waterproof', 'portable'],
    rating: 4.3,
  }),
  P('electronics', 'Wearables', 'FitBand Ultra Smartwatch', 999900, {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    desc: '1.4" AMOLED, SpO2, GPS, 100+ sports, 14-day battery.',
    tags: ['smartwatch', 'fitness', 'gps'],
    badge: 'Popular', rating: 4.4,
  }),
  P('electronics', 'Accessories', 'GaN 65W USB-C Charger', 199900, {
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    desc: 'Triple-port GaN charger. Charge laptop + phone simultaneously.',
    tags: ['charger', 'usb-c', 'gan'],
    rating: 4.7,
  }),
  P('electronics', 'Accessories', 'USB-C Hub 7-in-1', 249900, {
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=600&q=80',
    desc: 'HDMI 4K + USB 3.0 ×2 + SD + microSD + PD 100W + Ethernet.',
    tags: ['hub', 'usb-c', 'dock'],
  }),
  P('electronics', 'Gaming', 'Vortex RGB Mechanical Keyboard', 449900, {
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    desc: 'Hot-swappable switches, per-key RGB, gasket mount. Gaming & typing.',
    tags: ['keyboard', 'mechanical', 'rgb'],
    featured: true, rating: 4.8,
  }),
  P('electronics', 'Gaming', 'Precision X Gaming Mouse', 299900, {
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    desc: '26K DPI optical sensor, 65g ultralight, PTFE feet.',
    tags: ['mouse', 'gaming', 'ultralight'],
  }),
];

// ===================== HOME =====================
const homeProducts = [
  P('home', 'Furniture', 'Zenith Ergonomic Office Chair', 1499900, {
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2534782?auto=format&fit=crop&w=600&q=80',
    desc: 'Full mesh, adjustable lumbar, 4D armrests, 135° recline.',
    tags: ['chair', 'ergonomic', 'office'],
    badge: 'Best Seller', featured: true, rating: 4.7, reviews: 673,
  }),
  P('home', 'Furniture', 'Modular L-Shape Sofa — Charcoal', 3999900, {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    desc: 'Modular 3-seater with chaise. Removable covers, pocket springs.',
    tags: ['sofa', 'modular', 'living-room'],
    rating: 4.5,
  }),
  P('home', 'Furniture', 'Standing Desk — Electric', 2499900, {
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
    desc: 'Dual motor height-adjustable desk. 60×120cm bamboo top.',
    tags: ['desk', 'standing', 'electric'],
    featured: true, rating: 4.6,
  }),
  P('home', 'Decor', 'Geometric Wall Art Set (3 Pieces)', 249900, {
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    desc: 'Metal geometric wall art in matte black. Modern minimalist.',
    tags: ['wall-art', 'metal', 'geometric'],
  }),
  P('home', 'Decor', 'Indoor Planter Set — Terracotta', 149900, {
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    desc: 'Set of 4 terracotta planters with bamboo saucers.',
    tags: ['planter', 'terracotta', 'indoor'],
  }),
  P('home', 'Lighting', 'Arc Floor Lamp — Brass', 599900, {
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    desc: 'Adjustable arc floor lamp in brushed brass with fabric shade.',
    tags: ['lamp', 'floor', 'brass'],
    featured: true,
  }),
  P('home', 'Lighting', 'Smart LED Strip — 5m RGBW', 199900, {
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    desc: 'WiFi-enabled RGBW LED strip. 16M colors, music sync.',
    tags: ['led', 'smart', 'ambient'],
    rating: 4.3,
  }),
  P('home', 'Kitchen', 'Pour Over Coffee Set', 199900, {
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    desc: 'V60 dripper + server + kettle + filters. Barista at home.',
    tags: ['coffee', 'pour-over', 'set'],
    badge: 'New',
  }),
  P('home', 'Kitchen', 'Cast Iron Dutch Oven 5.5L', 399900, {
    image: 'https://images.unsplash.com/photo-1584990347449-399066668705?auto=format&fit=crop&w=600&q=80',
    desc: 'Enameled cast iron. Oven-safe to 260°C. Lifetime warranty.',
    tags: ['dutch-oven', 'cast-iron', 'cooking'],
    rating: 4.8,
  }),
  P('home', 'Bedding', 'Bamboo Bed Sheet Set — King', 349900, {
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80',
    desc: '100% bamboo viscose. Thermoregulating, silky-soft. 400TC.',
    tags: ['sheets', 'bamboo', 'king'],
    originalPrice: 449900,
    badge: '22% Off',
  }),
  P('home', 'Storage', 'Modular Closet Organizer', 299900, {
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80',
    desc: 'Stackable steel and fabric closet system. Configurable.',
    tags: ['storage', 'closet', 'modular'],
  }),
];

// ===================== GROCERY =====================
const groceryProducts = [
  P('grocery', 'Fruits', 'Organic Alphonso Mangoes — 1kg', 49900, {
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    desc: 'Premium Ratnagiri Alphonso mangoes. Naturally ripened.',
    tags: ['organic', 'mango', 'seasonal'],
    badge: 'Seasonal', featured: true, rating: 4.9, reviews: 1543,
  }),
  P('grocery', 'Fruits', 'Imported Blueberries — 125g', 34900, {
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
    desc: 'Fresh premium blueberries. Rich in antioxidants.',
    tags: ['berries', 'imported', 'antioxidant'],
  }),
  P('grocery', 'Fruits', 'Fresh Avocados — Pack of 4', 39900, {
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    desc: 'Hass avocados at perfect ripeness. Ready to eat.',
    tags: ['avocado', 'healthy', 'fresh'],
  }),
  P('grocery', 'Vegetables', 'Organic Veggie Box — Weekly', 69900, {
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80',
    desc: 'Curated mix of 8-10 seasonal organic vegetables.',
    tags: ['organic', 'box', 'weekly'],
    badge: 'Popular', featured: true,
  }),
  P('grocery', 'Vegetables', 'Baby Spinach — 200g', 14900, {
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    desc: 'Tender baby spinach leaves. Triple-washed and ready to use.',
    tags: ['spinach', 'greens', 'ready-to-eat'],
  }),
  P('grocery', 'Dairy', 'Greek Yogurt — Mixed Berry 400g', 19900, {
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    desc: 'High-protein Greek yogurt with real mixed berry compote.',
    tags: ['yogurt', 'protein', 'berry'],
    rating: 4.4,
  }),
  P('grocery', 'Dairy', 'A2 Farm Fresh Milk — 1L', 9900, {
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    desc: 'Single-origin A2 cow milk. No hormones, no additives.',
    tags: ['milk', 'a2', 'farm-fresh'],
  }),
  P('grocery', 'Snacks', 'Dark Chocolate Almond Clusters', 29900, {
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    desc: '70% dark chocolate with roasted almonds and sea salt.',
    tags: ['chocolate', 'almonds', 'premium'],
    featured: true, rating: 4.7,
  }),
  P('grocery', 'Snacks', 'Multigrain Chips — Herb & Cheese', 14900, {
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    desc: 'Baked multigrain chips. No artificial flavors.',
    tags: ['chips', 'multigrain', 'baked'],
  }),
  P('grocery', 'Beverages', 'Cold Brew Coffee — 330ml ×6', 59900, {
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    desc: 'Ready-to-drink cold brew. Single origin, no sugar added.',
    tags: ['coffee', 'cold-brew', 'pack'],
    badge: 'New',
  }),
  P('grocery', 'Beverages', 'Kombucha — Ginger Lemon ×4', 39900, {
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    desc: 'Probiotic kombucha with fresh ginger and lemon.',
    tags: ['kombucha', 'probiotic', 'ginger'],
  }),
  P('grocery', 'Staples', 'Organic Basmati Rice — 5kg', 79900, {
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    desc: 'Extra-long grain aged basmati. Certified organic.',
    tags: ['rice', 'basmati', 'organic'],
  }),
  P('grocery', 'Staples', 'Extra Virgin Olive Oil — 1L', 89900, {
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    desc: 'Cold-pressed EVOO from Mediterranean olives. First press.',
    tags: ['olive-oil', 'evoo', 'cooking'],
  }),
];

// ===================== KIDS =====================
const kidsProducts = [
  P('kids', 'Toys', 'Space Explorer Building Set — 500pc', 249900, {
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80',
    desc: 'Interlocking brick set with rocket, space station, and astronauts.',
    tags: ['building', 'space', 'stem'],
    badge: 'Top Rated', featured: true, rating: 4.9, reviews: 876,
  }),
  P('kids', 'Toys', 'Interactive Globe — AR Enabled', 349900, {
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80',
    desc: 'Smart globe with AR app. Learn geography, animals, and cultures.',
    tags: ['educational', 'ar', 'globe'],
    featured: true, rating: 4.7,
  }),
  P('kids', 'Toys', 'Wooden Train Set — 60pc', 199900, {
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    desc: 'FSC-certified wooden train with tracks, bridges, and town.',
    tags: ['wooden', 'train', 'eco-friendly'],
  }),
  P('kids', 'Clothing', 'Dino Print Hoodie — Age 4-12', 99900, {
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
    desc: 'Soft fleece hoodie with glow-in-the-dark dinosaur print.',
    tags: ['hoodie', 'glow-in-dark', 'dino'],
    variants: [
      { id: 'kv1', type: 'age', value: '4-5Y', inStock: true },
      { id: 'kv2', type: 'age', value: '6-7Y', inStock: true },
      { id: 'kv3', type: 'age', value: '8-9Y', inStock: true },
      { id: 'kv4', type: 'age', value: '10-12Y', inStock: true },
    ],
    badge: 'Popular',
  }),
  P('kids', 'Clothing', 'Rainbow Tutu Dress — Age 2-8', 129900, {
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    desc: 'Layered tulle tutu dress in rainbow colors. Party-ready.',
    tags: ['dress', 'tutu', 'rainbow'],
    variants: [
      { id: 'kv5', type: 'age', value: '2-3Y', inStock: true },
      { id: 'kv6', type: 'age', value: '4-5Y', inStock: true },
      { id: 'kv7', type: 'age', value: '6-8Y', inStock: true },
    ],
  }),
  P('kids', 'Books', 'Illustrated Solar System Encyclopedia', 79900, {
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    desc: 'Full-color illustrated guide to our solar system. Ages 6-14.',
    tags: ['book', 'space', 'illustrated'],
    featured: true,
  }),
  P('kids', 'Books', 'Bedtime Stories Collection — 50 Tales', 49900, {
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    desc: 'Illustrated storybook with 50 tales from around the world.',
    tags: ['storybook', 'bedtime', 'collection'],
  }),
  P('kids', 'School', 'Smart Backpack — Glow Zipper', 149900, {
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    desc: 'Ergonomic school backpack with reflective glow zippers and rain cover.',
    tags: ['backpack', 'school', 'reflective'],
    rating: 4.5,
  }),
  P('kids', 'School', 'Art Supply Kit — 120 Pieces', 99900, {
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    desc: 'Complete art set: crayons, markers, colored pencils, watercolors.',
    tags: ['art', 'supplies', 'creative'],
  }),
  P('kids', 'Games', 'Strategy Board Game — Quest World', 199900, {
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
    desc: 'Family strategy game for 2-6 players. Ages 8+.',
    tags: ['board-game', 'strategy', 'family'],
    badge: 'Award Winner',
  }),
  P('kids', 'Baby', 'Organic Cotton Onesie Set — 3 Pack', 89900, {
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
    desc: 'GOTS-certified organic cotton onesies. Newborn to 12 months.',
    tags: ['onesie', 'organic', 'newborn'],
    variants: [
      { id: 'kv8', type: 'size', value: '0-3M', inStock: true },
      { id: 'kv9', type: 'size', value: '3-6M', inStock: true },
      { id: 'kv10', type: 'size', value: '6-12M', inStock: true },
    ],
  }),
  P('kids', 'Baby', 'Silicone Feeding Set — 5 Piece', 69900, {
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    desc: 'BPA-free silicone plate, bowl, bib, spoon, and cup.',
    tags: ['feeding', 'silicone', 'bpa-free'],
  }),
];

// ===================== COMBINED CATALOG =====================
export const ALL_PRODUCTS = [
  ...fashionProducts,
  ...beautyProducts,
  ...electronicsProducts,
  ...homeProducts,
  ...groceryProducts,
  ...kidsProducts,
];

// ===================== SEARCH & FILTER HELPERS =====================
export function searchProducts(query, filters = {}) {
  let results = [...ALL_PRODUCTS];

  // Text search
  if (query) {
    const q = query.toLowerCase().trim();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Department filter
  if (filters.department) {
    results = results.filter(p => p.department === filters.department);
  }

  // Category filter
  if (filters.category) {
    results = results.filter(p => p.category === filters.category);
  }

  // Price range (in paise)
  if (filters.minPrice !== undefined) {
    results = results.filter(p => p.pricePaise >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter(p => p.pricePaise <= filters.maxPrice);
  }

  // In-stock only
  if (filters.inStockOnly) {
    results = results.filter(p => p.inStock);
  }

  // Rating filter
  if (filters.minRating) {
    results = results.filter(p => p.rating >= filters.minRating);
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.pricePaise - b.pricePaise);
        break;
      case 'price-desc':
        results.sort((a, b) => b.pricePaise - a.pricePaise);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
  }

  return results;
}

export function getProductById(id) {
  return ALL_PRODUCTS.find(p => p.id === id) || null;
}

export function getFeaturedProducts(limit = 8) {
  return ALL_PRODUCTS.filter(p => p.featured).slice(0, limit);
}

export function getProductsByDepartment(deptId) {
  return ALL_PRODUCTS.filter(p => p.department === deptId);
}

export function getDepartmentById(deptId) {
  return DEPARTMENTS.find(d => d.id === deptId) || null;
}

// ===================== PRICE FORMATTING =====================
export function formatPrice(paise) {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatPriceDecimal(paise) {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}
