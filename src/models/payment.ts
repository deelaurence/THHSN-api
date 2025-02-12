// {
//     "_id": {
//       "$oid": "679fb18b94bd7369bf4f694f"
//     },
//     "owner": "laurie143pelumi@gmail.com",
//     "amount": 356854,
//     "merchant": "paystack",
//     "description": {
//       "shippingType": "local",
//       "shippingFees": "34854",
//       "cartTotal": "322000",
//       "firstName": "Odunayo",
//       "lastName": "Alo",
//       "address": "Obafemi Awolowo University Teaching Hospital",
//       "country": "",
//       "internationalCity": "",
//       "stateOrProvince": "",
//       "selectedState": "Adamawa",
//       "selectedCity": "Mayo Belwa",
//       "postcode": "",
//       "telephone": "8165661486",
//       "grandTotal": "356854",
//       "merchant": "paystack",
//       "cart": [
//         {
//           "price": "200000",
//           "quantity": "1",
//           "name": "Wig Nano",
//           "variant": {
//             "type": "length",
//             "name": "22 inches"
//           }
//         },
//         {
//           "price": "20000",
//           "quantity": "6",
//           "name": "Treasure hair ",
//           "variant": {
//             "type": "length",
//             "name": "12 inches "
//           }
//         },
//         {
//           "price": "2000",
//           "quantity": "1",
//           "name": "Sharon Shampoo ",
//           "variant": {
//             "type": "colour",
//             "name": "Black "
//           }
//         }
//       ]
//     },
//     "reference": "5403dj71t4",
//     "name": "Odunayo",
//     "date": "Sunday, February 2,18:55:23",
//     "status": "Success",
//     "id": "b72094ea-b765-426d-867e-607de21fa53e",
//     "__v": 0
//   }

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    variant: {
        type: new mongoose.Schema({
            type: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }),
        required: true
    }
});

const descriptionSchema = new mongoose.Schema({
    shippingType: {
        type: String,
        required: true
    },
    shippingFees: {
        type: String,
        required: true
    },
    cartTotal: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: ""
    },
    internationalCity: {
        type: String,
        default: ""
    },
    stateOrProvince: {
        type: String,
        default: ""
    },
    selectedState: {
        type: String,
        default:""
    },
    selectedCity: {
        type: String,
        default:""
    },
    postcode: {
        type: String,
        default: ""
    },
    telephone: {
        type: String,
        required: true
    },
    grandTotal: {
        type: String,
        required: true
    },
    merchant: {
        type: String,
        required: true
    },
    cart: [cartItemSchema]
});

const paymentSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true 
    }, 
    amount: {
        type: Number,
        required: true
    },
    deliveryStatus:{
        type: String,
        enum:['pending','dispatched','shipped','ready'],
        default:"pending"
    },
    deliveryTimeline: [ 
        { 
            status: {
                type: String,
                enum: ["pending", "dispatched", "shipped", "ready"],
                required: true
            },
            time: {
                type: String,
                required: true
            }
        }
    ],
    deliveryMessage:{
        type: String,
    },
    merchant: {
        type: String,
        required: true
    },
    description: {
        type: descriptionSchema,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
