import mongoose, { Schema } from "mongoose";

const roomScheme = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        },
        range: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Room = mongoose.models.Room || mongoose.model("Room", roomScheme);
export default Room;
