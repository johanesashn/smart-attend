import connectToMongoDB from "@/libs/mongodb";
import Subject from "@/models/subject";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        await connectToMongoDB();

        const { name } = params;

        // Find the subject by name
        const subject = await Subject.findOne({ name });

        if (!subject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Subject retrieved", subject }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving subject:", error);
        return NextResponse.json({ message: "Error retrieving subject", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToMongoDB();

        const { name } = params;

        // Delete the subject by name
        const deletedSubject = await Subject.findOneAndDelete({ name });

        if (!deletedSubject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Subject deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting subject:", error);
        return NextResponse.json({ message: "Error deleting subject", error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToMongoDB();

        const { name } = params;

        // Parse the request body
        const { type, room, day, duration, time_start, time_end, lecturer, studentId } = await req.json();

        // Check if the subject exists by name
        const existingSubject = await Subject.findOne({ name });
        if (!existingSubject) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        if (type === "edit") {
            // Update the subject's fields
            existingSubject.room = room || existingSubject.room;
            existingSubject.day = day || existingSubject.day;
            existingSubject.duration = duration || existingSubject.duration;
            existingSubject.time_start = time_start || existingSubject.time_start;
            existingSubject.time_end = time_end || existingSubject.time_end;
            existingSubject.lecturer = lecturer || existingSubject.lecturer;

            // Save the updated subject
            await existingSubject.save();

            return NextResponse.json({ message: "Subject updated successfully", subject: existingSubject }, { status: 200 });
        } 
        
        if (type === "attend") {
            // Check if an attendance record for today exists
            const todayDate = new Date().toISOString().split("T")[0]; // Get only the date in YYYY-MM-DD format
            let todayAttendance = existingSubject.attendance.find(record => 
                record.date.toISOString().split("T")[0] === todayDate
            );

            if (!todayAttendance) {
                // Calculate if the student is "present" or "late"
                const currentTime = new Date();
                const classStartTime = new Date(todayDate + "T" + existingSubject.time_start); // Create date object with today's date and class start time
                const timeDifference = (currentTime - classStartTime) / (1000 * 60); // Time difference in minutes

                // Set status based on time difference
                const status = timeDifference > 15 ? "late" : "present";

                // Create a new attendance record for today with all members marked "absent"
                const defaultAttendance = existingSubject.members.map(memberId => ({
                    studentId: memberId,
                    status: memberId === studentId ? status : "absent" // Set attending student status immediately
                }));

                todayAttendance = {
                    date: new Date(),
                    records: defaultAttendance
                };

                existingSubject.attendance.push(todayAttendance);
            } else {
                // Calculate if the student is "present" or "late"
                const currentTime = new Date();
                const classStartTime = new Date(todayDate + "T" + existingSubject.time_start);
                const timeDifference = (currentTime - classStartTime) / (1000 * 60);

                // Set status based on time difference
                const status = timeDifference > 15 ? "late" : "present";

                // Find or add student’s attendance record and set the correct status
                let studentAttendance = todayAttendance.records.find(record => record.studentId === studentId);
                if (studentAttendance) {
                    studentAttendance.status = status;
                } else {
                    todayAttendance.records.push({
                        studentId: studentId,
                        status: status
                    });
                }
            }

            // Save the updated subject with attendance
            await existingSubject.save();

            return NextResponse.json({ message: `Attendance updated for student ${studentId}`, attendance: todayAttendance }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Invalid type specified" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error updating subject:", error);
        return NextResponse.json({ message: "Error updating subject", error: error.message }, { status: 500 });
    }
}
