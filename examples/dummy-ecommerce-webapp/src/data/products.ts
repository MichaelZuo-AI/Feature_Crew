import { Product } from '@/types';

export const products: Product[] = [
  {
    id: "p001",
    brand: "Samsung",
    name: "Galaxy Buds3 Pro",
    image: "https://picsum.photos/seed/product1/400/400",
    price: 149000,
    original_price: 239000,
    discount_pct: 38,
    rocket_delivery: true,
    rating: 4.7,
    review_count: 2841,
    popularity_score: 97,
    description: "Experience premium sound with Samsung's latest Galaxy Buds3 Pro. Featuring adaptive noise cancellation, 360 Audio, and up to 30 hours of battery life with the charging case. IPX7 water resistance makes them perfect for workouts.",
    reviews: [
      { id: "r001a", reviewer: "Jordan M.", rating: 5, date: "2026-03-10", body: "Best earbuds I've ever owned. The noise cancellation is incredible and the sound quality rivals over-ear headphones." },
      { id: "r001b", reviewer: "Sora P.", rating: 4, date: "2026-03-05", body: "Great sound and comfortable fit. Battery life is impressive. Only wish the touch controls were a bit more responsive." },
      { id: "r001c", reviewer: "Chris L.", rating: 5, date: "2026-02-28", body: "Seamless integration with my Galaxy phone. The ambient sound mode is perfect for commuting in Seoul." }
    ],
    qa: [
      { id: "q001a", question: "Are these compatible with iPhone?", answer: "Yes, they work with any Bluetooth device, though some features like seamless switching are Samsung-exclusive.", date: "2026-03-01" },
      { id: "q001b", question: "How long does the battery last on a single charge?", answer: "About 6 hours with ANC on, 8 hours without. The case provides an additional 24 hours.", date: "2026-02-20" }
    ]
  },
  {
    id: "p002",
    brand: "GlowLab",
    name: "Premium Vitamin C Serum Set",
    image: "https://picsum.photos/seed/product2/400/400",
    price: 32900,
    original_price: 58000,
    discount_pct: 43,
    rocket_delivery: true,
    rating: 4.5,
    review_count: 5672,
    popularity_score: 94,
    description: "A powerful trio of Vitamin C serums for brightening, anti-aging, and hydration. Contains 15% L-Ascorbic Acid, Hyaluronic Acid, and Niacinamide. Dermatologist tested and suitable for all skin types.",
    reviews: [
      { id: "r002a", reviewer: "Mina K.", rating: 5, date: "2026-03-12", body: "My skin has never looked better! The brightening effect was visible after just two weeks of consistent use." },
      { id: "r002b", reviewer: "Hana Y.", rating: 4, date: "2026-03-08", body: "Love the texture and absorption. A little goes a long way. The packaging keeps the vitamin C fresh." },
      { id: "r002c", reviewer: "Lily W.", rating: 5, date: "2026-02-25", body: "Perfect gift set. All three serums work beautifully together. My dark spots have faded significantly." }
    ],
    qa: [
      { id: "q002a", question: "Can I use this with retinol?", answer: "We recommend using Vitamin C in the morning and retinol at night to avoid irritation.", date: "2026-03-02" },
      { id: "q002b", question: "What is the shelf life after opening?", answer: "Each serum should be used within 3 months of opening for maximum potency.", date: "2026-02-15" }
    ]
  },
  {
    id: "p003",
    brand: "Dyson",
    name: "Airwrap Multi-Styler Complete",
    image: "https://picsum.photos/seed/product3/400/400",
    price: 549000,
    original_price: 699000,
    discount_pct: 21,
    rocket_delivery: false,
    rating: 4.8,
    review_count: 1203,
    popularity_score: 92,
    description: "The Dyson Airwrap Multi-Styler uses the Coanda effect to curl, wave, smooth, and dry hair with no extreme heat. Includes six attachments for versatile styling. Re-engineered for enhanced performance.",
    reviews: [
      { id: "r003a", reviewer: "Yuna S.", rating: 5, date: "2026-03-11", body: "Worth every penny. My hair looks salon-quality every day and there's zero heat damage. The new attachments are game-changing." },
      { id: "r003b", reviewer: "Emma T.", rating: 5, date: "2026-03-06", body: "I was skeptical at the price point but this completely replaced my straightener, curling iron, and blow dryer." },
      { id: "r003c", reviewer: "Rachel H.", rating: 4, date: "2026-02-22", body: "Amazing product but takes some practice to master. Once you get the technique down, the results are stunning." }
    ],
    qa: [
      { id: "q003a", question: "Does this work on short hair?", answer: "Yes, the smoothing and drying attachments work great on short hair. The curling barrels are best for hair at least 10cm long.", date: "2026-03-03" },
      { id: "q003b", question: "What's the voltage?", answer: "220V, designed for Korean outlets. No adapter needed.", date: "2026-02-18" }
    ]
  },
  {
    id: "p004",
    brand: "HarvestField",
    name: "Organic Short Grain Rice 10kg",
    image: "https://picsum.photos/seed/product4/400/400",
    price: 34900,
    original_price: 34900,
    discount_pct: 0,
    rocket_delivery: true,
    rating: 4.9,
    review_count: 12450,
    popularity_score: 99,
    description: "Premium organic short grain rice harvested from Icheon, Gyeonggi-do. Certified pesticide-free with a naturally sweet flavor and perfect sticky texture. Ideal for everyday Korean meals.",
    reviews: [
      { id: "r004a", reviewer: "Daniel K.", rating: 5, date: "2026-03-14", body: "The best rice I've found online. Perfect stickiness and flavor every time. My family goes through a bag a month." },
      { id: "r004b", reviewer: "Jiwon L.", rating: 5, date: "2026-03-09", body: "Icheon rice never disappoints. Great quality and the rocket delivery means I never run out." },
      { id: "r004c", reviewer: "Sunhee P.", rating: 5, date: "2026-03-01", body: "Switched from the supermarket brand and the difference is incredible. Worth the premium for organic." }
    ],
    qa: [
      { id: "q004a", question: "When was this harvested?", answer: "This batch is from the Fall 2025 harvest. We rotate stock to ensure freshness.", date: "2026-03-05" },
      { id: "q004b", question: "Is the packaging resealable?", answer: "Yes, it comes with a zip-lock seal to keep the rice fresh after opening.", date: "2026-02-28" }
    ]
  },
  {
    id: "p005",
    brand: "TechVault",
    name: "Ultra-Slim Pro Tablet 11\"",
    image: "https://picsum.photos/seed/product5/400/400",
    price: 494450,
    original_price: 899000,
    discount_pct: 45,
    rocket_delivery: true,
    rating: 4.6,
    review_count: 876,
    popularity_score: 88,
    description: "An 11-inch AMOLED tablet with 120Hz refresh rate, 256GB storage, and an octa-core processor. Perfect for streaming, note-taking, and light productivity. Includes S-Pen support and DeX mode.",
    reviews: [
      { id: "r005a", reviewer: "Mark J.", rating: 5, date: "2026-03-13", body: "Incredible value at this sale price. The display is gorgeous for watching content and the S-Pen is super responsive." },
      { id: "r005b", reviewer: "Eunji C.", rating: 4, date: "2026-03-07", body: "Great for studying and taking notes. Battery easily lasts a full day. Wish it had more RAM though." },
      { id: "r005c", reviewer: "Tom R.", rating: 5, date: "2026-02-26", body: "Replaced my old iPad with this and couldn't be happier. DeX mode is actually useful for productivity." }
    ],
    qa: [
      { id: "q005a", question: "Does it come with the S-Pen?", answer: "Yes, the S-Pen is included in the box along with a USB-C cable and adapter.", date: "2026-03-04" },
      { id: "q005b", question: "Can it run desktop apps in DeX mode?", answer: "DeX provides a desktop-like interface for Android apps. It does not run Windows or Mac desktop applications.", date: "2026-02-21" }
    ]
  },
  {
    id: "p006",
    brand: "AudioPeak",
    name: "Noise-Cancelling Headphones WH-900",
    image: "https://picsum.photos/seed/product6/400/400",
    price: 209300,
    original_price: 299000,
    discount_pct: 30,
    rocket_delivery: false,
    rating: 4.4,
    review_count: 3215,
    popularity_score: 85,
    description: "Over-ear wireless headphones with industry-leading noise cancellation. Features 40mm custom drivers, multipoint connection, and 35-hour battery life. Foldable design with premium carrying case.",
    reviews: [
      { id: "r006a", reviewer: "Jason B.", rating: 5, date: "2026-03-10", body: "The noise cancellation on these is absolutely top-tier. I use them daily on the subway and can't hear a thing." },
      { id: "r006b", reviewer: "Mirae K.", rating: 4, date: "2026-03-04", body: "Comfortable for long listening sessions. Sound is warm and detailed. Multipoint connection works flawlessly." },
      { id: "r006c", reviewer: "David S.", rating: 4, date: "2026-02-27", body: "Great headphones for the price. Not quite Sony or Bose level but very close. The carrying case is a nice touch." }
    ],
    qa: [
      { id: "q006a", question: "Can I use these wired?", answer: "Yes, a 3.5mm audio cable is included for wired listening when the battery is low.", date: "2026-03-01" },
      { id: "q006b", question: "Do these have a microphone for calls?", answer: "Yes, built-in beam-forming microphones with AI noise reduction for crystal-clear calls.", date: "2026-02-19" }
    ]
  },
  {
    id: "p007",
    brand: "Nike",
    name: "Air Zoom Pegasus 43 Running Shoes",
    image: "https://picsum.photos/seed/product7/400/400",
    price: 109000,
    original_price: 149000,
    discount_pct: 27,
    rocket_delivery: true,
    rating: 4.6,
    review_count: 4521,
    popularity_score: 93,
    description: "The iconic Pegasus returns with responsive ZoomX foam, a breathable Flyknit upper, and a wider forefoot for enhanced comfort. Perfect for daily training runs and casual wear.",
    reviews: [
      { id: "r007a", reviewer: "Hyunwoo K.", rating: 5, date: "2026-03-15", body: "My go-to running shoe. The cushioning is perfect for my daily 10K along the Han River." },
      { id: "r007b", reviewer: "Sarah M.", rating: 4, date: "2026-03-08", body: "True to size and incredibly comfortable right out of the box. Great color options too." },
      { id: "r007c", reviewer: "James P.", rating: 5, date: "2026-03-02", body: "I've been running in Pegasus shoes for years and this is the best version yet. The wider toe box is a welcome change." }
    ],
    qa: [
      { id: "q007a", question: "Do these run true to size?", answer: "Yes, most customers find they fit true to size. If you have wide feet, consider going half a size up.", date: "2026-03-06" },
      { id: "q007b", question: "Are these good for marathon training?", answer: "They're excellent for daily training. For race day, you might want a lighter racing shoe, but these handle high mileage well.", date: "2026-02-24" }
    ]
  },
  {
    id: "p008",
    brand: "BrewMaster",
    name: "Precision Pour-Over Coffee Maker Set",
    image: "https://picsum.photos/seed/product8/400/400",
    price: 45900,
    original_price: 59000,
    discount_pct: 22,
    rocket_delivery: true,
    rating: 4.8,
    review_count: 1890,
    popularity_score: 86,
    description: "Complete pour-over coffee set including a borosilicate glass server, stainless steel dripper, reusable filter, precision gooseneck kettle, and digital scale with timer. Makes 1-4 cups of perfectly brewed coffee.",
    reviews: [
      { id: "r008a", reviewer: "Jihye L.", rating: 5, date: "2026-03-12", body: "Everything you need to start pour-over brewing in one box. The gooseneck kettle alone is worth the price." },
      { id: "r008b", reviewer: "Ryan C.", rating: 5, date: "2026-03-05", body: "Upgraded from a French press and the difference is remarkable. Coffee tastes cleaner and more nuanced." },
      { id: "r008c", reviewer: "Nari K.", rating: 4, date: "2026-02-28", body: "Beautiful set that looks great on the counter. The reusable filter is eco-friendly and produces a great cup." }
    ],
    qa: [
      { id: "q008a", question: "Is the kettle electric?", answer: "No, the included kettle is stovetop. We offer an electric version as a separate upgrade.", date: "2026-03-03" },
      { id: "q008b", question: "What grind size should I use?", answer: "Medium-fine grind, similar to table salt consistency. We recommend freshly ground beans for best results.", date: "2026-02-17" }
    ]
  },
  {
    id: "p009",
    brand: "CleanBot",
    name: "Smart Robot Vacuum & Mop X1",
    image: "https://picsum.photos/seed/product9/400/400",
    price: 389000,
    original_price: 599000,
    discount_pct: 35,
    rocket_delivery: true,
    rating: 4.5,
    review_count: 2134,
    popularity_score: 90,
    description: "AI-powered robot vacuum and mop with LiDAR navigation, 5000Pa suction, and auto-empty station. Maps your home in real-time, avoids obstacles, and handles both hard floors and carpets with ease.",
    reviews: [
      { id: "r009a", reviewer: "Minjun P.", rating: 5, date: "2026-03-14", body: "This thing is incredibly smart. It mapped my apartment perfectly on the first run and avoids all furniture." },
      { id: "r009b", reviewer: "Grace H.", rating: 4, date: "2026-03-09", body: "The mopping function works better than expected. Not a replacement for deep cleaning but great for daily maintenance." },
      { id: "r009c", reviewer: "Kevin O.", rating: 5, date: "2026-03-01", body: "The auto-empty station is a game changer. I only need to empty it once a month. Set it and forget it." }
    ],
    qa: [
      { id: "q009a", question: "How loud is it during operation?", answer: "About 65dB on standard mode, comparable to a normal conversation. Quiet mode drops to around 55dB.", date: "2026-03-07" },
      { id: "q009b", question: "Can it handle thick carpet?", answer: "It handles low to medium pile carpet well and automatically increases suction. Very thick shag carpet may cause issues.", date: "2026-02-23" }
    ]
  },
  {
    id: "p010",
    brand: "NordFit",
    name: "Adjustable Dumbbell Set 2-24kg",
    image: "https://picsum.photos/seed/product10/400/400",
    price: 179000,
    original_price: 249000,
    discount_pct: 28,
    rocket_delivery: false,
    rating: 4.7,
    review_count: 967,
    popularity_score: 82,
    description: "Space-saving adjustable dumbbells that replace 15 pairs of weights. Quick-turn dial system lets you switch between 2kg and 24kg in seconds. Ergonomic grip with anti-slip coating.",
    reviews: [
      { id: "r010a", reviewer: "Taehyung L.", rating: 5, date: "2026-03-11", body: "Perfect for my small apartment gym. The weight change mechanism is smooth and reliable. Replaced an entire rack." },
      { id: "r010b", reviewer: "Alex W.", rating: 4, date: "2026-03-06", body: "Great build quality and the 2kg increments are useful for progressive overload. A bit bulky at the lighter weights." },
      { id: "r010c", reviewer: "Soyeon J.", rating: 5, date: "2026-02-25", body: "Best home gym investment I've made. The anti-slip grip is comfortable even during sweaty workouts." }
    ],
    qa: [
      { id: "q010a", question: "What are the weight increments?", answer: "2kg increments from 2kg to 24kg per dumbbell (2, 4, 6, 8... 24kg).", date: "2026-03-04" },
      { id: "q010b", question: "Is a stand included?", answer: "No, the stand is sold separately. The dumbbells can be placed on any flat surface.", date: "2026-02-20" }
    ]
  },
  {
    id: "p011",
    brand: "LumiHome",
    name: "Smart LED Strip Lights 10m",
    image: "https://picsum.photos/seed/product11/400/400",
    price: 24900,
    original_price: 39900,
    discount_pct: 38,
    rocket_delivery: true,
    rating: 4.3,
    review_count: 6234,
    popularity_score: 87,
    description: "RGBIC LED strip lights with music sync, 16 million colors, and app control. Works with Alexa and Google Home. Adhesive backing for easy installation. Segmented color control for dynamic effects.",
    reviews: [
      { id: "r011a", reviewer: "Woojin H.", rating: 5, date: "2026-03-13", body: "Transformed my room completely. The music sync feature is incredible for parties and the app is intuitive." },
      { id: "r011b", reviewer: "Stella C.", rating: 4, date: "2026-03-07", body: "Colors are vibrant and the adhesive holds well. Wish the app had more preset scenes but you can create custom ones." },
      { id: "r011c", reviewer: "Nathan R.", rating: 4, date: "2026-02-27", body: "Easy to set up and the voice control with Alexa works perfectly. Good value for 10 meters." }
    ],
    qa: [
      { id: "q011a", question: "Can these be cut to a shorter length?", answer: "Yes, they can be cut at marked intervals every 10cm without affecting the rest of the strip.", date: "2026-03-02" },
      { id: "q011b", question: "Are these waterproof?", answer: "These are IP44 rated — splash-resistant but not suitable for outdoor use or submersion.", date: "2026-02-16" }
    ]
  },
  {
    id: "p012",
    brand: "PureAir",
    name: "HEPA Air Purifier for Large Rooms",
    image: "https://picsum.photos/seed/product12/400/400",
    price: 189000,
    original_price: 289000,
    discount_pct: 35,
    rocket_delivery: true,
    rating: 4.6,
    review_count: 3450,
    popularity_score: 91,
    description: "True HEPA H13 air purifier covering up to 60 sqm. Removes 99.97% of particles, allergens, and fine dust (PM2.5). Real-time air quality display, auto mode, sleep mode, and filter life indicator.",
    reviews: [
      { id: "r012a", reviewer: "Soojin K.", rating: 5, date: "2026-03-15", body: "Essential during fine dust season in Seoul. The air quality sensor is accurate and auto mode adjusts perfectly." },
      { id: "r012b", reviewer: "Mike D.", rating: 4, date: "2026-03-10", body: "Noticeably cleaner air in my apartment. My allergies have improved significantly since using this daily." },
      { id: "r012c", reviewer: "Yeri L.", rating: 5, date: "2026-03-03", body: "Quiet enough for the bedroom on sleep mode. The real-time PM2.5 display is reassuring." }
    ],
    qa: [
      { id: "q012a", question: "How often do filters need replacing?", answer: "The HEPA filter lasts approximately 12 months with daily use. The pre-filter is washable and reusable.", date: "2026-03-05" },
      { id: "q012b", question: "What's the noise level on the lowest setting?", answer: "About 25dB on sleep mode — virtually silent. Standard mode is around 45dB.", date: "2026-02-22" }
    ]
  },
  {
    id: "p013",
    brand: "AquaFlask",
    name: "Insulated Water Bottle 750ml",
    image: "https://picsum.photos/seed/product13/400/400",
    price: 29800,
    original_price: 29800,
    discount_pct: 0,
    rocket_delivery: true,
    rating: 4.8,
    review_count: 8921,
    popularity_score: 95,
    description: "Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid with one-hand operation. Available in 12 colors.",
    reviews: [
      { id: "r013a", reviewer: "Jimin A.", rating: 5, date: "2026-03-14", body: "Ice was still in my bottle after a full day at the office. Best water bottle I've owned. The matte finish is gorgeous." },
      { id: "r013b", reviewer: "Olivia N.", rating: 5, date: "2026-03-08", body: "Love the one-hand lid. Perfect size for my bag and it never leaks. Bought three more for the family." },
      { id: "r013c", reviewer: "Seungho B.", rating: 4, date: "2026-03-02", body: "Excellent insulation and build quality. Only complaint is the lid can be a bit stiff when new. Loosens up after a week." }
    ],
    qa: [
      { id: "q013a", question: "Is this dishwasher safe?", answer: "We recommend hand washing to preserve the powder-coated finish and vacuum seal longevity.", date: "2026-03-06" },
      { id: "q013b", question: "Does it fit in standard cup holders?", answer: "Yes, the 750ml size (7.5cm diameter) fits standard car and bike cup holders.", date: "2026-02-25" }
    ]
  },
  {
    id: "p014",
    brand: "PageTurn",
    name: "E-Reader Pro 7\" 32GB",
    image: "https://picsum.photos/seed/product14/400/400",
    price: 159000,
    original_price: 199000,
    discount_pct: 20,
    rocket_delivery: false,
    rating: 4.7,
    review_count: 1567,
    popularity_score: 84,
    description: "A 7-inch e-ink reader with 300 PPI display, adjustable warm light, and waterproof IPX8 design. 32GB storage holds thousands of books. Weeks of battery life on a single charge.",
    reviews: [
      { id: "r014a", reviewer: "Hayoung M.", rating: 5, date: "2026-03-12", body: "Reading before bed is so much better with the warm light feature. No more eye strain. Battery lasts forever." },
      { id: "r014b", reviewer: "Brandon K.", rating: 5, date: "2026-03-05", body: "Took this to the beach and even the pool — waterproof and glare-free in direct sunlight. Amazing." },
      { id: "r014c", reviewer: "Dahyun S.", rating: 4, date: "2026-02-26", body: "Great device for Korean and English books. Page turns could be slightly faster but overall very satisfied." }
    ],
    qa: [
      { id: "q014a", question: "Does it support Korean ebooks?", answer: "Yes, it supports EPUB, PDF, and all major Korean ebook platforms including Ridi and Millie.", date: "2026-03-04" },
      { id: "q014b", question: "Can I listen to audiobooks on this?", answer: "Yes, it has Bluetooth for connecting wireless headphones and supports Audible and other audiobook apps.", date: "2026-02-19" }
    ]
  },
  {
    id: "p015",
    brand: "FreshBox",
    name: "Korean Meal Kit Subscription Box (5 meals)",
    image: "https://picsum.photos/seed/product15/400/400",
    price: 39900,
    original_price: 55000,
    discount_pct: 27,
    rocket_delivery: true,
    rating: 4.4,
    review_count: 2345,
    popularity_score: 83,
    description: "Weekly meal kit with 5 authentic Korean recipes. Pre-portioned fresh ingredients with step-by-step recipe cards. Includes classics like bulgogi, kimchi jjigae, and bibimbap. Serves 2 per meal.",
    reviews: [
      { id: "r015a", reviewer: "Anna T.", rating: 5, date: "2026-03-13", body: "As an expat, this is the best way to learn Korean cooking. Ingredients are always fresh and recipes are foolproof." },
      { id: "r015b", reviewer: "Donghyuk P.", rating: 4, date: "2026-03-07", body: "Convenient and delicious. The portions are generous for two people. Some weeks are better than others but overall great." },
      { id: "r015c", reviewer: "Lucy F.", rating: 4, date: "2026-02-28", body: "Love the variety each week. The recipe cards have English and Korean instructions which is super helpful." }
    ],
    qa: [
      { id: "q015a", question: "Can I skip a week?", answer: "Yes, you can skip or pause your subscription anytime through the app, up to 2 days before delivery.", date: "2026-03-05" },
      { id: "q015b", question: "Are there vegetarian options?", answer: "Yes, we offer a vegetarian plan that substitutes meat with tofu and plant-based proteins in all recipes.", date: "2026-02-21" }
    ]
  },
  {
    id: "p016",
    brand: "CozyNest",
    name: "Memory Foam Mattress Topper Queen",
    image: "https://picsum.photos/seed/product16/400/400",
    price: 89000,
    original_price: 149000,
    discount_pct: 40,
    rocket_delivery: true,
    rating: 4.5,
    review_count: 4123,
    popularity_score: 89,
    description: "7cm thick gel-infused memory foam mattress topper. Temperature-regulating gel beads keep you cool all night. CertiPUR-US certified foam. Includes a machine-washable bamboo cover with anti-slip dots.",
    reviews: [
      { id: "r016a", reviewer: "Inhyuk J.", rating: 5, date: "2026-03-14", body: "Completely transformed my old mattress. I'm sleeping so much better and the cooling gel actually works." },
      { id: "r016b", reviewer: "Sophie M.", rating: 4, date: "2026-03-09", body: "Very comfortable and the bamboo cover is soft. Took a couple of nights to fully expand but worth the wait." },
      { id: "r016c", reviewer: "Junho K.", rating: 5, date: "2026-03-03", body: "Best value upgrade for sleep quality. The anti-slip dots keep it in place perfectly. No more sliding around." }
    ],
    qa: [
      { id: "q016a", question: "Does it have an odor when new?", answer: "There may be a slight foam smell initially. We recommend airing it out for 24-48 hours before use.", date: "2026-03-06" },
      { id: "q016b", question: "Will this fit a Korean Queen size bed?", answer: "Yes, our Queen size (150x200cm) fits standard Korean Queen frames perfectly.", date: "2026-02-23" }
    ]
  },
  {
    id: "p017",
    brand: "SnapGear",
    name: "4K Action Camera Waterproof Bundle",
    image: "https://picsum.photos/seed/product17/400/400",
    price: 129000,
    original_price: 199000,
    discount_pct: 35,
    rocket_delivery: false,
    rating: 4.3,
    review_count: 1834,
    popularity_score: 79,
    description: "Compact 4K/60fps action camera with electronic image stabilization. Waterproof to 10m without a case. Bundle includes chest mount, head strap, floating grip, 64GB microSD, and extra battery.",
    reviews: [
      { id: "r017a", reviewer: "Yongjun S.", rating: 4, date: "2026-03-11", body: "Great value bundle with everything you need to start. 4K footage is sharp and stabilization handles hiking well." },
      { id: "r017b", reviewer: "Chris A.", rating: 5, date: "2026-03-04", body: "Used this for snorkeling in Jeju and the underwater footage was stunning. Easy to use and the mounts are solid." },
      { id: "r017c", reviewer: "Haerin W.", rating: 4, date: "2026-02-24", body: "Good camera for the price. Low-light performance could be better but daytime footage is excellent." }
    ],
    qa: [
      { id: "q017a", question: "How long does the battery last recording 4K?", answer: "About 80 minutes of continuous 4K/60fps recording. The extra battery doubles this.", date: "2026-03-02" },
      { id: "q017b", question: "Does it have a front-facing screen?", answer: "Yes, there's a 1.4-inch front display for selfie framing and a 2-inch rear touchscreen.", date: "2026-02-18" }
    ]
  },
  {
    id: "p018",
    brand: "LeafGreen",
    name: "Indoor Smart Garden Starter Kit",
    image: "https://picsum.photos/seed/product18/400/400",
    price: 69000,
    original_price: 89000,
    discount_pct: 22,
    rocket_delivery: true,
    rating: 4.6,
    review_count: 1245,
    popularity_score: 81,
    description: "Automated indoor garden system with full-spectrum LED grow lights, self-watering reservoir, and app-controlled nutrient dosing. Grows up to 9 plants simultaneously. Includes 3 herb seed pods (basil, mint, cilantro).",
    reviews: [
      { id: "r018a", reviewer: "Yejin C.", rating: 5, date: "2026-03-12", body: "Fresh herbs in my apartment year-round! The basil grew in just 2 weeks. The app notifications are helpful." },
      { id: "r018b", reviewer: "Patrick O.", rating: 4, date: "2026-03-06", body: "Great concept and execution. The LED light is bright but has a timer so it's not annoying at night." },
      { id: "r018c", reviewer: "Subin M.", rating: 5, date: "2026-02-26", body: "Perfect for my Seoul apartment with limited sunlight. Already ordered extra seed pods for lettuce and cherry tomatoes." }
    ],
    qa: [
      { id: "q018a", question: "How often do I need to add water?", answer: "The 4L reservoir lasts about 2-3 weeks depending on plant growth. The app alerts you when water is low.", date: "2026-03-03" },
      { id: "q018b", question: "Can I use my own seeds?", answer: "Yes, blank seed pods are available for purchase. You can grow any small herb, lettuce, or flower variety.", date: "2026-02-20" }
    ]
  },
  {
    id: "p019",
    brand: "UrbanCarry",
    name: "Anti-Theft Laptop Backpack 15.6\"",
    image: "https://picsum.photos/seed/product19/400/400",
    price: 54900,
    original_price: 79000,
    discount_pct: 31,
    rocket_delivery: true,
    rating: 4.4,
    review_count: 5678,
    popularity_score: 88,
    description: "Sleek urban backpack with hidden zippers, RFID-blocking pocket, and USB charging port. Padded 15.6\" laptop compartment with shock-absorbing base. Water-resistant fabric with reflective accents.",
    reviews: [
      { id: "r019a", reviewer: "Sungmin Y.", rating: 5, date: "2026-03-15", body: "Love the hidden zipper design. Feels secure on crowded subway commutes. The USB port is super convenient." },
      { id: "r019b", reviewer: "Maria G.", rating: 4, date: "2026-03-08", body: "Sleek look that works for both office and casual. Laptop compartment fits my 15-inch MacBook perfectly." },
      { id: "r019c", reviewer: "Doojin H.", rating: 4, date: "2026-03-01", body: "Good quality for the price. The water-resistant fabric handled a rainy commute without any leaks." }
    ],
    qa: [
      { id: "q019a", question: "Does the USB port include a power bank?", answer: "No, the USB port is a pass-through. You connect your own power bank inside the bag to the internal cable.", date: "2026-03-05" },
      { id: "q019b", question: "What's the total capacity in liters?", answer: "The backpack is 25 liters with an expandable section that adds 5 more liters when needed.", date: "2026-02-22" }
    ]
  },
  {
    id: "p020",
    brand: "SkinFirst",
    name: "Centella Recovery Sheet Masks (30 Pack)",
    image: "https://picsum.photos/seed/product20/400/400",
    price: 18900,
    original_price: 35000,
    discount_pct: 46,
    rocket_delivery: true,
    rating: 4.5,
    review_count: 9876,
    popularity_score: 96,
    description: "Ultra-thin tencel sheet masks infused with Centella Asiatica extract and Panthenol for calming and repairing sensitive skin. Dermatologist tested, fragrance-free, and suitable for daily use. 30 individually sealed masks.",
    reviews: [
      { id: "r020a", reviewer: "Chaeyoung K.", rating: 5, date: "2026-03-14", body: "My holy grail sheet mask. The Centella formula calms my redness overnight. Can't beat the price for 30 masks." },
      { id: "r020b", reviewer: "Emily R.", rating: 4, date: "2026-03-09", body: "Thin fit that adheres well to the face. Very hydrating and no irritation on my sensitive skin." },
      { id: "r020c", reviewer: "Jisoo P.", rating: 5, date: "2026-03-02", body: "Stocking up on these! Great for daily use and the individual packaging keeps each mask perfectly moist." }
    ],
    qa: [
      { id: "q020a", question: "How long should I leave the mask on?", answer: "15-20 minutes is recommended. Do not leave on until dry as it can draw moisture from your skin.", date: "2026-03-07" },
      { id: "q020b", question: "Is this suitable for acne-prone skin?", answer: "Yes, Centella Asiatica is known for its anti-inflammatory properties and is great for acne-prone and irritated skin.", date: "2026-02-24" }
    ]
  }
];
