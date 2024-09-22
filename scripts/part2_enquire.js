/**
 * Author: Chong Yi Yang
 * Target: enquire.html
 * Purpose: Control and validate the form elements in enquire.html
 * Created: 13/9/2024
 * Last updated: 19/9/2024
 * Credits: 
 * - innerHTML: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
 * - custom object mapping: https://www.freecodecamp.org/news/a-complete-guide-to-creating-objects-in-javascript-b0e2450655e8/
 */

"use strict"

var noOfProduct = 1;

// Function to change visibility of Billing section
function changeBillingVisibility(checkBox, billingPostContainer, isInitialize) {
    const billingContainer = document.getElementById("bill-address-container");
    // If checkbox checked then hide the container
    if (checkBox.checked) {
        billingContainer.hidden = true 
        // Hide the error message if billing container hidden
        hideAllBillingErrors();
    }
    else {
        billingContainer.hidden = false;
        // Recheck postcode and state when unchecked
        checkPostAndState(billingPostContainer, document.getElementById("bill-street-state"));
        if (!isInitialize)
            checkBillingAddress();
    }
}

function hideAllBillingErrors() {
    // Hide billing street error
    const billStreet = document.getElementById("bill-street-add");
    hideBillingError(billStreet);

    // Hide billing suburb error
    const billSuburb = document.getElementById("bill-street-suburb");
    hideBillingError(billSuburb);

    // Hide billing state error
    const billState = document.getElementById("bill-street-state");
    hideBillingError(billState);

    const billPost = document.getElementById("bill-street-post");
    hideBillingError(billPost);
    
}

function hideBillingError(billingInput) {
    const billError = billingInput.parentElement.querySelector(".error-msg");
    hideErrorMessage(billError, billingInput);
}

function checkPostAndState(postContainer, stateElem) {
    // Get post address container elements
    const postInput = postContainer.getElementsByTagName("input")[0];
    const postErrorSpan = postContainer.getElementsByTagName("span")[0];
    
    const state = stateElem.value;
    const postcode = postInput.value

    // If both Postcode and State value are valid
    if (postcode && state) {
        // If postcode length is less than 4 then show error
        if (postcode.length < 4) {
            showErrorMessage(postErrorSpan, "Postcode must be 4 digits long.", postInput);
            return;
        }
        // Get first digit of postcode
        const firstDigit = postcode[0];
        // Create a dictionary map for state to first digit post code
        const stateToPostMapping = {
            "VIC": ["3", "8"],
            "NSW": ["1", "2"],
            "QLD": ["4", "9"],
            "NT": ["0"],
            "WA": ["6"],
            "SA": ["5"],
            "TAS": ["7"],
            "ACT": ["0"]
        }

        if (stateToPostMapping[state].includes(firstDigit)) {
            hideErrorMessage(postErrorSpan, postInput);
        }
        else {
            showErrorMessage(postErrorSpan, "Postcode does not match the selected state.", postInput);
        }
    }
}

function checkInput() {

    checkProductSelection();

    checkBillingAddress();

    const getAllErrorSpan = document.getElementsByClassName("error-msg");

    for (var i = 0; i < getAllErrorSpan.length; i++) {
        const errorSpan = getAllErrorSpan[i];
        if (!errorSpan.hidden) {
            // Get parent div of error span and scroll to the div
            document.getElementById(errorSpan.parentElement.id).scrollIntoView({ behavior: "smooth" });
            showToast("Please ensure the input meets the required format.");
            return false;
        }
    } 
    
}

function checkBillingAddress() {
    const isUseShippingChecked = document.getElementById("use-ship-check").checked;
    // If billing not using shipping address then check if fields are valid
    if (!isUseShippingChecked) {
        // Street address validation
        const billStreet = document.getElementById("bill-street-add");
        checkBillingInput(billStreet);

        // Suburb address validation
        const billSuburb = document.getElementById("bill-street-suburb");
        checkBillingInput(billSuburb);

        const billState = document.getElementById("bill-street-state");
        checkBillingInput(billState);
    }
}

function checkBillingInput(billInput) {
    const billError = billInput.parentElement.querySelector(".error-msg");
    setBillingInputEvent(billInput, billError);
    // If billing street value is empty
    if (!billInput.value) {    
        showErrorMessage(billError, "Billing street address cannot be empty", billInput);
    }
}

function setBillingInputEvent(billInput, billError) {
    billInput.oninput = () => {
        if (billInput.value) {
            hideErrorMessage(billError, billInput);
        }
    }
}

function createProductItem(productNo) {
    const productList = document.getElementById("product-list");
    // Create product container in product list
    const productContainer = document.createElement("div");
    productContainer.className = "product-item";
    productContainer.setAttribute("id", "prod-item-" + productNo);

    // Add elements into the product container
    productContainer.innerHTML = `
        <div class="prod-head-group">
            <label for="product-${productNo}">Select a Product</label>
            <button type="button" class="delete-prod" id="del-prod-${productNo}">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
                    <path d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"></path>
                </svg>
            </button>
        </div>
        
        <select id="product-${productNo}" name="product-${productNo}" class="has-error-span" required>
            <option value="" selected>--- Please Select ---</option>
            <option value="light-bulbs">Smart Light Bulbs</option>
            <option value="leds">Smart LEDs</option>
            <option value="light-strips">Smart Light Strips</option>
        </select>

        <div id="product-options-${productNo}"></div>  
    `

    productList.appendChild(productContainer);
    // Add onclick event for delete/trash button to remove item
    const deleteButton = document.getElementById("del-prod-" + productNo);
    deleteButton.onclick = () => removeProduct(productNo);
    // Add onchange event for product select to display options & delete button
    const productSelect = document.getElementById("product-" + productNo);
    productSelect.onchange = () => updateProductOptions(productNo);
}

function removeProduct(productNo) {
    // Get the number of products in the list
    const amtOfProducts = getAllProducts();
    // Product amount cannot be less than 1, don't allow remove if amount is 1
    if (amtOfProducts.length > 1) {
        // Get product item and remove
        const productItemID = "prod-item-" + productNo;
        const productItem = document.getElementById(productItemID)

        // Check if product footer exists
        const productFoot = productItem.querySelector(".product-footer");
        if (productFoot) {
            // If exists then minus final price with prev price
            const priceSpan = productFoot.querySelector("#price-" + productNo);
            minusPrevPrice(priceSpan);
        }
        productItem.remove();
    }

    else {
        showToast("You must have at least 1 product.");
    }



    // if (productNo < noOfProduct - 1) {
    //     for (var i = productNo + 1; i < noOfProduct; i++) {
    //         const newIndex = i - 1;
    //         // Move product after the removed product front by 1
    //         // Change product container ID
    //         const productItem = document.getElementById("prod-item-" + i)
    //         productItem.id = "prod-item-" + newIndex;
    //         // Change label and button ID
    //         document.querySelector(`label[for="product-${i}"]`).setAttribute("for", "product-"+ newIndex);
            
    //         const deleteButton = document.getElementById("del-prod-" + i);
    //         deleteButton.id = "del-prod-" + newIndex;
    //         deleteButton.onclick = () => removeProduct(newIndex);

    //         // Change select ID
    //         const productSel = document.getElementById("product-" + i);
    //         productSel.id = "product-" + newIndex;
    //         productSel.name = "product-" + newIndex;
    //         productSel.onchange = () => updateProductOptions(newIndex);

    //         // Change product option ID
    //         const productOptions = document.getElementById("product-options-" + i);
    //         productOptions.id = "product-options-" + newIndex;
            
    //         // Change ID and name for product options hidden input
    //         const prodOptionsHiddenInput = document.getElementById("option-" + i);
    //         prodOptionsHiddenInput.id = prodOptionsHiddenInput.name = "option-" + newIndex;

    //         // Check if product footer exists
    //         const productFoot = productItem.querySelector(".product-footer");
    //         if (productFoot) {
    //             // If exists update all ID of elements in footer
    //             const quantityLabel = document.querySelector(`label[for="quantity-${i}"]`);
    //             quantityLabel.setAttribute("for", "quantity-" + newIndex);

    //             // Change minus and add button ID
    //             document.getElementById("minus-qty-" + i).id = "minus-qty-" + newIndex;
    //             document.getElementById("add-qty-" + i).id = "add-qty-" + newIndex;

    //             // Change quantity input ID
    //             const quantityInput = document.getElementById("quantity-" + i);
    //             quantityInput.id = quantityInput.name = "quantity-" + newIndex;

    //             // Change price span ID
    //             document.getElementById("price-" + i).id = "price-" + newIndex;
    //         }

    //         // Reset option button events
    //         setOptionButtonEvents(newIndex, productOptions);
    //     }
    // }
    
    // noOfProduct--;


}

function updateProductOptions(productNo) {
    const product = document.getElementById("product-" + productNo).value;
    const productOptionsContainer= document.getElementById("product-options-" + productNo);

    // Clear previous options from container
    productOptionsContainer.innerHTML = "";
    // Remove product footer
    // Get product item
    const productItem = document.getElementById("prod-item-" + productNo);
    // Get product footer with class
    const productFooter = productItem.querySelector(".product-footer");

    if (productFooter) {
        // Update final price
        const priceSpan = productFooter.querySelector("#price-" + productNo);
        minusPrevPrice(priceSpan);


        // If product footer exists remove
        productFooter.remove();
    }
    // Set new options
    if (product === "light-bulbs") {
        // For light bulbs different sizes
        productOptionsContainer.innerHTML = `
            <label class="prod-option-header">Size:</label>
            <input type="hidden" id="option-${productNo}" name="option-${productNo}">
            <button type="button" class="option-btn" data-value="a19" data-price="17.99">A19</button>
            <button type="button" class="option-btn" data-value="br30" data-price="22.99">BR30</button>
            <button type="button" class="option-btn" data-value="gu10" data-price="19.99">GU10</button>
            <span class="error-msg" hidden></span>    
        `
    }
    else if(product === "leds") {
        // Different lengths for LED
        productOptionsContainer.innerHTML = `
            <label class="prod-option-header">Length:</label>
            <input type="hidden" id="option-${productNo}" name="option-${productNo}">
            <button type="button" class="option-btn" data-value="2m" data-price="19.99">2m</button>
            <button type="button" class="option-btn" data-value="5m" data-price="27.99">5m</button>
            <button type="button" class="option-btn" data-value="10m" data-price="42.99">10m</button>
            <span class="error-msg" hidden></span> 
        `
    }
    else if(product === "light-strips") {
        // Different length options for light strips
        productOptionsContainer.innerHTML = `
            <label class="prod-option-header">Length:</label>
            <input type="hidden" id="option-${productNo}" name="option-${productNo}">
            <button type="button" class="option-btn" data-value="1m" data-price="12.99">1m</button>
            <button type="button" class="option-btn" data-value="2m" data-price="21.99">2m</button>
            <button type="button" class="option-btn" data-value="5m" data-price="33.99">5m</button>
            <span class="error-msg" hidden></span> 
        `
    }
    else {
        return;
    }

    setOptionButtonEvents(productNo, productOptionsContainer);
}

function setOptionButtonEvents(productNo, optionsContainer) {
    const allButtons = optionsContainer.getElementsByTagName("button");
    for (var i = 0; i < allButtons.length; i++) {
        const currButton = allButtons[i];
        currButton.onclick = () => {
            showProductFooter(productNo, currButton, allButtons);

            const errorSpan = optionsContainer.querySelector(".error-msg");
            hideErrorMessage(errorSpan, null);
        }
    }
}

function showProductFooter(productNo, btn, btnList) {
    

    // Get or create product footer
    const productFooter = getOrCreateFooter(productNo);
    
    const errorSpan = productFooter.querySelector(".error-msg");
    // Set add and minus quantity buttons to change quantity
    const minusBtn = document.getElementById("minus-qty-" + productNo);
    const addBtn = document.getElementById("add-qty-" + productNo);
    const quantityInput = document.getElementById("quantity-" + productNo);

    // Use spread operator to convert HTMLCollection to Array
    [...btnList].forEach(button => {
        // Each button in button list remove the active class
        button.classList.remove("active");
    });
    // Add active to current button to only ensure 1 button active at a time
    btn.classList.add("active");

    // Set event listeners for buttons and input
    minusBtn.onclick = () => {
        // If successfully minus then update price
        if (minusQty(quantityInput, errorSpan)) {
            calculateProductPrice(productNo, btn, quantityInput);
        }
    }
    addBtn.onclick = () => {
        if (addQty(quantityInput, errorSpan)) {
            calculateProductPrice(productNo, btn, quantityInput);
        }
        
    }
    quantityInput.oninput = () => {
        if(checkQty(quantityInput, errorSpan)) {
            calculateProductPrice(productNo, btn, quantityInput);
        }
    }


    if (checkQty(quantityInput, errorSpan)) 
        calculateProductPrice(productNo, btn, quantityInput);
    
    // Add to hidden input when option button clicked
    const optionHiddenInput = document.getElementById("option-" + productNo);

    optionHiddenInput.value = btn.getAttribute("data-value");

    
}

function getOrCreateFooter(productNo) {
    const productContainer = document.getElementById("prod-item-" + productNo);

    // Find footer in product container
    var productFooter = productContainer.querySelector(".product-footer");

    if (!productFooter) {
        productFooter = createProductFooter(productNo);
        productContainer.appendChild(productFooter);
    }

    return productFooter;
}



function createProductFooter(productNo) {
    const productFooter = document.createElement("div");
    productFooter.classList.add("product-footer");

    productFooter.innerHTML = `
        <div id="qty-container-${productNo}">
            <label for="quantity-${productNo}" class="prod-option-header">Quantity:</label>
            <div>
                <button type="button" class="qty-btn" id="minus-qty-${productNo}">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                        <path d="M 6.5 22.5 A 1.50015 1.50015 0 1 0 6.5 25.5 L 41.5 25.5 A 1.50015 1.50015 0 1 0 41.5 22.5 L 6.5 22.5 z"></path>
                    </svg>
                </button>
                <input type="text" id="quantity-${productNo}" name="quantity-${productNo}" value="1" class="qty-input">

                <button type="button" class="qty-btn" id="add-qty-${productNo}">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                        <path d="M 23.976562 4.9785156 A 1.50015 1.50015 0 0 0 22.5 6.5 L 22.5 22.5 L 6.5 22.5 A 1.50015 1.50015 0 1 0 6.5 25.5 L 22.5 25.5 L 22.5 41.5 A 1.50015 1.50015 0 1 0 25.5 41.5 L 25.5 25.5 L 41.5 25.5 A 1.50015 1.50015 0 1 0 41.5 22.5 L 25.5 22.5 L 25.5 6.5 A 1.50015 1.50015 0 0 0 23.976562 4.9785156 z"></path>
                    </svg>
                </button>
            </div>
            
            <span class="error-msg"></span>
        </div>
        
        <div class="price-container">
            <h4>Total:</h4>
            <p>A$<span id=price-${productNo}></span></p>
        </div>
    `
    return productFooter;
}

function minusQty(input, errorSpan) {
    if (checkQty(input, errorSpan) && input.value != 1){
        input.value = parseInt(input.value) - 1;
        return true;
    }

    return false;
    
}

function addQty(input, errorSpan) {
    if (checkQty(input, errorSpan)) {
        input.value = parseInt(input.value) + 1;
        return true;
    }
    return false;
}

function checkQty(input, errorSpan) {
    if (isNaN(input.value)) {
        showErrorMessage(errorSpan, "Quantity must be a number.", input);
        return false;
    }
    else if (input.value < 1) {
        showErrorMessage(errorSpan, "Quantity must be 1 or more.", input);
        return false;
    }
    else {
        hideErrorMessage(errorSpan, input);
        return true;
    }
}

function calculateProductPrice(productNo, btn, input) {
    const totalSpan = document.getElementById("price-" + productNo);
    const price = parseFloat(btn.getAttribute("data-price"));
    minusPrevPrice(totalSpan);

    const quantity = parseInt(input.value);
    totalSpan.textContent = (price * quantity).toFixed(2);
    minusFinalPrice(price * -quantity);
}

function minusPrevPrice(span) {
    if (span.textContent)
        minusFinalPrice(parseFloat(span.textContent));
}

function minusFinalPrice(price) {
    const finalPriceSpan = document.getElementById("final-price");
    const currentPrice = parseFloat(finalPriceSpan.textContent);
    finalPriceSpan.textContent = (currentPrice - price).toFixed(2);
}

function checkProductSelection() {
    const productItems = getAllProducts();
    for(var i = 0; i < productItems.length; i++) {
        const item = productItems[i];
        const itemNumber = item.id.split("-")[2];
        // Check if product option is selected
        const productOptions = document.getElementById("product-options-" + itemNumber);
        const hiddenInputOptions = productOptions.querySelector("#option-" + itemNumber);
        if (!hiddenInputOptions) {
            return false;
        }
        const errorSpan = productOptions.querySelector(".error-msg");
        if (!hiddenInputOptions.value) {
            showErrorMessage(errorSpan, "Please select an option.", null);
            return false;
        }

        const productFooter = item.querySelector(".product-footer");
        if (!productFooter) {
            return false;
        }

        const qtyError = productFooter.querySelector(".error-msg");
        if (!qtyError.hidden) {
            return false;
        }

    }

    return true;
}

function createNewProduct() {
    // If previous product 
    if (checkProductSelection())
        createProductItem(noOfProduct++);

    else {
        showToast("Please complete or fix the error on your previous product before adding.");
    }
}
// Global toast timeout variable
var toastTimeout;
function showToast(content) {
    // Get toast container
    const toast = document.getElementById("toast-container");
    // If toast already shown the dont show again
    if (toast.classList.contains("show"))
        closeToast();
    
    const toastSpan = document.getElementById("toast-span");
    toastSpan.textContent = content;
    toast.classList.add("show");
    toast.classList.remove("hide")

    // Set timeout to hide after 2 seconds
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
    }, 2000);
    
}

function closeToast() {
    // If timeout variable exists then clear timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Hide the toast
    const toast = document.getElementById("toast-container");
    toast.classList.remove("show");
    toast.classList.add("hide");
}

function getContactMethod() {
    const contactMethodRadios = document.getElementById("contact-mtd").getElementsByTagName("input");
    for (var i = 0; i < contactMethodRadios.length; i++) {
        if (contactMethodRadios[i].checked) {
            return contactMethodRadios[i];
        }
    }
}

function storeValues() {
    // Store customer personal information
    sessionStorage.firstName = document.getElementById("first-name").value;
    sessionStorage.lastName = document.getElementById("last-name").value;
    sessionStorage.emailAddress = document.getElementById("email").value;
    sessionStorage.phoneNo = document.getElementById("phone-no").value;
    sessionStorage.contactMethod = getContactMethod();

    // Store address (Shipping and billing)
    sessionStorage.shipStreet = document.getElementById("ship-street-add").value;
    sessionStorage.shipSuburb = document.getElementById("ship-street-suburb").value;
    sessionStorage.shipState = document.getElementById("ship-street-state").value;
    sessionStorage.shipPost = document.getElementById("ship-street-post").value;

    sessionStorage.isUseShipChecked = document.getElementById("use-ship-check").checked;
    // If the use shipping is checked for billing address then store billing address
    if (sessionStorage.isUseShipChecked == "true") {
        sessionStorage.billStreet = document.getElementById("bill-street-add").value;
        sessionStorage.billSuburb = document.getElementById("ship-street-suburb").value;
        sessionStorage.billState = document.getElementById("ship-street-state").value;
        sessionStorage.billPost = document.getElementById("ship-street-post").value;
    }

    // Store all products


    // Store final price

}

function resetProducts() {
    const allProducts = getAllProducts();
    [...allProducts].forEach(removeProductElems);
    
}

function removeProductElems(product) {
    
    
}

function getAllProducts() {
    const productList = document.getElementById("product-list");
    return productList.getElementsByClassName("product-item");
}

// Initialization function
function init() {
    // Initialize HTML elements
    const useShippingCheckBox = document.getElementById("use-ship-check");
    const purchaseForm = document.getElementById("purchase-form");

    // Shipping and bill elements
    const shipState = document.getElementById("ship-street-state");
    const shipPostContainer = document.getElementById("ship-post-container");

    const billState = document.getElementById("bill-street-state");
    const billPostContainer = document.getElementById("bill-post-container");

    // newProductButton
    const newProductBtn = document.getElementById("new-product");
    
    const toastClose = document.getElementById("close");

    // Change billing visibility if checkbox is checked
    checkPostAndState(shipPostContainer, shipState);
    
    changeBillingVisibility(useShippingCheckBox, billPostContainer, true);
    // Shipping and billing events (Check postcode based on state)
    shipState.onchange = () => checkPostAndState(shipPostContainer, shipState);
    shipPostContainer.getElementsByTagName("input")[0].oninput = () => checkPostAndState(shipPostContainer, shipState);

    billState.onchange = () => checkPostAndState(billPostContainer, billState);
    billPostContainer.getElementsByTagName("input")[0].oninput = () => checkPostAndState(billPostContainer, billState);
    
    // On submit event for purchase form
    purchaseForm.onsubmit = checkInput;
    purchaseForm.onreset = resetProducts;
    // On click event to display and hide billing address section
    useShippingCheckBox.onclick = () => changeBillingVisibility(useShippingCheckBox, billPostContainer, false);

    // Set default 1 product on product list
    createProductItem(noOfProduct++);

    // On click event for new product button
    newProductBtn.onclick = () => createNewProduct();

    // On click event for close toast
    toastClose.onclick = closeToast;
}

window.onload = init;