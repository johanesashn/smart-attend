import connectToMongoDB from "@/libs/mongodb"; // Your MongoDB connection logic
import Photo from "@/models/photo";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { id, photo } = await req.json();
        await connectToMongoDB();

        // Create a new photo record
        const newPhoto = await Photo.create({ id, photo });
        return NextResponse.json({ message: "Photo uploaded", photo: newPhoto }, { status: 201 });
    } catch (error) {
        console.error("Error uploading photo:", error);
        return NextResponse.json({ message: "Error uploading photo", error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToMongoDB(); // Connect to MongoDB

        // Retrieve all photos
        const photos = await Photo.find({}); // Empty object to get all photos

        if (!photos.length) {
            return NextResponse.json({ message: "No photos found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Photos retrieved", photos }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving photos:", error);
        return NextResponse.json({ message: "Error retrieving photos", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json(); // Get the photo ID from the request body
        await connectToMongoDB(); // Connect to MongoDB

        // Delete the photo by ID
        // const deletedPhoto = await Photo.findByIdAndDelete(id);

        // if (!deletedPhoto) {
        //     return NextResponse.json({ message: "Photo not found" }, { status: 404 });
        // }
        await Photo.deleteMany({});

        return NextResponse.json({ message: "Photo deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting photo:", error);
        return NextResponse.json({ message: "Error deleting photo", error: error.message }, { status: 500 });
    }
}