"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStockAfterPayment = void 0;
const products_1 = require("../models/products");
function updateStockAfterPayment(product) {
    return __awaiter(this, void 0, void 0, function* () {
        const cartItems = product.cart;
        const productNames = cartItems.map(item => item.name);
        // Fetch all necessary products in one query
        const products = yield products_1.BaseProduct.find({ name: { $in: productNames } });
        for (const item of cartItems) {
            const product = products.find(p => p.name === item.name);
            if (product) {
                const variation = product.variations.find(v => v.name === item.variant.type);
                if (variation) {
                    const subVariation = variation.variations.find(v => v.variation === item.variant.name);
                    if (subVariation) {
                        if (subVariation.quantity >= item.quantity) {
                            subVariation.quantity -= item.quantity;
                            // Tell Mongoose that variations field was modified
                            product.markModified("variations");
                            console.log(`Updated quantity: ${subVariation.quantity} (subtracted ${item.quantity})`);
                        }
                        else {
                            console.log(`Not enough stock for ${item.variant.name}`);
                        }
                    }
                }
            }
        }
        // Save all changes
        yield Promise.all(products.map(p => p.save()));
        console.log("Stock updated successfully.");
    });
}
exports.updateStockAfterPayment = updateStockAfterPayment;
// async function updateStock() {
//     const data = {
//       "shippingType": "local",
//       "shippingFees": 567,
//       "cartTotal": 200000,
//       "firstName": "Yoder",
//       "lastName": "Poili",
//       "address": "Tsushsb",
//       "country": "Nigeria",
//       "internationalCity": "",
//       "stateOrProvince": "",
//       "selectedState": "Ebonyi",
//       "selectedCity": "Afikpo North",
//       "postcode": "",
//       "telephone": "80272",
//       "grandTotal": 200567,
//       "merchant": "paystack",
//       "cart": [
//         {
//           "price": 200000,
//           "quantity": 1,
//           "name": "Wig Nano",
//           "variant": {
//             "type": "length",
//             "name": "22 inches"
//           }
//         }
//       ]
//     };
//     const cartItems = data.cart;
//     const productNames = cartItems.map(item => item.name);
//     // Fetch all necessary products in one query
//     const products = await BaseProduct.find({ name: { $in: productNames } });
//     for (const item of cartItems) {
//       const product = products.find(p => p.name === item.name);
//       if (product) {
//         const variation = product.variations.find(v => v.name === item.variant.type);
//         if (variation) {
//           const subVariation = variation.variations.find(v => v.variation === item.variant.name);
//           if (subVariation) {
//             if (subVariation.quantity >= item.quantity) {
//               subVariation.quantity -= item.quantity;
//               // Tell Mongoose that variations field was modified
//               product.markModified("variations");
//               console.log(`Updated quantity: ${subVariation.quantity} (subtracted ${item.quantity})`);
//             } else {
//               console.log(`Not enough stock for ${item.variant.name}`);
//             }
//           }
//         }
//       }
//     }
//     // Save all changes
//     await Promise.all(products.map(p => p.save()));
//     console.log("Stock updated successfully.");
//   }
//   updateStock().catch(console.error);
