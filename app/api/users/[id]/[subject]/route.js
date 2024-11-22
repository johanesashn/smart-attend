import connectToMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import Subject from "@/models/subject"; // Import the Subject model
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    const { id, subject } = params;

    try {
        await connectToMongoDB();

        // Find the user and add the subject to their subjects array
        const updatedUser = await User.findOneAndUpdate(
            { id: id },
            { $addToSet: { subjects: subject } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update the subject's members array using the subject name
        try {
            const updatedSubject = await Subject.findOneAndUpdate(
                { name: subject }, // Find by subject name
                { $addToSet: { members: id } }, // Add user id to the members array
                { new: true }
            );

            if (!updatedSubject) {
                return NextResponse.json({ message: "Subject not found" }, { status: 404 });
            }

        } catch (error) {
            return NextResponse.json({ message: "Error updating subject members", error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Subject added", user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error adding subject", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id, subject } = params;

    try {
        await connectToMongoDB();

        // Find the user and remove the subject from their subjects array
        const updatedUser = await User.findOneAndUpdate(
            { id: id },
            { $pull: { subjects: subject } }, // Remove the subject name from the subjects array
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update the subject's members array using the subject name
        const updatedSubject = await Subject.findOneAndUpdate(
            { name: subject }, // Find the subject by name
            { $pull: { members: id } }, // Remove the user ID from the members array
            { new: true }
        );

        if (!updatedSubject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Subject removed", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error removing subject:", error);
        return NextResponse.json({ message: "Error removing subject", error: error.message }, { status: 500 });
    }
}