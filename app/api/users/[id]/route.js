import connectToMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import Photo from "@/models/photo";

// GET request: Retrieve a user by ID
export async function GET(req, { params }) {
    try {
        await connectToMongoDB();

        const { id } = params;

        // Find the user by ID
        const user = await User.findOne({id});

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User retrieved", user }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving user:", error);
        return NextResponse.json({ message: "Error retrieving user", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params; // Assuming the user ID is part of the route
    try {
        const { oldPassword, newPassword, ...updatedAttributes } = await req.json();
        await connectToMongoDB();

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Check if a new password is provided
        if (newPassword) {
            // Compare the old password with the stored hashed password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ message: "Old password is incorrect." }, { status: 400 });
            }

            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword; // Update the password
        }

        // Update the user's attributes except for the password
        Object.assign(user, updatedAttributes);

        // Save the updated user
        await user.save();

        return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Error updating user", error: error.message }, { status: 500 });
    }
}

// DELETE request: Delete a user by ID
export async function DELETE(req, { params }) {
    try {
        await connectToMongoDB();

        const { id } = params;

        // Validate the custom `id` (this assumes `id` is a simple string, not ObjectId)
        if (!id) {
            return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
        }

        // Delete the user by custom `id` field
        const deletedUser = await User.findOneAndDelete({ id });

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if the user's photo exists and delete it if it does
        const photo = await Photo.findOne({ id });
        if (photo) {
            await Photo.deleteOne({ id });
        }

        return NextResponse.json({ 
            message: "User deleted successfully" + (photo ? " and photo deleted" : ""),
            user: deletedUser,
            photo: photo || null // Return null if no photo was found
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user and photo:", error);
        return NextResponse.json({ message: "Error deleting user and photo", error: error.message }, { status: 500 });
    }
}