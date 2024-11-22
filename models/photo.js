import mongoose, { Schema } from "mongoose";

const photoSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        photo: {
            type: String, 
            required: true
        } 
    },
    {
        timestamps: true
    }
);

const Photo = mongoose.models.Photo || mongoose.model("Photo", photoSchema);
export default Photo;