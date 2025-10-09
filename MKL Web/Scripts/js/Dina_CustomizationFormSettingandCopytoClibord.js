///// General Functions

function showCustomAlert(message, duration = 2000) {
    const alertBox = document.getElementById("custom-alert");
    alertBox.textContent = message;
    alertBox.style.display = "block";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, duration);
}

function copyTableToClipboard(tableId, startIndex = 0, reportName = null) {
    const table = document.getElementById(tableId);
    if (!table) {
        alert("Table not found!");
        return;
    }

    const visibleRows = Array.from(table.rows).filter(row => isElementVisible(row));
    if (visibleRows.length === 0) {
        showCustomAlert("No data to copy!");
        return;
    }

    const data = [];

    // Add report name/title as first line if provided
    if (reportName && typeof reportName === "string") {
        data.push(reportName.trim());
    }

    visibleRows.forEach(row => {
        const cells = Array.from(row.cells).filter(cell => isElementVisible(cell));
        const rowData = cells
            .slice(startIndex)
            .map(cell => {
                const input = cell.querySelector('input');
                const select = cell.querySelector('select');

                if (input) return input.value?.trim() || '';
                if (select) return select.options[select.selectedIndex]?.text?.trim() || '';
                return cell.innerText.trim();
            })
            .join('\t');

        data.push(rowData);
    });

    navigator.clipboard.writeText(data.join('\n'))
        .then(() => showCustomAlert("Copied! You can now paste it into Excel."))
        .catch(err => {
            console.error("Copy failed", err);
            showCustomAlert("Copy failed: " + err, 3000);
        });
}




function toggleChangePeriodTable() {
    const wrapper = document.getElementById("changePeriod_table_wrapper");
    const icon = document.getElementById("changePeriod_penalty_icon");

    if (wrapper.style.display === "none") {
        wrapper.style.display = "block";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
    } else {
        wrapper.style.display = "none";
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
    }
}

function toggleChangeAmountTable() {
    const wrapper = document.getElementById("changeAmount_table_wrapper");
    const icon = document.getElementById("toggle_changeAmount_icon");

    if (wrapper.style.display === "none") {
        wrapper.style.display = "block";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
    } else {
        wrapper.style.display = "none";
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
    }
}

function toggleCustomTable() {
    var wrapper = document.getElementById("customer_table_wrapper");
    var icon = document.getElementById("toggle_icon");

    if (wrapper.style.display === "none") {
        wrapper.style.display = "block";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
    } else {
        wrapper.style.display = "none";
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
    }
}

function toggleItemTable() {
    var wrapper = document.getElementById("item_table_wrapper");
    var icon = document.getElementById("toggle_icon");

    if (wrapper.style.display === "none") {
        wrapper.style.display = "block";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
    } else {
        wrapper.style.display = "none";
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
    }
}

///// Column Visibility Settings

// Optional: define starting column index per table if you want to skip some fixed columns
// e.g., skip first 1 or 2 columns for row number or checkboxes
const startingColumnIndexByTable = {
    "table_payment_schedule": 3, // Adjust as needed
    "table_payment_schedule_restructureAmt": 1 // Adjust as needed
};

// Get localStorage key for column visibility per table
function getStorageKey(tableId) {
    return `table_column_visibility_${tableId}`;
}

// Check if element is visible (for filtering)
function isElementVisible(el) {
    return !!(el.offsetParent !== null && getComputedStyle(el).display !== "none");
}

// Dynamically get column names from table header (thead)
function getColumnNamesFromTable(tableId, startingIndex = 0) {
    const table = document.getElementById(tableId);
    if (!table) return [];

    const headerRow = table.querySelector("thead tr");
    if (!headerRow) return [];

    const headers = Array.from(headerRow.cells).slice(startingIndex).map(cell => cell.innerText.trim());
    return headers;
}

// Build checkboxes dynamically from actual table header columns
function buildColumnSettingsCheckboxes(tableId) {
    const startingColumnIndex = startingColumnIndexByTable[tableId] || 0;
    const columnNames = getColumnNamesFromTable(tableId, startingColumnIndex);
    const saved = JSON.parse(localStorage.getItem(getStorageKey(tableId)) || '{}');
    const container = document.getElementById("columnCheckboxes");
    container.innerHTML = "";

    columnNames.forEach((name, idx) => {
        const colIndex = startingColumnIndex + idx;
        const checked = saved.hasOwnProperty(colIndex) ? saved[colIndex] : true;
        const row = document.createElement("div");
        row.innerHTML = `
            <label>
                <input type="checkbox" class="col-toggle" data-col="${colIndex}" ${checked ? 'checked' : ''}>
                ${name}
            </label>`;
        container.appendChild(row);
    });
}

// Apply saved column visibility settings to the table
function applySavedColumnSettings(tableId) {
    const startingColumnIndex = startingColumnIndexByTable[tableId] || 0;
    const columnNames = getColumnNamesFromTable(tableId, startingColumnIndex);
    const saved = JSON.parse(localStorage.getItem(getStorageKey(tableId)) || '{}');
    const table = document.getElementById(tableId);
    if (!table || !table.rows.length) return;

    for (let idx = 0; idx < columnNames.length; idx++) {
        const colIndex = startingColumnIndex + idx;
        const visible = saved.hasOwnProperty(colIndex) ? saved[colIndex] : true;
        for (let row of table.rows) {
            if (row.cells.length > colIndex) {
                row.cells[colIndex].style.display = visible ? '' : 'none';
            }
        }
    }
}

// Open the modal dialog for column settings
function openColumnSettings(tableId) {
    buildColumnSettingsCheckboxes(tableId);
    const modal = document.getElementById("columnSettingsModal");
    modal.dataset.tableId = tableId;
    modal.classList.add("show");
}

// Close the column settings modal
function closeColumnSettings() {
    document.getElementById("columnSettingsModal").classList.remove("show");
}

// Save user column visibility settings to localStorage and apply them
function saveColumnSettings() {
    const modal = document.getElementById("columnSettingsModal");
    const tableId = modal.dataset.tableId;
    const settings = {};

    document.querySelectorAll(".col-toggle").forEach(cb => {
        const col = parseInt(cb.getAttribute("data-col"), 10);
        settings[col] = cb.checked;
    });

    localStorage.setItem(getStorageKey(tableId), JSON.stringify(settings));
    applySavedColumnSettings(tableId);
    closeColumnSettings();
}

// Reset to show all columns and clear saved settings
function resetColumnSettings() {
    const modal = document.getElementById("columnSettingsModal");
    const tableId = modal.dataset.tableId;

    localStorage.removeItem(getStorageKey(tableId));

    const table = document.getElementById(tableId);
    if (!table) return;

    const startingColumnIndex = startingColumnIndexByTable[tableId] || 0;
    const columnNames = getColumnNamesFromTable(tableId, startingColumnIndex);

    for (let row of table.rows) {
        for (let i = startingColumnIndex; i < startingColumnIndex + columnNames.length; i++) {
            if (row.cells.length > i) {
                row.cells[i].style.display = '';
            }
        }
    }

    openColumnSettings(tableId); // Rebuild checkboxes after reset
}

///// Event Listeners

document.addEventListener("DOMContentLoaded", function () {
    applySavedColumnSettings("table_payment_schedule");
    applySavedColumnSettings("table_payment_schedule_restructureAmt");
});

document.addEventListener("change", function (e) {
    if (e.target.classList.contains("col-toggle")) {
        const colIndex = parseInt(e.target.dataset.col, 10);
        const isChecked = e.target.checked;

        const modal = document.getElementById("columnSettingsModal");
        const tableId = modal.dataset.tableId;
        const table = document.getElementById(tableId);

        if (!table) return;

        for (let row of table.rows) {
            if (row.cells.length > colIndex) {
                row.cells[colIndex].style.display = isChecked ? '' : 'none';
            }
        }

        const saved = JSON.parse(localStorage.getItem(getStorageKey(tableId)) || '{}');
        saved[colIndex] = isChecked;
        localStorage.setItem(getStorageKey(tableId), JSON.stringify(saved));
    }
});
