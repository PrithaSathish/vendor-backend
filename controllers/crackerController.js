import Cracker from "../models/Cracker.js";

// Add new cracker (admin only)
export const addCracker = async (req, res) => {
  try {
    const { name, price, quantity, image } = req.body;
    const newCracker = await Cracker.create({ name, price, quantity, image });
    res.status(201).json(newCracker);
  } catch (error) {
    console.error("Add cracker error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all crackers (public)
export const getCrackers = async (req, res) => {
  try {
    const crackers = await Cracker.find();
    res.status(200).json(crackers);
  } catch (error) {
    console.error("Get crackers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete cracker (admin only)
export const deleteCracker = async (req, res) => {
  try {
    const { id } = req.params;

    const cracker = await Cracker.findByIdAndDelete(id);
    if (!cracker) return res.status(404).json({ message: "Cracker not found" });

    res.status(200).json({ message: "Cracker deleted successfully" });
  } catch (error) {
    console.error("Delete cracker error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update cracker stock (admin only)
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity == null) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const cracker = await Cracker.findById(id);
    if (!cracker) return res.status(404).json({ message: "Cracker not found" });

    cracker.quantity = quantity;
    await cracker.save();

    res.status(200).json({ message: "Stock updated successfully", cracker });
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
