const yInput = document.getElementById("Y-choice");
const xGroup = document.querySelector('input[name="X-radio-group"]')
const rGroup = document.querySelector('input[name="R-checkbox-group"]');

function validateYInput(y) {
    const yFloat = parseFloat(y);
    if (isNaN(yFloat)) {
        yInput.setCustomValidity("Y должен быть числом");
        yInput.reportValidity();
        return false;
    } else {
        yInput.setCustomValidity("");
        yInput.reportValidity();
    }
    if (yFloat < -3 || yFloat > 5) {
        yInput.setCustomValidity("Y должен быть числом от -3 до 5");
        yInput.reportValidity();
        return false;
    }
    return true;
}

function validateXChoice() {
    const selectedX = document.querySelector('input[name="X-radio-group"]:checked');
    if (!selectedX) {
        xGroup.setCustomValidity("выберите одно из значений X");
        xGroup.reportValidity();
        return false;
    } else {
        xGroup.setCustomValidity("");
        xGroup.reportValidity();
    }
    return true;
}

function validateRChoice() {
    const selectedRs = document.querySelectorAll('input[name="R-checkbox-group"]:checked');
    if (selectedRs.length === 0) {
        rGroup.setCustomValidity('выберите хотя бы одно значение R');
        rGroup.reportValidity();
        return false;
    } else {
        rGroup.setCustomValidity("");
        rGroup.reportValidity();
    }
    return true;
}

yInput.addEventListener('input', function () {
    validateYInput(this.value);
    const parts = this.value.split('.');
    if (parts[1] && parts[1].length > 3) {
        parts[1] = parts[1].slice(0, 3); // обрезаем до 3 знаков после запятой
        this.value = parts.join('.');
    }
});