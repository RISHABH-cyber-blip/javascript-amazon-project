import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import { loadFromStorage,cart } from "../../data/cart.js";
import { loadProducts,loadProductsFetch } from "../../data/products.js";

describe('Test Suite:renderOrderSummary',()=>{
const productId1='e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
const productId2='15b6fc6f-327a-4ec4-896f-486349e85a3d';

beforeAll((done)=>{
  loadProductsFetch().then(()=>{
    done();
  });
});
  




 beforeEach(()=>{
  spyOn(localStorage,'setItem')
  document.querySelector('.js-test-container').innerHTML=`
  <div class="js-order-summary"><div>
   <div class="js-payment-summary"><div>
  `;
  spyOn(localStorage,'getItem').and.callFake(()=>{
    return JSON.stringify([{
      productId:productId1,
      quantity:2,
      deliveryOptionId:'1'
    },{
      productId:productId2,
      quantity:1,
      deliveryOptionId:'2'
    }]);
  });
    loadFromStorage();
   
    renderOrderSummary();
 }); 

 afterEach(()=>{
  document.querySelector('.js-test-container').innerHTML='';
 });


 it('displays the cart',()=>{
      expect(
        document.querySelectorAll('.js-cart-item-container').length
      ).toEqual(2);

    const quantityElement1 = document.querySelector(`.js-product-quantity-${productId1}`);
      if (quantityElement1) {
        expect(quantityElement1.innerText).toContain('Quantity: 2');
      } else {
        fail(`Element with class 'js-product-quantity-${productId1}' was not found in the DOM.`);
      }

    const quantityElement2 = document.querySelector(`.js-product-quantity-${productId2}`);
      if (quantityElement2) {
        expect(quantityElement2.innerText).toContain('Quantity: 1');
      } else {
        fail(`Element with class 'js-product-quantity-${productId2}' was not found in the DOM.`);
       }
  });


 it('removes a product',()=>{
    document.querySelector(`.js-delete-link-${productId1}`).click();
    
    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(1);
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`)
    ).toEqual(null);
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`)
    ).not.toEqual(null);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
 });
});
