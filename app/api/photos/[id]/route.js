import connectToMongoDB from "@/libs/mongodb";
import Photo from "@/models/photo"; // Assuming you have a Photo model for the 'photos' collection
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectToMongoDB();

        // Get the dynamic 'id' from params (which is the username)
        const { id } = params;

        // Find the photo by the custom 'id' field in the 'photos' collection
        const photoEntry = await Photo.findOne({ id: id }); // Match by 'id' field, which stores the username

        if (!photoEntry) {
            return NextResponse.json({ message: `${id} not found` }, { status: 404 });
        }

        // Return the user's photo
        return NextResponse.json({ message: "Photo found", photo: photoEntry.photo }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving photo:", error);
        return NextResponse.json({ message: "Error retrieving photo", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToMongoDB();

        // Get the dynamic 'id' from params (which is the username)
        const { id } = params;

        // Find and delete the photo by the custom 'id' field in the 'photos' collection
        const deletedPhoto = await Photo.findOneAndDelete({ id: id }); // Match by 'id' field, which stores the username

        if (!deletedPhoto) {
            return NextResponse.json({ message: `${id} not found` }, { status: 404 });
        }

        // Return success message after deletion
        return NextResponse.json({ message: "Photo deleted successfully", photo: deletedPhoto.photo }, { status: 200 });
    } catch (error) {
        console.error("Error deleting photo:", error);
        return NextResponse.json({ message: "Error deleting photo", error: error.message }, { status: 500 });
    }
}