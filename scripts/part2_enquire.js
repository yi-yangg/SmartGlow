/**
 * Author: Chong Yi Yang
 * Target: enquire.html
 * Purpose: Control and validate the form elements in enquire.html
 * Created: 13/9/2024
 * Last updated: 19/9/2024
 * Credits: 
 */

"use strict"


// Function to change visibility of Billing section
function changeBillingVisibility() {
    const billingContainer = document.getElementById("bill-address-container");
    // If checkbox checked then hide the container
    this.checked ? billingContainer.setAttribute("hidden", "true") : billingContainer.removeAttribute("hidden");
}

function checkPostAndState(postContainer, stateElem) {
    // Get post address container elements
    const postInput = postContainer.getElementsByTagName("input")[0];
    const postErrorSpan = postContainer.getElementsByTagName("span")[0];
    
    const state = stateElem.value;
    const postcode = postInput.value

    // If both Postcode and State value are valid
    if (postcode && state) {
        const firstDigit = postcode.charAt(0);
        var isValid = false;

        // Check postcode based on state selected
        switch (state) {
            case "VIC":
                isValid = firstDigit === "3" || firstDigit === "8";
                break;
            case "NSW":
                isValid = firstDigit === "1" || firstDigit === "2";
                break;
            case "QLD":
                isValid = firstDigit === "4" || firstDigit === "9";
                break;
            case "NT":
            case "ACT":
                isValid = firstDigit === "0";
                break;
            case "WA":
                isValid = firstDigit === "6";
                break;
            case "SA":
                isValid = firstDigit === "5";
                break;
            case "TAS":
                isValid = firstDigit === "7";
                break;
            default:
                isValid = false;
        }

        if (!isValid) {
            showErrorMessage(postErrorSpan, "Postcode does not match the selected state.", postInput);
        }
    }
}

function checkInput() {

}

// Initialization function
function init() {
    // Initialize HTML elements
    const useShippingCheckBox = document.getElementById("use-ship-check");
    const purchaseForm = document.getElementById("purchase-form");

    purchaseForm.onsubmit = checkInput;

    const shipState = document.getElementById("ship-street-state");
    const shipPostContainer = document.getElementById("ship-post-container");

    shipState.onchange = () => checkPostAndState(shipPostContainer, shipState);



    useShippingCheckBox.onclick = changeBillingVisibility;
}

window.onload = init;