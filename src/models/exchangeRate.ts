import mongoose, { Schema, model, Document } from 'mongoose';


interface IExchangeRate extends Document {
  rate: number;
  currencyPair:string;
}

const ExchangeSchema = new Schema<IExchangeRate>({
    rate: {
      type: Number,
      required:[true,"Supply Rate"]
    },
    currencyPair: {
      type: String,
      required:[true,"Supply Currency Pair"]
    },
  },
);


const BaseExchangeRate = model<IExchangeRate>('ExchangeRate', ExchangeSchema);

export { BaseExchangeRate,IExchangeRate };
