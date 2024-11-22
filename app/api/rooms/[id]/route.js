import connectToMongoDB from "@/libs/mongodb";
import Room from "@/models/room";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
    try {
        await connectToMongoDB();

        const { id } = params;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid Room ID" }, { status: 400 });
        }

        // Delete the Room by ID
        const deletedRoom = await Room.findByIdAndDelete(id);

        if (!deletedRoom) {
            return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting room:", error);
        return NextResponse.json({ message: "Error deleting room", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToMongoDB();

        const { id } = params;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid Room ID" }, { status: 400 });
        }

        // Parse the JSON body of the request
        const { name, longitude, latitude, range } = await req.json();

        // Update the Room by ID with the specified properties
        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            { name, longitude, latitude, range },
            { new: true, runValidators: true }
        );

        if (!updatedRoom) {
            return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Room updated successfully", room: updatedRoom }, { status: 200 });
    } catch (error) {
        console.error("Error updating room:", error);
        return NextResponse.json({ message: "Error updating room", error: error.message }, { status: 500 });
    }
}