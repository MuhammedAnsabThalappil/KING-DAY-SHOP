import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KING DAY database seeding...');

  // Clean existing records
  await prisma.productFeature.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const hashedPassword = await bcrypt.hash('ADMIN123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@kingday.store',
      password: hashedPassword,
      name: 'KING DAY Admin',
      role: 'ADMIN',
    },
  });
  console.log(`👤 Admin created: ${adminUser.email}`);

  // Create Categories
  const categories = [
    {
      name: 'Kids Ride-On',
      slug: 'kids-ride-on',
      description: 'Battery operated electric cars, jeeps, sports cars, and bikes for kids.',
      image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800',
      displayOrder: 1,
      active: true,
    },
    {
      name: 'Kids Toys',
      slug: 'kids-toys',
      description: 'Educational toys, remote control cars, action sets, and interactive play kits.',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=800',
      displayOrder: 2,
      active: true,
    },
    {
      name: 'Cycles',
      slug: 'cycles',
      description: 'Tricycles, balance bikes, training cycles, and premium bicycles for young riders.',
      image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=800',
      displayOrder: 3,
      active: true,
    },
    {
      name: 'Baby Accessories',
      slug: 'baby-accessories',
      description: 'Strollers, prams, high chairs, walkers, and daily baby care products.',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800',
      displayOrder: 4,
      active: true,
    },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categories) {
    const createdCat = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = createdCat;
    console.log(`📁 Category created: ${createdCat.name}`);
  }

  // Create Products
  const productsData = [
    // Kids Ride-On
    {
      name: 'Mercedes Benz Style 12V Electric Ride-On Car',
      slug: 'mercedes-benz-style-12v-electric-ride-on-car',
      sku: 'KDO-E01-MBZ',
      description: 'Luxury battery-operated electric ride-on car with dual motors, Bluetooth music player, LED headlights, and parental remote control. Smooth suspension for outdoor and indoor fun.',
      mrp: 18999,
      salePrice: 12499,
      stockQuantity: 8,
      categoryId: createdCategories['kids-ride-on'].id,
      featured: true,
      active: true,
      age: '2 - 6 Years',
      capacity: 'Up to 35 kg',
      seoTitle: 'Buy Mercedes Style 12V Kids Electric Car | KING DAY',
      seoDescription: 'Premium 12V battery operated ride-on car with parental remote control, LED lights, and sound system. WhatsApp ordering available.',
      images: [
        { url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=1000', alt: 'Mercedes Style Electric Car Front', isPrimary: true, displayOrder: 1 },
        { url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000', alt: 'Mercedes Style Electric Side View', isPrimary: false, displayOrder: 2 },
      ],
      features: [
        '2.4G Bluetooth Remote Control & Manual Driving',
        '12V Rechargeable Battery with Dual Motors',
        'Built-in MP3 Music Player & USB Port',
        'LED Headlights, Rear Lights & Horn Sounds',
        'Safety Belt & Shock Absorption Wheels',
      ],
      specifications: [
        { key: 'Battery', value: '12V 7AH Rechargeable' },
        { key: 'Motor', value: '2 x 35W Dual Drive' },
        { key: 'Speed', value: '3 - 6 km/h' },
        { key: 'Charging Time', value: '8 - 10 Hours' },
        { key: 'Run Time', value: '60 - 90 Minutes' },
      ],
    },
    {
      name: 'Super Off-Road 4x4 Heavy Duty Electric Jeep',
      slug: 'super-off-road-4x4-heavy-duty-electric-jeep',
      sku: 'KDO-E02-JEP',
      description: 'Monster 4x4 quad-motor electric jeep for kids. High ground clearance, heavy duty suspension, leather finish dual seats, and rugged wheels for all terrains.',
      mrp: 24999,
      salePrice: 16999,
      stockQuantity: 5,
      categoryId: createdCategories['kids-ride-on'].id,
      featured: true,
      active: true,
      age: '3 - 8 Years',
      capacity: 'Up to 50 kg',
      seoTitle: 'Super 4x4 Kids Ride-On Jeep | KING DAY',
      seoDescription: 'Heavy-duty 4x4 kids electric jeep with 4 motors, dual seats, and remote control.',
      images: [
        { url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000', alt: '4x4 Electric Jeep', isPrimary: true, displayOrder: 1 },
      ],
      features: [
        '4-Motor 4WD Drive System',
        'Parent Remote Control Override',
        'Dual Leather Padded Seats',
        'All-Terrain Shock-Absorbing Tires',
      ],
      specifications: [
        { key: 'Battery', value: '12V 10AH High Capacity' },
        { key: 'Motor', value: '4 x 45W Motors' },
        { key: 'Weight Capacity', value: '50 kg' },
      ],
    },
    {
      name: 'BMW Style Sport Rechargeable Electric Motorbike',
      slug: 'bmw-style-sport-rechargeable-electric-motorbike',
      sku: 'KDO-E03-BIK',
      description: 'Futuristic electric sports motorcycle for kids with training wheels, foot accelerator, key start ignition, and vibrant LED wheel lights.',
      mrp: 14999,
      salePrice: 9499,
      stockQuantity: 12,
      categoryId: createdCategories['kids-ride-on'].id,
      featured: false,
      active: true,
      age: '2 - 5 Years',
      capacity: 'Up to 30 kg',
      seoTitle: 'Kids Electric Sports Bike | KING DAY',
      seoDescription: 'Rechargeable electric sports motorbike for toddlers with support wheels and key ignition.',
      images: [
        { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1000', alt: 'Electric Sports Bike', isPrimary: true, displayOrder: 1 },
      ],
      features: [
        'Key Start Engine Sound',
        'Sturdy Support Training Wheels',
        'Foot Pedal Accelerator & Hand Brake',
        'Vibrant LED Lighting Effects',
      ],
      specifications: [
        { key: 'Battery', value: '12V 4.5AH' },
        { key: 'Speed', value: '3-5 km/h' },
      ],
    },

    // Kids Toys
    {
      name: 'High-Speed RC Monster Truck 1:12 Rock Crawler',
      slug: 'high-speed-rc-monster-truck-112-rock-crawler',
      sku: 'KDT-T01-RC',
      description: 'Full-proportional remote control 4WD rock crawler with independent suspension springs, anti-skid rubber tires, and rechargeable USB battery.',
      mrp: 3999,
      salePrice: 2499,
      stockQuantity: 15,
      categoryId: createdCategories['kids-toys'].id,
      featured: true,
      active: true,
      age: '6+ Years',
      capacity: 'N/A',
      seoTitle: 'Remote Control 4WD Monster Truck | KING DAY',
      seoDescription: 'High-speed RC rock crawler with alloy body and 2.4GHz long-range controller.',
      images: [
        { url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=1000', alt: 'RC Monster Truck', isPrimary: true, displayOrder: 1 },
      ],
      features: [
        '2.4GHz Interference-Free Controller',
        'All-Terrain Alloy Body Shell',
        'Rechargeable Li-ion Battery Included',
        'High-Torque Climbing Capability',
      ],
      specifications: [
        { key: 'Control Distance', value: '50 Meters' },
        { key: 'Play Time', value: '25 Minutes per charge' },
      ],
    },
    {
      name: '120-Piece Magnetic Building Blocks Educational Set',
      slug: '120-piece-magnetic-building-blocks-educational-set',
      sku: 'KDT-T02-MAG',
      description: 'STEM certified magnetic 3D building tile set promoting spatial intelligence, creativity, and motor skills in children.',
      mrp: 2999,
      salePrice: 1899,
      stockQuantity: 20,
      categoryId: createdCategories['kids-toys'].id,
      featured: false,
      active: true,
      age: '3+ Years',
      capacity: 'N/A',
      seoTitle: 'STEM Magnetic Building Blocks Set | KING DAY',
      seoDescription: 'Safe non-toxic magnetic building tiles for creative toddlers and kids.',
      images: [
        { url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1000', alt: 'Magnetic Blocks', isPrimary: true, displayOrder: 1 },
      ],
      features: [
        '120 Vibrant Geometric Magnetic Pieces',
        'BPA-Free Non-Toxic ABS Plastic',
        'Smooth Rounded Edge Safety Design',
        'Includes Storage Bag & Design Booklet',
      ],
      specifications: [
        { key: 'Material', value: 'Food-grade ABS + Neodymium Magnets' },
        { key: 'Pieces', value: '120 Tiles' },
      ],
    },

    // Cycles
    {
      name: 'Speedster 16-Inch Kids Bicycle with Training Wheels',
      slug: 'speedster-16-inch-kids-bicycle-with-training-wheels',
      sku: 'KDC-C01-16',
      description: 'Ergonomically designed steel frame bicycle equipped with heavy-duty training wheels, front basket, enclosed chain guard, and dual calliper brakes.',
      mrp: 7499,
      salePrice: 4999,
      stockQuantity: 10,
      categoryId: createdCategories['cycles'].id,
      featured: true,
      active: true,
      age: '4 - 7 Years',
      capacity: 'Up to 40 kg',
      seoTitle: 'Speedster 16-Inch Kids Cycle with Training Wheels | KING DAY',
      seoDescription: 'Durable and safe 16-inch kids cycle with front basket and training wheels.',
      images: [
        { url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=1000', alt: '16 Inch Kids Bicycle', isPrimary: true, displayOrder: 1 },
      ],
      features: [
        'Rugged Hi-Ten Steel Frame',
        'Detachable Heavy Duty Support Wheels',
        'Full Coverage Protective Chain Guard',
        'Adjustable Quick-Release Saddle',
      ],
      specifications: [
        { key: 'Wheel Size', value: '16 Inches' },
        { key: 'Brakes', value: 'Front Caliper & Rear Coaster/V-Brake' },
      ],
    },
    {
      name: 'No-Pedal Wooden & Alloy Toddler Balance Bike',
      slug: 'no-pedal-wooden-alloy-toddler-balance-bike',
      sku: 'KDC-C02-BAL',
      description: 'Ultra-lightweight balance bike designed to help toddlers master steering and balance before transitioning to pedal bicycles.',
      mrp: 4999,
      salePrice: 3299,
      stockQuantity: 7,
      categoryId: createdCategories['cycles'].id,
      featured: false,
      active: true,
      age: '2 - 4 Years',
      capacity: 'Up to 25 kg',
      seoTitle: 'Toddler Balance Bike No-Pedal | KING DAY',
      seoDescription: 'Lightweight balance bike for early learning and balance development.',
      images: [
        { url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=1000', alt: 'Toddler Balance Bike', isPrimary: true, displayOrder: 1 },
      ],
      features: [
        'Puncture-Proof EVA Foam Tires',
        'Soft Ergonomic Rubber Handle Grips',
        'Padded Height-Adjustable Seat',
      ],
      specifications: [
        { key: 'Weight', value: '2.8 kg (Ultra Light)' },
        { key: 'Frame', value: 'Alloy & Birch Composite' },
      ],
    },

    // Baby Accessories
    {
      name: 'Royal Comfort Multi-Recline Baby Stroller & Pram',
      slug: 'royal-comfort-multi-recline-baby-stroller-pram',
      sku: 'KDA-B01-STR',
      description: 'Premium lightweight baby stroller featuring 3-position recline (sleeping, resting, sitting), 360 swivel front wheels, extended UV canopy, and 5-point safety harness.',
      mrp: 8999,
      salePrice: 5999,
      stockQuantity: 6,
      categoryId: createdCategories['baby-accessories'].id,
      featured: true,
      active: true,
      age: '0 - 3 Years',
      capacity: 'Up to 20 kg',
      seoTitle: 'Royal Comfort Reclinable Baby Stroller | KING DAY',
      seoDescription: 'Foldable baby stroller pram with multi-recline seat and canopy shelter.',
      images: [
        { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=1000', alt: 'Baby Stroller', isPrimary: true, displayOrder: 1 },
      ],
      features: [
        'One-Hand Easy Compact Folding',
        '3-Level Reclinable Padded Cushion Seat',
        '5-Point Adjustable Safety Harness',
        'Large Storage Basket & Parent Cup Holder',
      ],
      specifications: [
        { key: 'Frame', value: 'Aircraft Grade Aluminum' },
        { key: 'Safety Standard', value: 'EN 1888 Certified' },
      ],
    },
    {
      name: 'Musical 3-in-1 Adjustable Baby Walker with Toys',
      slug: 'musical-3-in-1-adjustable-baby-walker-with-toys',
      sku: 'KDA-B02-WLK',
      description: 'Interactive baby walker with detachable music toy tray, 3 height adjustments, anti-rollover stopper pads, and comfortable washable seat cushion.',
      mrp: 3499,
      salePrice: 2299,
      stockQuantity: 14,
      categoryId: createdCategories['baby-accessories'].id,
      featured: false,
      active: true,
      age: '6 - 18 Months',
      capacity: 'Up to 15 kg',
      seoTitle: '3-in-1 Musical Baby Walker | KING DAY',
      seoDescription: 'Adjustable baby walker with music tray and safety stoppers.',
      images: [
        { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000', alt: 'Baby Walker', isPrimary: true, displayOrder: 1 },
      ],
      features: [
        '3 Height Position Adjustment',
        'Detachable Electronic Music Play Tray',
        'Folds Flat for Space-Saving Storage',
      ],
      specifications: [
        { key: 'Cushion', value: 'Detachable & Machine Washable' },
        { key: 'Wheel Type', value: '360 Swivel Mute Wheels' },
      ],
    },
  ];

  for (const item of productsData) {
    const { images, features, specifications, ...productInfo } = item;
    const createdProduct = await prisma.product.create({
      data: {
        ...productInfo,
        images: {
          create: images,
        },
        features: {
          create: features.map((f) => ({ feature: f })),
        },
        specifications: {
          create: specifications,
        },
      },
    });
    console.log(`📦 Product created: ${createdProduct.name} (₹${createdProduct.salePrice})`);
  }

  console.log('✅ KING DAY Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
