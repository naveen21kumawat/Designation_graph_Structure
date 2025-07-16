import userSchema from "../models/userSchema.js";

const getUsers = async (req, res) => {
    console.log("Fetching users...");
  try {
    const users = await userSchema.find().populate('parent').populate('Children');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const createUser = async (req, res) => {
  console.log("Creating user...");
  try {
    const { parent: parentId, ...userData } = req.body;
    const newUser = new userSchema({ ...userData, parent: parentId || null });
    const savedUser = await newUser.save();

    if (parentId) {
      await userSchema.findByIdAndUpdate(
        parentId,
        { $push: { children: savedUser._id } },
        { new: true }
      );
    }

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export { createUser, getUsers };
