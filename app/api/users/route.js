import connectToMongoDB from "@/libs/mongodb";
import bcrypt from "bcrypt";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, password, role, id, year, subjects, gender, major } = await req.json();
        await connectToMongoDB();
        // Check if the name already exists
        const existingUser = await User.findOne({ id });
        if (existingUser) {
            return NextResponse.json({ message: "Id already exists" }, { status: 400 });
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user with the hashed password
        const newUser = await User.create({ name, password: hashedPassword, role, id, year, subjects, gender, major });
        return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToMongoDB();

        // Retrieve all users
        const users = await User.find({}).sort({ name: 1 });

        if (!users.length) {
            return NextResponse.json({ message: "No users found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Users retrieved", users }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving users:", error);
        return NextResponse.json({ message: "Error retrieving users", error: error.message }, { status: 500 });
    }
}