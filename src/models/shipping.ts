import mongoose, { Schema, Document } from 'mongoose';

interface IShipping extends Document {
    location: string;
    price: number;
}

const ShippingSchema: Schema = new Schema({
    location: { type: String, required: true },
    price: { type: Number, required: true }
});

const Shipping = mongoose.model<IShipping>('Shipping', ShippingSchema);

export default Shipping;