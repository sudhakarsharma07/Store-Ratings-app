// // backend/seed.js
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Store = require("./models/Store");

// dotenv.config();

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const seedStores = async () => {
//   try {
//     // Clear existing stores
//     await Store.deleteMany();

//     // Insert sample stores
//     const stores = await Store.insertMany([
//       {
//         name: "Big Bazaar",
//         email: "bigbazaar@example.com",
//         address: "Main Market Road, Delhi",
//       },
//       {
//         name: "Reliance Fresh",
//         email: "reliance@example.com",
//         address: "MG Road, Bangalore",
//       },
//       {
//         name: "Spencer's",
//         email: "spencers@example.com",
//         address: "Park Street, Kolkata",
//       },
//     ]);

//     console.log("✅ Sample stores added:", stores);
//     process.exit();
//   } catch (err) {
//     console.error("❌ Error seeding stores:", err);
//     process.exit(1);
//   }
// };

// seedStores();

// backend/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Store = require("./models/Store");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/store_rating_system";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // ===== Seed Users =====
    await User.deleteMany({});
    console.log("🧹 Old users removed");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const ownerPassword = await bcrypt.hash("owner123", 10);

    const users = await User.insertMany([
      {
        name: "Super Admin",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin",
      },
      {
        name: "Store Owner",
        email: "owner@example.com",
        password: ownerPassword,
        role: "owner",
      },
    ]);

    console.log("👤 Users inserted:", users.map(u => ({ email: u.email, role: u.role })));

    // ===== Seed Stores =====
    await Store.deleteMany({});
    console.log("🧹 Old stores removed");

    const stores = await Store.insertMany([
      {
        name: "Big Bazaar",
        email: "bigbazaar@example.com",
        address: "Main Market Road, Delhi",
        owner: users[1]._id, // assign to owner
      },
      {
        name: "Reliance Fresh",
        email: "reliance@example.com",
        address: "MG Road, Bangalore",
        owner: users[1]._id, // assign to owner
      },
      {
        name: "Spencer's",
        email: "spencers@example.com",
        address: "Park Street, Kolkata",
        owner: users[1]._id, // assign to owner
      },
    ]);

    console.log("🏬 Stores inserted:", stores.map(s => ({ name: s.name, owner: users[1].email })));

    console.log("\n✅ Done. Use these credentials to login:");
    console.log("Admin -> email: admin@example.com | password: admin123");
    console.log("Owner -> email: owner@example.com | password: owner123");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seed();
