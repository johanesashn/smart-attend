import connectToMongoDB from "@/libs/mongodb";
import Subject from "@/models/subject";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, room, lecturer, day, time_start, time_end, duration, attendance, members } = await req.json();
        await connectToMongoDB();

        // Check if a subject with the same name already exists
        const existingSubject = await Subject.findOne({ name });
        if (existingSubject) {
            return NextResponse.json({ message: "Subject with this name already exists" }, { status: 400 });
        }

        // Create the new subject
        const newSubject = await Subject.create({ name, room, lecturer, day, time_start, time_end, duration, attendance, members });
        return NextResponse.json({ message: "Subject created", subject: newSubject }, { status: 201 });
    } catch (error) {
        console.error("Error creating subject:", error);
        return NextResponse.json({ message: "Error creating subject", error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToMongoDB();

        const subjects = await Subject.find({}).sort({ name: 1 });;

        if (!subjects.length) {
            return NextResponse.json({ message: "No subject found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Subject retrieved", subjects }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving subjects:", error);
        return NextResponse.json({ message: "Error retrieving subjects", error: error.message }, { status: 500 });
    }
}