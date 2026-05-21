let enterpriseData = [
    { name: "FAW South Africa Trucks", sector: "Automotive", investment: 150.5, jobs: 1200, status: "operational" },
    { name: "Dedisa Peaking Power Plant", sector: "Energy", investment: 320.0, jobs: 850, status: "operational" },
    { name: "Volkswagen", sector: "Automotive", investment: 30.0, jobs: 250, status: "construction" },
    { name: "African Port Logistics", sector: "Logistics", investment: 45.2, jobs: 300, status: "operational" },
    { name: "Electrawinds", sector: "Energy", investment: 110.0, jobs: 200, status: "operational" },
    { name: "BAIC South Africa", sector: "Automotive", investment: 85.5, jobs: 450, status: "construction" },
    { name: "UPS", sector: "Logistics", investment: 50.0, jobs: 180, status: "operational" },
    { name: "Benteler Automotive", sector: "Automotive", investment: 40.6, jobs: 300, status: "operational" },
    { name: "DHL", sector: "Logistics", investment: 22.0, jobs: 90, status: "operational" },
    { name: "Eskom", sector: "Energy", investment: 50.0, jobs: 100, status: "construction" }
];

let currentSector = 'all';
let searchQuery = '';
let sortCol = 'investment';
let sortAsc = false;
let myChart = null; 

document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatCurrency = (amount) => `$${Number(amount).toFixed(1)}M`;

function renderDashboard() {
    
    let filteredData = currentSector === 'all' 
        ? [...enterpriseData] 
        : enterpriseData.filter(item => item.sector === currentSector);

    if (searchQuery) {
        filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    filteredData.sort((a, b) => {
        let valA = a[sortCol];
        let valB = b[sortCol];
        if (typeof valA === 'string') {
            return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
    });

  
    let totalInvestment = 0, totalJobs = 0, activeProjects = 0;
    filteredData.forEach(ent => {
        totalInvestment += parseFloat(ent.investment);
        totalJobs += parseInt(ent.jobs);
        if(ent.status === "Construction") activeProjects++;
    });

    document.getElementById('kpi-fdi').innerText = formatCurrency(totalInvestment);
    document.getElementById('kpi-projects').innerText = activeProjects;
    document.getElementById('kpi-jobs').innerText = totalJobs.toLocaleString();

    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; 
    filteredData.forEach(ent => {
        const row = document.createElement('tr');
        const statusClass = ent.status.toLowerCase() === 'operational' ? 'operational' : 'construction';
        row.innerHTML = `
            <td><strong>${ent.name}</strong></td>
            <td>${ent.sector.charAt(0).toUpperCase() + ent.sector.slice(1)}</td>
            <td>${formatCurrency(ent.investment)}</td>
            <td>${ent.jobs.toLocaleString()}</td>
            <td><span class="status ${statusClass}">${ent.status}</span></td>
        `;
        tableBody.appendChild(row);
    });

    renderChart(filteredData);
}

function renderChart(data) {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    
    if (myChart) myChart.destroy();

    const labels = data.map(ent => ent.name);
    const investments = data.map(ent => ent.investment);

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Investment Value ($M)',
                data: investments,
                backgroundColor: '#20c997',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

window.setSector = function(sector) {
    currentSector = sector;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.nav-btn[onclick="setSector('${sector}')"]`).classList.add('active');
    renderDashboard();
}

window.handleSearch = function() {
    searchQuery = document.getElementById('searchInput').value;
    renderDashboard();
}

window.handleSort = function(column) {
    if (sortCol === column) {
        sortAsc = !sortAsc;
        sortCol = column;
        sortAsc = true;
    }
    renderDashboard();
}

window.exportToCSV = function() {
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Enterprise Name,Sector,Investment ($M),Jobs,Status\n"; 
    
    enterpriseData.forEach(row => {
        let rowData = `"${row.name}","${row.sector}",${row.investment},${row.jobs},"${row.status}"`;
        csvContent += rowData + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SEZ_Investment_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.openModal = () => document.getElementById('registerModal').style.display = "block";
window.closeModal = () => document.getElementById('registerModal').style.display = "none";

document.getElementById('tenantForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const newTenant = {
        name: document.getElementById('formName').value,
        sector: document.getElementById('formSector').value,
        investment: parseFloat(document.getElementById('formInvestment').value),
        jobs: parseInt(document.getElementById('formJobs').value),
        status: document.getElementById('formStatus').value
    };

    enterpriseData.push(newTenant);
    closeModal();
    this.reset();
    renderDashboard();
});

renderDashboard();
