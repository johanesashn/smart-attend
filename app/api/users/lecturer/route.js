import connectToMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

// GET request: Retrieve a user by ID
export async function GET(req) {
    try {
        await connectToMongoDB();

        // Find the user by ID
        const lecturers = await User.find({role: "lecturer"}).sort({ name: 1 });

        if (!lecturers) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User retrieved", lecturers }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving user:", error);
        return NextResponse.json({ message: "Error retrieving user", error: error.message }, { status: 500 });
    }
}