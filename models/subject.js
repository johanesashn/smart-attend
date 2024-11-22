import mongoose, { Schema } from "mongoose";

const attendanceRecordSchema = new Schema({
    studentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["present", "absent", "late"],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { _id: false }); // Prevent auto-generating IDs for subdocuments

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        room: {
            type: String,
            required: true
        },
        lecturer: {
            type: String,
            required: true
        },
        day: {
            type: String,
            required: true
        },
        time_start: {
            type: String,
            required: true
        },
        time_end: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        attendance: {
            type: [
                {
                    date: {
                        type: Date,
                        required: true
                    },
                    records: {
                        type: [attendanceRecordSchema],
                        required: true,
                        default: []
                    }
                }
            ],
            required: true,
            default: []
        },
        members: {
            type: [String], 
            required: true,
            default: [] // Initialize as an empty array
        }
    },
    {
        timestamps: true
    }
);

const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
export default Subject;
