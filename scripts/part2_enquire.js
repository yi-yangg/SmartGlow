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
        // Check if first digit is in the mapped array
        if (stateToPostMapping[state].includes(firstDigit)) {
            hideErrorMessage(postErrorSpan, postInput);
        }
        else {
            showErrorMessage(postErrorSpan, "Postcode does not match the selected state.", postInput);
        }
    }
}

function checkInput() {
    // Check if product selection is valid
    checkProductSelection();

    // Check billing address is valid
    checkBillingAddress();
    
    if (!checkErrorSpan()) {
        return false;
    }
    
    storeValues();
    return true;
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

function createNewProduct() {
    // If previous product 
    if (checkProductSelection())
        createProductItem(noOfProduct++);

    else {
        showToast("Please complete or fix the error on your previous product before adding.");
    }
}


function getContactMethod() {
    // Get all radios in contact method fieldset
    const contactMethodRadios = document.getElementById("contact-mtd").getElementsByTagName("input");
    // Loop all radios and check which is checked
    for (var i = 0; i < contactMethodRadios.length; i++) {
        if (contactMethodRadios[i].checked) {
            return contactMethodRadios[i].value;
        }
    }
}

function storeValues() {
    // Store customer personal information
    localStorage.firstName = document.getElementById("first-name").value;
    localStorage.lastName = document.getElementById("last-name").value;
    localStorage.emailAddress = document.getElementById("email").value;
    localStorage.phoneNo = document.getElementById("phone-no").value;
    localStorage.contactMethod = getContactMethod();

    // Store address (Shipping and billing)
    localStorage.shipStreet = document.getElementById("ship-street-add").value;
    localStorage.shipSuburb = document.getElementById("ship-street-suburb").value;
    localStorage.shipState = document.getElementById("ship-street-state").value;
    localStorage.shipPost = document.getElementById("ship-street-post").value;

    localStorage.isUseShipChecked = document.getElementById("use-ship-check").checked;
    // If the use shipping is checked for billing address then store billing address
    if (localStorage.isUseShipChecked == "false") {
        localStorage.billStreet = document.getElementById("bill-street-add").value;
        localStorage.billSuburb = document.getElementById("bill-street-suburb").value;
        localStorage.billState = document.getElementById("bill-street-state").value;
        localStorage.billPost = document.getElementById("bill-street-post").value;
    }

    // Store all products
    const allProductsList = getAllProducts();
    const selectedProductList = [];
    const selectedProductOptions = [];
    const selectedProductQty = [];
    const selectedProductTotalPrice = [];

    [...allProductsList].forEach(product => {
        const itemNumber = product.id.split("-")[2];
        // Add product into selected product list
        selectedProductList.push(document.getElementById("product-" + itemNumber).value);

        // Add product options into list
        selectedProductOptions.push(document.getElementById("option-" + itemNumber).value);

        // Add selected quantity into list
        selectedProductQty.push(document.getElementById("quantity-" + itemNumber).value);

        // Add total price of product into list
        selectedProductTotalPrice.push(document.getElementById("price-" + itemNumber).textContent);
    })

    // Store product list into localStorage
    localStorage.allProductName = selectedProductList.join(", ");
    localStorage.allProductOptions = selectedProductOptions.join(", ");
    localStorage.allProductQuantity = selectedProductQty.join(", ");
    localStorage.allProductPrice = selectedProductTotalPrice.join(", ");

    // Store final price
    localStorage.finalPrice = document.getElementById("final-price").textContent;

    // Additional comments
    localStorage.comment = document.getElementById("comment").value;

    // Add time when payment is pressed
    const paymentTime = new Date().getTime();
    localStorage.paymentStartTime = paymentTime;

    
}

function resetForm() {
    // Reset all products by removing elements
    const allProducts = getAllProducts();
    [...allProducts].forEach(removeProductElems);

    // Reset price
    const finalPrice = document.getElementById("final-price");
    finalPrice.textContent = "0.00";

    // Show billing address fields
    const billingContainer = document.getElementById("bill-address-container");
    billingContainer.hidden = false;

    // Reset error span for shipping address postcode
    const shipPostContainer = document.getElementById("ship-post-container");
    const shipPostInput = shipPostContainer.querySelector("#ship-street-post");
    const shipPostError = shipPostContainer.querySelector(".error-msg");
    hideErrorMessage(shipPostError, shipPostInput);

    // Reset all billing 
    hideAllBillingErrors();
}

function removeProductElems(product) {
    const itemNumber = product.id.split("-")[2];

    // Remove product options on reset form
    const productOption = document.getElementById("product-options-" + itemNumber);

    productOption.innerHTML = "";

    // Remove product footer
    const productFooter = product.querySelector(".product-footer");
    if (productFooter) {
        productFooter.remove();
    }

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
    purchaseForm.onreset = resetForm;
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