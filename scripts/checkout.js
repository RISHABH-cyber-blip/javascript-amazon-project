import {renderOrderSummary} from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import  '../data/cart-class.js';
import { loadProducts,loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

//import '../data/backend-practice.js';

async function loadPage(){
  await loadProductsFetch();

  await new Promise((resolve)=>{
    loadCart(()=>{
      resolve('value3');       //value3 can be store in variable ,const value= await new promise etc etc.
    });
  })

  renderOrderSummary();
  renderPaymentSummary();


}
loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    });
  })

]).then((value)=>{
  console.log(value);
  renderOrderSummary();
  renderPaymentSummary();
});
*/



/*
new Promise((resolve)=>{
  loadProducts(()=>{
   resolve('value1'); 
  });

}).then((value)=>{
  console.log(value);
  return new Promise((resolve)=>{
    loadCart(()=>{
      resolve();
    });
  })

}).then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
})
*/
  


/*
loadProducts(()=>{
  loadCart(()=>{
    renderOrderSummary();
    renderPaymentSummary();
  });
});
*/
