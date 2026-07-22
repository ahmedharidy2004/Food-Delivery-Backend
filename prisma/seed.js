import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "Password123!";

async function main() {
  console.log("Cleaning database...");

  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.address.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // ---------------------------------------------------------------------
  // 1. Owners (2)
  // ---------------------------------------------------------------------
  console.log("Seeding owners...");
  const ownersData = [
    {
      name: "Ahmed Hassan",
      email: "ahmed.owner@example.com",
      phoneNumber: "+201001112223",
    },
    {
      name: "Sara Youssef",
      email: "sara.owner@example.com",
      phoneNumber: "+201004445556",
    },
  ];

  const owners = [];
  for (const data of ownersData) {
    const owner = await prisma.user.create({
      data: { ...data, password: hashedPassword, role: "OWNER" },
    });
    owners.push(owner);
  }

  // ---------------------------------------------------------------------
  // 2. Customers (3)
  // ---------------------------------------------------------------------
  console.log("Seeding customers...");
  const customersData = [
    {
      name: "Youssef Ali",
      email: "youssef.customer@example.com",
      phoneNumber: "+201007778889",
    },
    {
      name: "Mona Adel",
      email: "mona.customer@example.com",
      phoneNumber: "+201009990001",
    },
    {
      name: "Karim Fathy",
      email: "karim.customer@example.com",
      phoneNumber: "+201002223334",
    },
  ];

  const customers = [];
  for (const data of customersData) {
    const customer = await prisma.user.create({
      data: { ...data, password: hashedPassword, role: "CUSTOMER" },
    });
    customers.push(customer);
  }

  // ---------------------------------------------------------------------
  // 3. Categories (4)
  // ---------------------------------------------------------------------
  console.log("Seeding categories...");
  const categoryNames = ["Burgers", "Pizza", "Sushi", "Desserts"];
  const categories = [];
  for (const name of categoryNames) {
    const category = await prisma.category.create({ data: { name } });
    categories.push(category);
  }

  // ---------------------------------------------------------------------
  // 4. Restaurants (5) — distributed across the 2 owners
  // ---------------------------------------------------------------------
  console.log("Seeding restaurants...");
  const defaultOpeningHours = {
    mon_fri: "09:00-22:00",
    sat_sun: "10:00-23:00",
  };

  const restaurantsData = [
    {
      name: "Grill House",
      description: "Classic smash burgers and loaded fries.",
      phoneNumber: "+20221112223",
      rating: 4.5,
      ownerId: owners[0].id,
    },
    {
      name: "Napoli Slice",
      description: "Wood-fired Neapolitan-style pizza.",
      phoneNumber: "+20221114445",
      rating: 4.7,
      ownerId: owners[0].id,
    },
    {
      name: "Sakura Sushi",
      description: "Fresh rolls, nigiri, and sashimi sets.",
      phoneNumber: "+20221116667",
      rating: 4.6,
      ownerId: owners[0].id,
    },
    {
      name: "Sweet Tooth Bakery",
      description: "Cakes, tarts, and other sweet treats.",
      phoneNumber: "+20221118889",
      rating: 4.8,
      ownerId: owners[1].id,
    },
    {
      name: "Fusion Bites",
      description: "A little bit of everything, done well.",
      phoneNumber: "+20221110001",
      rating: 4.3,
      ownerId: owners[1].id,
    },
  ];

  const restaurants = [];
  for (const data of restaurantsData) {
    const restaurant = await prisma.restaurant.create({
      data: { ...data, openingHours: defaultOpeningHours },
    });
    restaurants.push(restaurant);
  }

  // ---------------------------------------------------------------------
  // 5. Menu Items (20) — 4 per restaurant, category cycled across the 4 categories
  // ---------------------------------------------------------------------
  console.log("Seeding menu items...");
  const menuItemNames = [
    "Classic Cheeseburger",
    "Bacon BBQ Burger",
    "Veggie Burger",
    "Double Smash Burger",
    "Margherita Pizza",
    "Pepperoni Pizza",
    "BBQ Chicken Pizza",
    "Four Cheese Pizza",
    "California Roll",
    "Spicy Tuna Roll",
    "Salmon Nigiri Set",
    "Dragon Roll",
    "Chocolate Lava Cake",
    "New York Cheesecake",
    "Tiramisu",
    "Fruit Tart",
    "Grilled Chicken Wrap",
    "Caesar Salad",
    "Loaded Nachos",
    "Mango Sticky Rice",
  ];

  const menuItemsData = menuItemNames.map((name, i) => ({
    name,
    description: `${name} — made fresh to order.`,
    price: Number((5 + ((i * 3.75) % 20)).toFixed(2)), // varied prices, 5.00–25.00
    image: `https://picsum.photos/seed/menu-item-${i + 1}/400/300`,
    isAvailable: true,
    restaurantId: restaurants[i % restaurants.length].id,
    categoryId: categories[i % categories.length].id,
  }));

  await prisma.menuItem.createMany({ data: menuItemsData });

  // ---------------------------------------------------------------------
  console.log("\nSeed summary:");
  console.log(`  Owners:      ${owners.length}`);
  console.log(`  Customers:   ${customers.length}`);
  console.log(`  Categories:  ${categories.length}`);
  console.log(`  Restaurants: ${restaurants.length}`);
  console.log(`  Menu Items:  ${menuItemsData.length}`);
  console.log(`\nAll seeded users share the password: ${DEFAULT_PASSWORD}`);
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
