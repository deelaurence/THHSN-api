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
  outOfStock:boolean;
  quantity:number;
  price:number;
  softDeleted:boolean;
  coverImage:string;
  bestSeller:boolean;
  newArrival:boolean;
  images:string[];
  variations:VariationLevelTwo[];
}

const ProductSchema = new Schema<IProductType>({
    name: {
      type: String,
      required:[true,"Supply Product Name"]
    },
    softDeleted:{
      type: Boolean,
      default: false 
    },
    outOfStock:{
      type: Boolean,
      default: false 
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
    newArrival:{
      type:Boolean,
      default:false,
    },
    coverImage:{
      type:String,
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
