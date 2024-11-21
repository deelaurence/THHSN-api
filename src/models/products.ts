import mongoose, { Schema, model, Document } from 'mongoose';

interface IProductType extends Document {
  name: string;
  category: string;
  description:string;
  quantity:number;
  price:number;
  images:string[]
}

const ProductSchema = new Schema<IProductType>({
    name: {
      type: String,
      required:[true,"Supply Product Name"]
    },
    category: {
      type: String,
      required:[true,"Supply Product Category"]
    },
    description: {
      type: String,
    },
    quantity:{
        type:Number,
        required:[true,"Supply Product qunatity in stock"]
    },
    price:{
        type:Number,
        required:[true,"Supply Product base price"]
    },
    images:{
        type:[],
    }
  },
);



const BaseProduct = model<IProductType>('Product', ProductSchema);

export { BaseProduct,IProductType };
