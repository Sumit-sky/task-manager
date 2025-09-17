import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // 5. Send a success response (omitting the password)
    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // 2. Find the user in the database
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Generate a JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // 5. Send the token to the client
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error);
  }
};
