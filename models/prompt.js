import mongoose, { Schema, model, models } from "mongoose";
import User from "./user";

const PromptsSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: User.modelName
    },
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
    },
    tag: {
        type: String,
        required: [true, "Tag is required"],
    }
})

const Prompt = models.Prompt || model("Prompt", PromptsSchema);

export default Prompt;
