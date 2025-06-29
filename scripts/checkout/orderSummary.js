import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption
} from '../../data/cart.js';
import{getProduct} from '../../data/products.js';
import { formatCurrency } from '../../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions,getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';



export function renderOrderSummary(){
let cartSummaryHtml='';

cart.forEach((cartItem)=>{
 const productId=cartItem.productId;
 let matchingProduct=getProduct(productId);

const deliveryOptionId=cartItem.deliveryOptionId;
const  deliveryOption=getDeliveryOption(deliveryOptionId);

const today=dayjs();
const deliveryDate=today.add(deliveryOption.deliveryDays,'day');
const dateString=deliveryDate.format('dddd, MMMM D');
  cartSummaryHtml+=`
  <div class="cart-item-container 
  js-cart-item-container
  js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          
          <div class="product-price">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity
          js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label 
               js-quantity-label-${matchingProduct.id}
              ">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link"
            data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input
            js-quantity-input-${matchingProduct.id}
            " placeholder="0">
            <span class="delete-quantity-link link-primary js-delete-link
            js-delete-link-${matchingProduct.id}" 
            data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct,cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct,cartItem){
  let html='';
  deliveryOptions.forEach((deliveryOption)=>{
    const today=dayjs();
    const deliveryDate=today.add(deliveryOption.deliveryDays,'day');
    const dateString=deliveryDate.format('dddd, MMMM D');
    const priceString=deliveryOption.priceCents===0
    ?'FREE Shipping'
    :`$${formatCurrency(deliveryOption.priceCents)} - Shipping`;
    const isChecked=cartItem.deliveryOptionId===deliveryOption.id;
    html+=` 
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}"
      >
              <input type="radio"
              ${isChecked ? 'checked':''}
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  ${dateString}
                </div>
                <div class="delivery-option-price">
                  ${priceString}
                </div>
              </div>
            </div>
          `;
});
return html;
}

document.querySelector('.js-order-summary')
  .innerHTML=cartSummaryHtml;
  
document.querySelectorAll('.js-delete-link')
 .forEach((link) => {
     link.addEventListener('click',() => {
     const productId=link.dataset.productId;
     removeFromCart(productId);
    
    updateCartQuantity();
    renderOrderSummary();
    renderPaymentSummary();
    
     });
   });

  /*function updateCartQuantity(){
    const cartQuantity=calculateCartQuantity();
    document.querySelector('.js-checkout-quantity')
    .innerHTML = `${cartQuantity} items`;
  }*/
    function updateCartQuantity() {
      const cartQuantity = calculateCartQuantity();
      const quantityElement = document.querySelector('.js-checkout-quantity');
      if (quantityElement) {
        quantityElement.innerHTML = `${cartQuantity} items`;
      }
    }
  updateCartQuantity();

  document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add('is-editing-quantity');

    // Show input and Save button, hide quantity label and update link
    const quantityLabel = container.querySelector(`.js-quantity-label-${productId}`);
    const quantityInput = container.querySelector(`.js-quantity-input-${productId}`);
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'save-quantity-button button-primary';
    
    // Hide label & update link, show input & save button
    quantityLabel.style.display = 'none';
    link.style.display = 'none';
    quantityInput.style.display = 'inline-block';
    quantityInput.value = quantityLabel.textContent.trim();

    // Append Save button next to input if not already appended
    if (!container.querySelector('.save-quantity-button')) {
      quantityInput.insertAdjacentElement('afterend', saveBtn);
    }

    // Save button click handler
    saveBtn.addEventListener('click', () => {
      const newQuantity = Number(quantityInput.value);
      if (isNaN(newQuantity) || newQuantity < 1) {
        alert('Please enter a valid quantity (1 or more).');
        return;
      }

      // Update quantity in cart data
      updateQuantity(productId, newQuantity);

      // Update quantity label UI
      quantityLabel.textContent = newQuantity;

      // Hide input and save button, show label and update link again
      quantityInput.style.display = 'none';
      saveBtn.remove();
      quantityLabel.style.display = '';
      link.style.display = '';

      container.classList.remove('is-editing-quantity');

      // Update cart quantity counter and rerender summaries
      updateCartQuantity();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
});


  /*document.querySelectorAll('.js-update-link')
  .forEach((link)=>{
    link.addEventListener('click',()=>{
      const productId = link.dataset.productId;
      const container=document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    });
  });


  document.querySelectorAll('.span-quantity-link')
  .forEach((link)=>{
    link.addEventListener('click',()=>{
      const productId = link.dataset.productId;
      const container=document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.remove('is-editing-quantity');

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);
      updateQuantity(productId, newQuantity);

      document.querySelector(
        `.js-quantity-label-${productId}`
      ).innerHTML = newQuantity;
      updateCartQuantity();
    });
  });*/




  document.querySelectorAll('.js-delivery-option')
  .forEach((element)=>{
   element.addEventListener('click',()=>{
    const {productId,deliveryOptionId}=element.dataset;
   updateDeliveryOption(productId, deliveryOptionId);
   updateCartQuantity();
   renderOrderSummary();
   renderPaymentSummary();
   });
  });


}
