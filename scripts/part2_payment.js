/**
 * Author: Chong Yi Yang
 * Target: payment.html
 * Purpose: Allow user to pay for selected products in enquire page
 * Created: 13/9/2024
 * Last updated: 19/9/2024
 * Credits: 
 */

"use strict"

function fillProductItems() {
    // Get cart list container
    const cartList = document.getElementById("cart-list");

    // Get all stored product data
    const productNames = localStorage.allProductName.split(", ");
    const productOptions = localStorage.allProductOptions.split(", ");
    const productQuantities = localStorage.allProductQuantity.split(", ");
    const productPrices = localStorage.allProductPrice.split(", ");

    // Create product name mapping to actual name
    const productNameMap = {
        "light-bulbs" : "Smart Light Bulb",
        "leds" : "Smart LED Strips",
        "light-strips" : "Smart Flexi Light"
    }
    // Loop through each product and add to cart list
    productNames.forEach((productName, index) => {
        // Create container for each product
        const productCard = document.createElement("div");
        productCard.classList.add("product-item");

        // Get actual name from map
        const productActualName = productNameMap[productName];
        // Make product option upper case
        const productOption = productOptions[index].toUpperCase();
        // Add product details with HTML
        productCard.innerHTML = `
            <div class="product-details">
                <h5>${productActualName}</h5>
                <div class="product-data">
                    <span>${productOption}</span>
                    <span>Quantity: ${productQuantities[index]}</span>
                </div>
                <div class="product-price">
                    <span>A$${productPrices[index]}</span>
                </div>
            </div>
        `
        // Add to cart list
        cartList.appendChild(productCard);
    })


}

function fillCustomerInfo() {
    const fullName = localStorage.firstName + " " + localStorage.lastName;
    document.getElementById("full-name").textContent = fullName;

    document.getElementById("email-span").textContent = localStorage.emailAddress;
    document.getElementById("phone").textContent = localStorage.phoneNo;
    const contactMethod = localStorage.contactMethod;
    // Make first character upper case
    document.getElementById("contact-method-span").textContent = contactMethod.charAt(0).toUpperCase() + contactMethod.substring(1);
}

function checkShipAndBillAddress() {
    fillAddress("ship");

    const isBillSameAsShip = localStorage.isUseShipChecked == "true";
    
    if (isBillSameAsShip) {
        const deliveryAddress = document.getElementById("delivery-address");
        deliveryAddress.querySelector("h4").textContent = "Shipping & Billing Address";

        // Hide bill address container
        const billAddress = document.getElementById("billing-address");
        billAddress.hidden = true;
    }
    else {
        fillAddress("bill");
    }
}

function fillAddress(type) {
    const addressSpan = document.getElementById(type + "-add");

    const fullAddress = `${localStorage[type+"Street"]}, ${localStorage[type+"Suburb"]}, ${localStorage[type+"State"]}, ${localStorage[type+"Post"]}`

    addressSpan.textContent = fullAddress;
}


function fillReadonlyDetails() {
    // Fill customer info
    fillCustomerInfo();

    // Fill ship and bill address
    checkShipAndBillAddress();

    // Fill product items
    fillProductItems();

    // Fill comments
    const comment = document.getElementById("comments-span");
    comment.textContent = localStorage.comment;

    // Fill subtotal
    const subtotal = document.getElementById("subtotal");
    subtotal.textContent = localStorage.finalPrice;
    
}

function fillHiddenInput() {
    // Fill hidden inputs
    document.getElementById("first-name").value = localStorage.firstName;
    document.getElementById("last-name").value = localStorage.lastName;
    document.getElementById("email").value = localStorage.emailAddress;
    document.getElementById("phone-no").value = localStorage.phoneNo;
    document.getElementById("contact-method").value = localStorage.contactMethod;
    document.getElementById("ship-street-add").value = localStorage.shipStreet;
    document.getElementById("ship-street-suburb").value = localStorage.shipSuburb;
    document.getElementById("ship-street-state").value = localStorage.shipState;
    document.getElementById("ship-street-post").value = localStorage.shipPost;
    document.getElementById("use-ship-check").value = localStorage.isUseShipChecked;
    
    // If billing address different from shipping then create hidden billing input
    if (document.getElementById("use-ship-check").value == "false") {
        createHiddenBillingInput();
    }

    // Create and fill hidden inputs for product
    createHiddenProductInput();

    // Create and fill hidden final price input
    createHiddenInput("final-price", localStorage.finalPrice);

    // Create hidden comment input
    createHiddenInput("comment", localStorage.comment);
}

function createHiddenProductInput() {
    const productList = localStorage.allProductName.split(", ");
    const optionsList = localStorage.allProductOptions.split(", ");
    const quantityList = localStorage.allProductQuantity.split(", ");
    const priceList = localStorage.allProductPrice.split(", ");

    for (var i = 0; i < productList.length; i++) {
        createHiddenInput("product-" + (i + 1), productList[i]);
        createHiddenInput("option-" + (i + 1), optionsList[i]);
        createHiddenInput("quantity-" + (i + 1), quantityList[i]);
        createHiddenInput("price-" + (i + 1), priceList[i]);
    }
}

function createHiddenBillingInput() {
    // bill street address
    createHiddenInput("bill-street-add", localStorage.billStreet);
    // bill street suburb
    createHiddenInput("bill-street-suburb", localStorage.billSuburb);
    // bill street state
    createHiddenInput("bill-street-state", localStorage.billState);
    // bill street post
    createHiddenInput("bill-street-post", localStorage.billPost);

}

function createHiddenInput(id, value) {
    const paymentForm = document.getElementById("payment-form");
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = hiddenInput.name = id;

    hiddenInput.value = value;

    paymentForm.appendChild(hiddenInput);
}

function getSelectedRadio(cardTypeRadios) {

    for (var i = 0; i < cardTypeRadios.length; i++) {
        if (cardTypeRadios[i].checked)
            return cardTypeRadios[i].value;
    }
}

function checkCardTypeSelected() {
    const [cardTypeRadios, cardTypeError] = getCardTypeElems();
    
    const radioSelected = getSelectedRadio(cardTypeRadios);

    if (radioSelected) {
        hideErrorMessage(cardTypeError, null);
    }
    else {
        showErrorMessage(cardTypeError, "Please select a card type.", null);
    }
    
}

function getErrorSpanFromContainer(container) {
    return container.querySelector(".error-msg");
}

function getCardTypeElems() {
    const cardTypeOptions = document.getElementById("card-type-options");
    const cardTypeRadios = cardTypeOptions.getElementsByTagName("input");
    const cardTypeContainer = document.getElementById("card-type-container");

    return [cardTypeRadios, getErrorSpanFromContainer(cardTypeContainer)];

}

function checkCardName() {
    // Get variables
    const [cardNameInput, cardNameError] = getFieldInputElems("card-name");

    const alphaSpaceRegex = /^[a-zA-Z ]+$/;

    // Check empty input
    if (!cardNameInput.value) {
        showErrorMessage(cardNameError, "Name on card cannot be empty.", cardNameInput);
    }
    // Check max 40 characters
    else if (cardNameInput.value.length > 40) {
        showErrorMessage(cardNameError, "Name on card cannot exceed 40 characters.", cardNameInput);
    }
    // Check alphabets and space
    else if (!cardNameInput.value.match(alphaSpaceRegex)) {
        showErrorMessage(cardNameError, "Name on card can only have alphabets or spaces.", cardNameInput);
    }
    // Check if name matches the readonly name
    else if (!doesNameMatch(document.getElementById("full-name").textContent, cardNameInput.value)) {
        showErrorMessage(cardNameError, "Name on card does not match with the given name.", cardNameInput);
    }
    else {
        hideErrorMessage(cardNameError, cardNameInput);
    }

}

function doesNameMatch(readOnlyName, nameToCheck) {
    const readOnlyNameParts = readOnlyName.split(" ");
    const checkNameParts = nameToCheck.split(" ");

    checkNameParts.forEach(nameParts => {
        const index = readOnlyNameParts.indexOf(nameParts);
        if (index !== -1)
            readOnlyNameParts.splice(index, 1); // Remove 1 element from the index
        
    });

    return readOnlyNameParts.length === 0;

}

function getFieldInputElems(fieldType) {
    const cardNameInput = document.getElementById(fieldType);
    const cardNameContainer = document.getElementById(fieldType + "-container");

    return [cardNameInput, getErrorSpanFromContainer(cardNameContainer)];

}

function checkCardNumber() {
    const [cardNoInput, cardNoError] = getFieldInputElems("card-number");

    const [radios, _] = getCardTypeElems();
    // Get the card type
    const selectedCardType = getSelectedRadio(radios);
    // Replace all the spaces with empty string
    const cleanedInput = cardNoInput.value.replaceAll(" ", "");
    
    const digitsRegex = /^[0-9 ]+$/

    if (!cleanedInput) {
        showErrorMessage(cardNoError, "Card number cannot be empty.", cardNoInput);
    }
    else if (!cleanedInput.match(digitsRegex)) {
        showErrorMessage(cardNoError, "Card number can only have digits and spaces.", cardNoInput);
    }
    else if (![15,16].includes(cleanedInput.length)) {
        showErrorMessage(cardNoError, "Invalid card number length (Only 15 or 16).", cardNoInput);
    }
    else if (!selectedCardType) {
        showErrorMessage(cardNoError, "No card type selected.", cardNoInput);
    }
    else {
        validateCardNoWithType(selectedCardType, cardNoInput, cardNoError);
    }


}

function validateCardNoWithType(cardType, cardInput, cardError) {
    const cleanedInput = cardInput.value.replaceAll(" ", "");
    const first2 = cleanedInput.substring(0, 2);
    switch (cardType) {
        case "visa":
            // If card type is visa, input length must be 16 and first digit 4
            
            if (cleanedInput.length != 16 || cleanedInput[0] !== "4") {
                showErrorMessage(cardError, "Invalid Visa format.", cardInput);
                return;
            }
            break;
        case "mastercard":
            // If card type is mastercard, input length must be 16 and first 2 digits between 51 and 55
            
            if (cleanedInput.length != 16 || (first2 < 51 || first2 > 55)) {
                showErrorMessage(cardError, "Invalid MasterCard format.", cardInput);
                return;
            }
            break;
        case "amex":
            // If amex, input length must be 15 and first 2 digits either 34 or 37
            if (cleanedInput.length != 15 || (first2 != 34 && first2 != 37)) {
                showErrorMessage(cardError, "Invalid American Express format.", cardInput);
                return;
            }
            break;
        default:
            showErrorMessage(cardError, "Invalid card type.", cardInput);
            return;
    }
    hideErrorMessage(cardError, cardInput);
}

function checkCardExpiry() {
    const [expiryInput, expiryError] = getFieldInputElems("expiry-date");
    
    // Regex for expiry date format 01 to 12 for month and any 2 digits for year
    const expiryRegex = /^(0[1-9]|1[0-2])-(\d{2})$/

    if (!expiryInput.value) {
        showErrorMessage(expiryError, "Card expiry date cannot be empty", expiryInput);
    }
    else if (!expiryInput.value.match(expiryRegex)) {
        showErrorMessage(expiryError, "Invalid format or month (Use MM-YY format).", expiryInput);
    }
    else {
        // Split expiry string and map string value to Number function to convert string to number
        const [expMonth, expYear] = expiryInput.value.split("-").map(Number);

        // Get today's month and year
        const today = new Date();
        // get month function returns value 0 to 11
        const month = today.getMonth() + 1;
        // Get the last 2 digits of year
        const year = today.getFullYear() % 100;

        // Check if expiry year is in the past or if year is the same, if the month is in the past
        if (expYear < year || (expYear === year && expMonth < month)) {
            showErrorMessage(expiryError, "The card provided has expired.", expiryInput);
        }
        else {
            hideErrorMessage(expiryError, expiryInput);
        }
    }
}

function checkCardCVV() {
    const [cvvInput, cvvError] = getFieldInputElems("cvv");
    const digitRegex = /^\d+$/
    if (!cvvInput.value) {
        showErrorMessage(cvvError, "Card CVV cannot be empty.", cvvInput);
    }
    else if (cvvInput.value.length !== 3){
        showErrorMessage(cvvError, "Invalid CVV length (Only 3).", cvvInput);
    }
    else if (!cvvInput.value.match(digitRegex)) {
        showErrorMessage(cvvError, "Card CVV can only contain digits.", cvvInput);
    }
    else {
        hideErrorMessage(cvvError, cvvInput);
    }
}


function validateFields() {
    checkCardTypeSelected();
    checkCardName();
    checkCardNumber();
    checkCardExpiry();
    checkCardCVV();

    if (!checkErrorSpan()) {
        return false;
    }

    cancelPayment();
    return true;
}

function init() {
    // If session storage is valid then fill read only details and hidden input
    if (localStorage.firstName) {
        fillReadonlyDetails();

        fillHiddenInput();
    }
    

    // Set on click events for card type radios
    const [cardTypeRadios, cardTypeError] = getCardTypeElems();
    // Use spread operator to convert HTMLCollection to array and use forEach to assign onclick event
    [...cardTypeRadios].forEach(radio => radio.onclick = () => hideErrorMessage(cardTypeError, null));

    // Set on input event for card name input to remove error message
    const [cardNameInput, cardNameError] = getFieldInputElems("card-name");
    cardNameInput.oninput = () => hideErrorMessage(cardNameError, cardNameInput);

    // Set on input event for card no input to remove error message
    const [cardNoInput, cardNoError] = getFieldInputElems("card-number");
    cardNoInput.oninput = () => hideErrorMessage(cardNoError, cardNoInput);

    const [expiryInput, expiryError] = getFieldInputElems("expiry-date");
    expiryInput.oninput = () => hideErrorMessage(expiryError, expiryInput);

    const [cvvInput, cvvError] = getFieldInputElems("cvv");
    cvvInput.oninput = () => hideErrorMessage(cvvError, cvvInput);

    const paymentForm = document.getElementById("payment-form");
    paymentForm.onsubmit = validateFields;

    const cancelButton = document.getElementById("cancelBtn");
    cancelButton.onclick = cancelPayment;
}

window.onload = init;