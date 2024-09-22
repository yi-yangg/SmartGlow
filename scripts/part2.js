/**
 * Author: Chong Yi Yang
 * Target:
 * Purpose:
 * Created:
 * Last updated:
 * Credits: 
 */

"use strict"

function showErrorMessage(errorSpan, errorMsg, errorInput) {
    errorSpan.textContent = errorMsg;
    errorSpan.hidden = false;
    if (errorInput)
        errorInput.style.borderColor = "red";
}

function hideErrorMessage(errorSpan, errorInput) {
    errorSpan.textContent = "";
    errorSpan.hidden = true;
    if (errorInput)
        errorInput.style.borderColor = "";
}