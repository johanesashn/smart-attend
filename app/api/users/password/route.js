import bcrypt from "bcrypt";
import { NextResponse } from 'next/server';
import connectToMongoDB from "@/libs/mongodb";
import User from "@/models/user";

export async function PUT(req) {
    try {
        // Connect to the database
        await connectToMongoDB();

        // Find the user by ID        
        const { id, oldPassword, newPassword } = await req.json()
        const user = await User.findOne({ id: id });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if the old password matches the current password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ message: "Error updating password", error: error.message }, { status: 500 });
    }
}
