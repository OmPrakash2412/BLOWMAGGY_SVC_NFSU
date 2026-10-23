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
    name: 'The Runway',
    subtitle: 'Fashion',
    tagline: 'Style has no boundaries',
    icon: '👗',
    color: '#b46578',
    gradient: 'linear-gradient(135deg, #c7838f 0%, #a95369 100%)',
    bgAccent: 'rgba(180, 101, 120, 0.1)',
  },
  {
    id: 'beauty',
    name: 'The Lab',
    subtitle: 'Beauty',
    tagline: 'Science meets glow',
    icon: '✨',
    color: '#ce8795',
    gradient: 'linear-gradient(135deg, #dfa6ad 0%, #bd7181 100%)',
    bgAccent: 'rgba(206, 135, 149, 0.1)',
  },
  {
    id: 'electronics',
    name: 'The Grid',
    subtitle: 'Electronics',
    tagline: 'Power your world',
    icon: '⚡',
    color: '#63877d',
    gradient: 'linear-gradient(135deg, #8eaa9c 0%, #63877d 100%)',
    bgAccent: 'rgba(99, 135, 125, 0.1)',
  },
  {
    id: 'home',
    name: 'The Sanctuary',
    subtitle: 'Home',
    tagline: 'Design your peace',
    icon: '🏡',
    color: '#95818b',
    gradient: 'linear-gradient(135deg, #b3a0a3 0%, #8b707d 100%)',
    bgAccent: 'rgba(149, 129, 139, 0.1)',
  },
  {
    id: 'grocery',
    name: 'The Dailyverse',
    subtitle: 'Grocery',
    tagline: 'Fresh. Fast. Real.',
    icon: '🥑',
    color: '#74845f',
    gradient: 'linear-gradient(135deg, #a1ad82 0%, #74845f 100%)',
    bgAccent: 'rgba(116, 132, 95, 0.1)',
  },
  {
    id: 'kids',
    name: 'The Wonderland',
    subtitle: 'Kids',
    tagline: 'Where imagination shops',
    icon: '🧸',
    color: '#c58b58',
    gradient: 'linear-gradient(135deg, #ddb17d 0%, #bd8051 100%)',
    bgAccent: 'rgba(197, 139, 88, 0.1)',
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
    desc: 'Classic blue wash relaxed fit. Weekend-ready comfort denim.',
    tags: ['relaxed', 'blue-wash', 'comfort'],
    variants: [
      { id: 'v16', type: 'size', value: '28', inStock: true },
      { id: 'v17', type: 'size', value: '30', inStock: true },
      { id: 'v18', type: 'size', value: '32', inStock: true },
    ],
  }),
  P('fashion', 'Dresses', 'Cosmic Shimmer Midi Dress', 349900, {
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
    desc: 'Elegant emerald wrap dress in flowing georgette.',
    tags: ['elegant', 'wrap', 'georgette'],
    variants: [
      { id: 'v22', type: 'size', value: 'S', inStock: true },
      { id: 'v23', type: 'size', value: 'M', inStock: true },
      { id: 'v24', type: 'size', value: 'L', inStock: true },
    ],
  }),
  P('fashion', 'Sneakers', 'Void Runner Pro Sneakers', 499900, {
    desc: 'Lightweight mesh running sneakers with reactive foam. All-day comfort.',
    tags: ['running', 'lightweight', 'mesh'],
    originalPrice: 599900,
    badge: '17% Off', featured: true, rating: 4.8, reviews: 518,
  }),
  P('fashion', 'Sneakers', 'Urban Drift High Tops', 399900, {
    desc: 'Canvas high-tops with chunky soles and street art detailing.',
    tags: ['high-top', 'streetwear', 'canvas'],
  }),
  P('fashion', 'Jackets', 'Stealth Bomber Jacket', 449900, {
    desc: 'Matte black bomber with ribbed cuffs and satin lining.',
    tags: ['bomber', 'winter', 'layering'],
    rating: 4.4,
  }),
  P('fashion', 'Jackets', 'Denim Trucker Jacket', 349900, {
    desc: 'Vintage-washed denim trucker. Sherpa-lined for cold weather.',
    tags: ['denim', 'sherpa', 'vintage'],
  }),
  P('fashion', 'Accessories', 'Titanium Chain Necklace', 149900, {
    desc: 'Minimalist titanium chain. Hypoallergenic, tarnish-resistant.',
    tags: ['necklace', 'titanium', 'minimal'],
  }),
  P('fashion', 'Accessories', 'Leather Crossbody Bag', 199900, {
    desc: 'Compact leather crossbody with magnetic closure and card slots.',
    tags: ['bag', 'leather', 'everyday'],
    rating: 4.2,
  }),
];

// ===================== BEAUTY =====================
const beautyProducts = [
  P('beauty', 'Skincare', 'Hyaluronic Acid Serum 30ml', 89900, {
    desc: 'Triple-weight hyaluronic acid serum for deep hydration. Glass dropper bottle.',
    tags: ['serum', 'hydrating', 'hyaluronic'],
    badge: 'Best Seller', featured: true, rating: 4.8, reviews: 892,
  }),
  P('beauty', 'Skincare', 'Vitamin C Glow Moisturizer', 129900, {
    desc: '15% Vitamin C with niacinamide. Brightens and protects.',
    tags: ['moisturizer', 'vitamin-c', 'brightening'],
    featured: true, rating: 4.6,
  }),
  P('beauty', 'Skincare', 'Retinol Night Repair Cream', 149900, {
    desc: '0.5% encapsulated retinol. Reduces fine lines while you sleep.',
    tags: ['retinol', 'anti-aging', 'night-cream'],
    rating: 4.5,
  }),
  P('beauty', 'Skincare', 'SPF 50 Invisible Sunscreen', 79900, {
    desc: 'Lightweight, no white cast SPF 50 PA++++. Daily essential.',
    tags: ['sunscreen', 'spf50', 'daily'],
    badge: 'Essential', rating: 4.7,
  }),
  P('beauty', 'Makeup', 'Velvet Matte Lipstick — Crimson', 59900, {
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
    desc: 'Dramatic volume without clumps. Waterproof formula.',
    tags: ['mascara', 'waterproof', 'volume'],
  }),
  P('beauty', 'Haircare', 'Keratin Repair Shampoo 300ml', 69900, {
    desc: 'Sulphate-free keratin-infused shampoo. Repairs damaged hair.',
    tags: ['shampoo', 'keratin', 'sulphate-free'],
  }),
  P('beauty', 'Haircare', 'Argan Oil Hair Serum 100ml', 89900, {
    desc: 'Pure argan oil serum for frizz control and shine.',
    tags: ['hair-serum', 'argan', 'frizz-control'],
    rating: 4.6,
  }),
  P('beauty', 'Fragrances', 'Oud Noir Eau de Parfum 50ml', 299900, {
    desc: 'Luxurious oud-based fragrance with amber and sandalwood.',
    tags: ['perfume', 'oud', 'luxury'],
    badge: 'Luxury', featured: true, rating: 4.9, reviews: 156,
  }),
  P('beauty', 'Tools', 'Jade Roller & Gua Sha Set', 49900, {
    desc: 'Authentic jade roller with gua sha tool. Reduces puffiness.',
    tags: ['tools', 'jade-roller', 'self-care'],
  }),
  P('beauty', 'Sets', 'Complete Glow Kit', 199900, {
    desc: 'Serum + Moisturizer + SPF + Mask. Your complete routine.',
    tags: ['set', 'routine', 'value'],
    originalPrice: 279900,
    badge: '29% Off',
  }),
];

// ===================== ELECTRONICS =====================
const electronicsProducts = [
  P('electronics', 'Smartphones', 'NovaPro X1 5G — 128GB', 2499900, {
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
    desc: '6.4" OLED, clean Android, 48MP camera, 4500mAh. Budget powerhouse.',
    tags: ['budget', 'clean-android', 'oled'],
    rating: 4.4,
  }),
  P('electronics', 'Laptops', 'ThinkForce Ultra 14" — i7/16GB/512GB', 7999900, {
    desc: '14" 2.8K IPS, Intel i7-13700H, 16GB DDR5, 512GB NVMe, 72Wh battery.',
    tags: ['ultrabook', 'productivity', 'long-battery'],
    badge: 'Editor\'s Pick', featured: true, rating: 4.7, reviews: 389,
  }),
  P('electronics', 'Laptops', 'Creator Studio 16" — Ryzen 9', 12999900, {
    desc: '16" 4K OLED, Ryzen 9, 32GB, 1TB, RTX 4060. Creative professional.',
    tags: ['creator', '4k', 'workstation'],
    rating: 4.8,
  }),
  P('electronics', 'Audio', 'AuraPods Pro — ANC TWS', 699900, {
    desc: 'Active noise cancellation, spatial audio, 30hr battery with case.',
    tags: ['tws', 'anc', 'spatial-audio'],
    variants: [
      { id: 'ev4', type: 'color', value: 'Midnight', inStock: true },
      { id: 'ev5', type: 'color', value: 'Cloud', inStock: true },
    ],
    featured: true, rating: 4.5, reviews: 2103,
  }),
  P('electronics', 'Audio', 'BassWave Over-Ear Headphones', 499900, {
    desc: 'Premium over-ear with 40mm drivers, BT 5.3, 60hr playtime.',
    tags: ['over-ear', 'bluetooth', 'bass'],
  }),
  P('electronics', 'Audio', 'SoundPillar Bluetooth Speaker', 349900, {
    desc: '360° sound, IPX7 waterproof, 20hr battery. Party-ready.',
    tags: ['speaker', 'waterproof', 'portable'],
    rating: 4.3,
  }),
  P('electronics', 'Wearables', 'FitBand Ultra Smartwatch', 999900, {
    desc: '1.4" AMOLED, SpO2, GPS, 100+ sports, 14-day battery.',
    tags: ['smartwatch', 'fitness', 'gps'],
    badge: 'Popular', rating: 4.4,
  }),
  P('electronics', 'Accessories', 'GaN 65W USB-C Charger', 199900, {
    desc: 'Triple-port GaN charger. Charge laptop + phone simultaneously.',
    tags: ['charger', 'usb-c', 'gan'],
    rating: 4.7,
  }),
  P('electronics', 'Accessories', 'USB-C Hub 7-in-1', 249900, {
    desc: 'HDMI 4K + USB 3.0 ×2 + SD + microSD + PD 100W + Ethernet.',
    tags: ['hub', 'usb-c', 'dock'],
  }),
  P('electronics', 'Gaming', 'Vortex RGB Mechanical Keyboard', 449900, {
    desc: 'Hot-swappable switches, per-key RGB, gasket mount. Gaming & typing.',
    tags: ['keyboard', 'mechanical', 'rgb'],
    featured: true, rating: 4.8,
  }),
  P('electronics', 'Gaming', 'Precision X Gaming Mouse', 299900, {
    desc: '26K DPI optical sensor, 65g ultralight, PTFE feet.',
    tags: ['mouse', 'gaming', 'ultralight'],
  }),
];

// ===================== HOME =====================
const homeProducts = [
  P('home', 'Furniture', 'Zenith Ergonomic Office Chair', 1499900, {
    desc: 'Full mesh, adjustable lumbar, 4D armrests, 135° recline.',
    tags: ['chair', 'ergonomic', 'office'],
    badge: 'Best Seller', featured: true, rating: 4.7, reviews: 673,
  }),
  P('home', 'Furniture', 'Modular L-Shape Sofa — Charcoal', 3999900, {
    desc: 'Modular 3-seater with chaise. Removable covers, pocket springs.',
    tags: ['sofa', 'modular', 'living-room'],
    rating: 4.5,
  }),
  P('home', 'Furniture', 'Standing Desk — Electric', 2499900, {
    desc: 'Dual motor height-adjustable desk. 60×120cm bamboo top.',
    tags: ['desk', 'standing', 'electric'],
    featured: true, rating: 4.6,
  }),
  P('home', 'Decor', 'Geometric Wall Art Set (3 Pieces)', 249900, {
    desc: 'Metal geometric wall art in matte black. Modern minimalist.',
    tags: ['wall-art', 'metal', 'geometric'],
  }),
  P('home', 'Decor', 'Indoor Planter Set — Terracotta', 149900, {
    desc: 'Set of 4 terracotta planters with bamboo saucers.',
    tags: ['planter', 'terracotta', 'indoor'],
  }),
  P('home', 'Lighting', 'Arc Floor Lamp — Brass', 599900, {
    desc: 'Adjustable arc floor lamp in brushed brass with fabric shade.',
    tags: ['lamp', 'floor', 'brass'],
    featured: true,
  }),
  P('home', 'Lighting', 'Smart LED Strip — 5m RGBW', 199900, {
    desc: 'WiFi-enabled RGBW LED strip. 16M colors, music sync.',
    tags: ['led', 'smart', 'ambient'],
    rating: 4.3,
  }),
  P('home', 'Kitchen', 'Pour Over Coffee Set', 199900, {
    desc: 'V60 dripper + server + kettle + filters. Barista at home.',
    tags: ['coffee', 'pour-over', 'set'],
    badge: 'New',
  }),
  P('home', 'Kitchen', 'Cast Iron Dutch Oven 5.5L', 399900, {
    desc: 'Enameled cast iron. Oven-safe to 260°C. Lifetime warranty.',
    tags: ['dutch-oven', 'cast-iron', 'cooking'],
    rating: 4.8,
  }),
  P('home', 'Bedding', 'Bamboo Bed Sheet Set — King', 349900, {
    desc: '100% bamboo viscose. Thermoregulating, silky-soft. 400TC.',
    tags: ['sheets', 'bamboo', 'king'],
    originalPrice: 449900,
    badge: '22% Off',
  }),
  P('home', 'Storage', 'Modular Closet Organizer', 299900, {
    desc: 'Stackable steel and fabric closet system. Configurable.',
    tags: ['storage', 'closet', 'modular'],
  }),
];

// ===================== GROCERY =====================
const groceryProducts = [
  P('grocery', 'Fruits', 'Organic Alphonso Mangoes — 1kg', 49900, {
    desc: 'Premium Ratnagiri Alphonso mangoes. Naturally ripened.',
    tags: ['organic', 'mango', 'seasonal'],
    badge: 'Seasonal', featured: true, rating: 4.9, reviews: 1543,
  }),
  P('grocery', 'Fruits', 'Imported Blueberries — 125g', 34900, {
    desc: 'Fresh premium blueberries. Rich in antioxidants.',
    tags: ['berries', 'imported', 'antioxidant'],
  }),
  P('grocery', 'Fruits', 'Fresh Avocados — Pack of 4', 39900, {
    desc: 'Hass avocados at perfect ripeness. Ready to eat.',
    tags: ['avocado', 'healthy', 'fresh'],
  }),
  P('grocery', 'Vegetables', 'Organic Veggie Box — Weekly', 69900, {
    desc: 'Curated mix of 8-10 seasonal organic vegetables.',
    tags: ['organic', 'box', 'weekly'],
    badge: 'Popular', featured: true,
  }),
  P('grocery', 'Vegetables', 'Baby Spinach — 200g', 14900, {
    desc: 'Tender baby spinach leaves. Triple-washed and ready to use.',
    tags: ['spinach', 'greens', 'ready-to-eat'],
  }),
  P('grocery', 'Dairy', 'Greek Yogurt — Mixed Berry 400g', 19900, {
    desc: 'High-protein Greek yogurt with real mixed berry compote.',
    tags: ['yogurt', 'protein', 'berry'],
    rating: 4.4,
  }),
  P('grocery', 'Dairy', 'A2 Farm Fresh Milk — 1L', 9900, {
    desc: 'Single-origin A2 cow milk. No hormones, no additives.',
    tags: ['milk', 'a2', 'farm-fresh'],
  }),
  P('grocery', 'Snacks', 'Dark Chocolate Almond Clusters', 29900, {
    desc: '70% dark chocolate with roasted almonds and sea salt.',
    tags: ['chocolate', 'almonds', 'premium'],
    featured: true, rating: 4.7,
  }),
  P('grocery', 'Snacks', 'Multigrain Chips — Herb & Cheese', 14900, {
    desc: 'Baked multigrain chips. No artificial flavors.',
    tags: ['chips', 'multigrain', 'baked'],
  }),
  P('grocery', 'Beverages', 'Cold Brew Coffee — 330ml ×6', 59900, {
    desc: 'Ready-to-drink cold brew. Single origin, no sugar added.',
    tags: ['coffee', 'cold-brew', 'pack'],
    badge: 'New',
  }),
  P('grocery', 'Beverages', 'Kombucha — Ginger Lemon ×4', 39900, {
    desc: 'Probiotic kombucha with fresh ginger and lemon.',
    tags: ['kombucha', 'probiotic', 'ginger'],
  }),
  P('grocery', 'Staples', 'Organic Basmati Rice — 5kg', 79900, {
    desc: 'Extra-long grain aged basmati. Certified organic.',
    tags: ['rice', 'basmati', 'organic'],
  }),
  P('grocery', 'Staples', 'Extra Virgin Olive Oil — 1L', 89900, {
    desc: 'Cold-pressed EVOO from Mediterranean olives. First press.',
    tags: ['olive-oil', 'evoo', 'cooking'],
  }),
];

// ===================== KIDS =====================
const kidsProducts = [
  P('kids', 'Toys', 'Space Explorer Building Set — 500pc', 249900, {
    desc: 'Interlocking brick set with rocket, space station, and astronauts.',
    tags: ['building', 'space', 'stem'],
    badge: 'Top Rated', featured: true, rating: 4.9, reviews: 876,
  }),
  P('kids', 'Toys', 'Interactive Globe — AR Enabled', 349900, {
    desc: 'Smart globe with AR app. Learn geography, animals, and cultures.',
    tags: ['educational', 'ar', 'globe'],
    featured: true, rating: 4.7,
  }),
  P('kids', 'Toys', 'Wooden Train Set — 60pc', 199900, {
    desc: 'FSC-certified wooden train with tracks, bridges, and town.',
    tags: ['wooden', 'train', 'eco-friendly'],
  }),
  P('kids', 'Clothing', 'Dino Print Hoodie — Age 4-12', 99900, {
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
    desc: 'Layered tulle tutu dress in rainbow colors. Party-ready.',
    tags: ['dress', 'tutu', 'rainbow'],
    variants: [
      { id: 'kv5', type: 'age', value: '2-3Y', inStock: true },
      { id: 'kv6', type: 'age', value: '4-5Y', inStock: true },
      { id: 'kv7', type: 'age', value: '6-8Y', inStock: true },
    ],
  }),
  P('kids', 'Books', 'Illustrated Solar System Encyclopedia', 79900, {
    desc: 'Full-color illustrated guide to our solar system. Ages 6-14.',
    tags: ['book', 'space', 'illustrated'],
    featured: true,
  }),
  P('kids', 'Books', 'Bedtime Stories Collection — 50 Tales', 49900, {
    desc: 'Illustrated storybook with 50 tales from around the world.',
    tags: ['storybook', 'bedtime', 'collection'],
  }),
  P('kids', 'School', 'Smart Backpack — Glow Zipper', 149900, {
    desc: 'Ergonomic school backpack with reflective glow zippers and rain cover.',
    tags: ['backpack', 'school', 'reflective'],
    rating: 4.5,
  }),
  P('kids', 'School', 'Art Supply Kit — 120 Pieces', 99900, {
    desc: 'Complete art set: crayons, markers, colored pencils, watercolors.',
    tags: ['art', 'supplies', 'creative'],
  }),
  P('kids', 'Games', 'Strategy Board Game — Quest World', 199900, {
    desc: 'Family strategy game for 2-6 players. Ages 8+.',
    tags: ['board-game', 'strategy', 'family'],
    badge: 'Award Winner',
  }),
  P('kids', 'Baby', 'Organic Cotton Onesie Set — 3 Pack', 89900, {
    desc: 'GOTS-certified organic cotton onesies. Newborn to 12 months.',
    tags: ['onesie', 'organic', 'newborn'],
    variants: [
      { id: 'kv8', type: 'size', value: '0-3M', inStock: true },
      { id: 'kv9', type: 'size', value: '3-6M', inStock: true },
      { id: 'kv10', type: 'size', value: '6-12M', inStock: true },
    ],
  }),
  P('kids', 'Baby', 'Silicone Feeding Set — 5 Piece', 69900, {
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
