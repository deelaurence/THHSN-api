import { BaseProduct, IProductType } from "../models/products";


interface PaystackPayload{
    shippingType: string;
    shippingFees: number;
    cartTotal: number;
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    internationalCity: string;
    stateOrProvince: string;
    selectedState: string;
    selectedCity: string;
    postcode: string;
    telephone: string;
    grandTotal: number;
    merchant: string;
    cart: {
        price: number;
        quantity: number;
        name: string;
        variant: {
            type: string;
            name: string;
        }
    }[]
}


export async function updateStockAfterPayment(product:PaystackPayload) {
    
    const cartItems = product.cart;
    
    const productNames = cartItems.map(item => item.name);
  
    // Fetch all necessary products in one query
    const products = await BaseProduct.find({ name: { $in: productNames } });
  
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
            } else {
              console.log(`Not enough stock for ${item.variant.name}`);
            }
          }
        }
      }
    }
  
    // Save all changes
    await Promise.all(products.map(p => p.save()));
    console.log("Stock updated successfully.");
  }
  
 
  





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
  