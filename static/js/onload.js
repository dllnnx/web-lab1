document.addEventListener('DOMContentLoaded', function () {
    // изначальная отрисовка канвы
    let canvasPrinter = new CanvasPainter();
    canvasPrinter.redrawAll(0);


    const submitButton = document.getElementById("submit-button");
    const clearButton = document.getElementById("clear-button");
    const yInput = document.getElementById("Y-choice");
    const xRadios = document.querySelectorAll('#X-choice input[type="radio"]');
    const rCheckboxes = document.querySelectorAll('#R-choice input[type="checkbox"]');
    const resultTable = document.getElementById("result-table");


    // отправка запроса по нажатию "проверить"
    function sendRequest(x, y, r) {
        $.ajax({
            url: `http://localhost:24147/fcgi-bin/app.jar?x=${x}&y=${y}&r=${r}`,
            type: 'POST',
            dataType: 'text',
            success: function (response) {
                const data = JSON.parse(response);
                console.log(data);
                canvasPrinter.drawPoint(x, y, data.result);
                fillTable(data);
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    function validateYInput(y) {
        const yFloat = parseFloat(y);
        if (isNaN(yFloat)) {
            yInput.setCustomValidity("Y должен быть числом.");
            yInput.reportValidity();
            return false;
        }
        if (yFloat < -3 || yFloat > 5) {
            yInput.setCustomValidity("Y должен быть числом от -3 до 5.");
            yInput.reportValidity();
            return false;
        }
        return true;
    }

    yInput.addEventListener('input', function (e) {
        validateYInput(this.value);
        const parts = this.value.split('.');
        if (parts[1] && parts[1].length > 3) {
            parts[1] = parts[1].slice(0, 3); // обрезаем до 3 знаков после запятой
            this.value = parts.join('.');
        }
    });


    function handleSubmit() {
        const x = document.querySelector('input[name="X-radio-group"]:checked').value;
        const y = yInput.value;
        const selectedRs = document.querySelectorAll('input[name="R-checkbox-group"]:checked');
        const r = selectedRs[selectedRs.length - 1].value;
        if (!validateYInput(y)) {
            return;
        }
        sendRequest(x, y, r);
    }
    submitButton.addEventListener("click", handleSubmit);


    // очистка полей по нажатию "очистить"
    function clearSelection() {
        xRadios.forEach(radio => radio.checked = false);
        yInput.value = '';
        rCheckboxes.forEach(checkbox => checkbox.checked = false);
        canvasPrinter.redrawAll(0);
    }
    clearButton.addEventListener("click", clearSelection);


    // отрисовка канвы при изменении R
    let lastChecked = null;
    function handleCheckboxChange(event) {
        const currentCheckbox = event.target;
        if (lastChecked && lastChecked !== currentCheckbox) {
            lastChecked.checked = false;
        }
        lastChecked = currentCheckbox.checked ? currentCheckbox : null;
        canvasPrinter.redrawAll(currentCheckbox.value);
    }

    rCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });

    function fillTable(data) {
        const newRow = resultTable.insertRow()
        newRow.insertCell(0).textContent = data.x;
        newRow.insertCell(1).textContent = data.y;
        newRow.insertCell(2).textContent = data.r;

        const resultCell = newRow.insertCell(3);
        resultCell.textContent = data.result ? 'попал!' : 'промах! задело только ухо';
        if (data.result) {
            resultCell.classList.add('success');
        } else {
            resultCell.classList.add('fail');
        }

        newRow.insertCell(4).textContent = new Date().toLocaleString();
    }
});
