import connectToMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { id, password } = await req.json();
        await connectToMongoDB();

        // Find the user by id
        const user = await User.findOne({ id });
        if (!user) {
            return NextResponse.json({ message: `${id} not found` }, { status: 404 });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        // Password is correct, proceed with login (e.g., creating a session or token)
        return NextResponse.json({ message: "Login successful", user }, { status: 200 });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ message: "Error logging in", error: error.message }, { status: 500 });
    }
}
