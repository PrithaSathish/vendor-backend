import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    let admin = await User.findOne({ email: "admin@example.com" });

    if (admin) {
      // Ensure role is admin
      if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
        console.log("✅ Updated existing user to admin");
      } else {
        console.log("✅ Admin already exists");
      }
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created: admin@example.com / admin123");
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
};

export default seedAdmin;
