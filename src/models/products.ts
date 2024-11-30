import mongoose, { Schema, model, Document } from 'mongoose';


[
  {
      "name": "length",
      "variations": [
          {
              "variation": "timer",
              "price": 349,
              "quantity": 67
          },
          {
              "variation": "45 inches",
              "price": 500,
              "quantity": 4
          }
      ]
  }
]


interface VariationLevelOne{
  variation:string;
  price:number;
  quantity:number;
}

interface VariationLevelTwo{
  name:string;
  variations:VariationLevelOne[];
}


interface IProductType extends Document {
  name: string;
  category: string;
  description:string;
  quantity:number;
  price:number;
  bestSeller:boolean;
  images:string[];
  variations:VariationLevelTwo[];
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
    bestSeller:{
      type:Boolean,
      default:false,
    },
    images:{
        type:[],
    },
    variations:{
      type:[]
    }
  },
);



const BaseProduct = model<IProductType>('Product', ProductSchema);

export { BaseProduct,IProductType };
