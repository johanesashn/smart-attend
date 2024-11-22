import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        year: {
            type: String,
        },
        subjects: {
            type: [String],
        },
        gender: {
            type: String,
        },
        major: {
            type: String,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;