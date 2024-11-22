import connectToMongoDB from "@/libs/mongodb";
import Room from "@/models/room";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, longitude, latitude, range } = await req.json();
        await connectToMongoDB();

        // Check if a room with the same name already exists
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return NextResponse.json({ message: "Room with this name already exists" }, { status: 400 });
        }

        // Create the new room if it doesn't exist
        const newRoom = await Room.create({ name, longitude, latitude, range });
        return NextResponse.json({ message: "Room created", room: newRoom }, { status: 201 });
    } catch (error) {
        console.error("Error creating room:", error);
        return NextResponse.json({ message: "Error creating room", error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToMongoDB();

        const rooms = await Room.find({}).sort({ name: 1 });;

        if (!rooms.length) {
            return NextResponse.json({ message: "No rooms found" }, { status: 200 });
        }

        return NextResponse.json({ message: "Rooms retrieved", rooms }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving rooms:", error);
        return NextResponse.json({ message: "Error retrieving rooms", error: error.message }, { status: 500 });
    }
}