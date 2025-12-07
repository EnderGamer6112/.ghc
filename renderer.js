let chartInstance = null;
let appData = [
    { label: 'Item 1', value: 10 },
    { label: 'Item 2', value: 20 },
    { label: 'Item 3', value: 15 }
];

const tableBody = document.querySelector('#data-table tbody');
const btnAddRow = document.getElementById('btn-add-row');
const btnImportExcel = document.getElementById('btn-import-excel');
const fileExcel = document.getElementById('file-excel');
const btnSaveGhc = document.getElementById('btn-save-ghc');
const btnLoadGhc = document.getElementById('btn-load-ghc');
const ctx = document.getElementById('myChart').getContext('2d');

// Initialize
function init() {
    renderTable();
    initChart();
    setupEventListeners();
}

function setupEventListeners() {
    btnAddRow.addEventListener('click', () => {
        appData.push({ label: 'New Item', value: 0 });
        renderTable();
        updateChart();
    });

    btnImportExcel.addEventListener('click', () => {
        fileExcel.click();
    });

    fileExcel.addEventListener('change', handleExcelUpload);

    btnSaveGhc.addEventListener('click', async () => {
        const result = await window.electronAPI.saveGhc(appData);
        if (result.success) {
            alert('Saved to ' + result.filePath);
        }
    });

    btnLoadGhc.addEventListener('click', async () => {
        const result = await window.electronAPI.loadGhc();
        if (result.success) {
            appData = result.data;
            renderTable();
            updateChart();
        }
    });
}

function renderTable() {
    tableBody.innerHTML = '';
    appData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        const cellLabel = document.createElement('td');
        const inputLabel = document.createElement('input');
        inputLabel.type = 'text';
        inputLabel.value = item.label;
        inputLabel.onchange = (e) => {
            appData[index].label = e.target.value;
            updateChart();
        };
        cellLabel.appendChild(inputLabel);

        const cellValue = document.createElement('td');
        const inputValue = document.createElement('input');
        inputValue.type = 'number';
        inputValue.value = item.value;
        inputValue.onchange = (e) => {
            appData[index].value = Number(e.target.value);
            updateChart();
        };
        cellValue.appendChild(inputValue);

        const cellAction = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'X';
        btnDelete.className = 'delete-btn';
        btnDelete.onclick = () => {
            appData.splice(index, 1);
            renderTable();
            updateChart();
        };
        cellAction.appendChild(btnDelete);

        row.appendChild(cellLabel);
        row.appendChild(cellValue);
        row.appendChild(cellAction);
        tableBody.appendChild(row);
    });
}

function initChart() {
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: appData.map(d => d.label),
            datasets: [{
                label: 'Statistics',
                data: appData.map(d => d.value),
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart() {
    if (chartInstance) {
        chartInstance.data.labels = appData.map(d => d.label);
        chartInstance.data.datasets[0].data = appData.map(d => d.value);
        chartInstance.update();
    }
}

function handleExcelUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header if present (simple heuristic: if first row is strings)
        let startIndex = 0;
        if (jsonData.length > 0 && typeof jsonData[0][0] === 'string') {
            startIndex = 1; 
        }

        const newData = [];
        for (let i = startIndex; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length >= 2) {
                newData.push({
                    label: String(row[0]),
                    value: Number(row[1]) || 0
                });
            }
        }

        if (newData.length > 0) {
            appData = newData;
            renderTable();
            updateChart();
            alert('Imported ' + newData.length + ' rows.');
        } else {
            alert('No valid data found in Excel.');
        }
    };
    reader.readAsArrayBuffer(file);
}

// start and initialize :3
init();