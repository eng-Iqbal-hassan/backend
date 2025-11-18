import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types. ObjectId,
            // User who is subscribing
            ref: "User"
        },
        channel: {
            type: Schema.Types. ObjectId,
            // User whome subscriber is subscribing
            ref: "User"
        }
    },
    {timestamps: true}
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema);