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
function changeBillingVisibility(checkBox, billingPostContainer) {
    const billingContainer = document.getElementById("bill-address-container");
    // If checkbox checked then hide the container
    if (checkBox.checked) {
        billingContainer.hidden = true 
        // Hide the error message if billing container hidden
        hideErrorMessage(billingPostContainer.getElementsByTagName("span")[0], billingPostContainer.getElementsByTagName("input")[0]);
    }
    else {
        billingContainer.hidden = false;
        // Recheck postcode and state when unchecked
        checkPostAndState(billingPostContainer, document.getElementById("bill-street-state"));
    }
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
    const getAllErrorSpan = document.getElementsByClassName("error-msg");
    var hasError = false;
    var firstErrorElem;
    [...getAllErrorSpan].forEach((errorSpan) => {
        // If has error then errorSpan.hidden = false
        hasError ||= !errorSpan.hidden;
        // If error and first error element is empty then scroll to the div container with ID
        if (!errorSpan.hidden && !firstErrorElem) {
            // Get parent div of error span and scroll to the div
            document.getElementById(errorSpan.parentElement.id).scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    return !hasError;


    
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

    // Change billing visibility if checkbox is checked
    checkPostAndState(shipPostContainer, shipState);
    
    changeBillingVisibility(useShippingCheckBox, billPostContainer);
    // Shipping and billing events (Check postcode based on state)
    shipState.onchange = () => checkPostAndState(shipPostContainer, shipState);
    shipPostContainer.getElementsByTagName("input")[0].onblur = () => checkPostAndState(shipPostContainer, shipState);

    billState.onchange = () => checkPostAndState(billPostContainer, billState);
    billPostContainer.getElementsByTagName("input")[0].onblur = () => checkPostAndState(billPostContainer, billState);
    
    // On submit event for purchase form
    purchaseForm.onsubmit = checkInput;

    // On click event to display and hide billing address section
    useShippingCheckBox.onclick = () => changeBillingVisibility(useShippingCheckBox, billPostContainer);
}

window.onload = init;