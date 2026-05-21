let enterpriseData = [
    { name: "FAW South Africa Trucks", sector: "Automotive", investment: 150.5, jobs: 1200, status: "Operational" },
    { name: "Dedisa Peaking Power Plant", sector: "Energy", investment: 320.0, jobs: 850, status: "Operational" },
    { name: "Volkswagen", sector: "Automotive", investment: 30.0, jobs: 250, status: "Construction" },
    { name: "African Port Logistics", sector: "Logistics", investment: 45.2, jobs: 300, status: "Operational" },
    { name: "Electrawinds", sector: "Energy", investment: 110.0, jobs: 200, status: "Operational" },
    { name: "BAIC South Africa", sector: "Automotive", investment: 85.5, jobs: 450, status: "Construction" },
    { name: "UPS", sector: "Logistics", investment: 50.0, jobs: 180, status: "Operational" },
    { name: "Benteler Automotive", sector: "Automotive", investment: 40.6, jobs: 300, status: "Operational" },
    { name: "DHL", sector: "Logistics", investment: 22.0, jobs: 90, status: "Operational" },
    { name: "Eskom", sector: "Energy", investment: 50.0, jobs: 100, status: "Construction" }
];

let currentSectorFilter = 'all';
let currentSearchQuery = '';
let analyticsChart = null;

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupEventListeners();
});

function initDashboard() {
    filterAndRender();
}


function filterAndRender() {
    const filteredData = enterpriseData.filter(ent => {
        const matchesSector = currentSectorFilter.toLowerCase() === 'all' || 
                              ent.sector.toLowerCase() === currentSectorFilter.toLowerCase();
        
        const matchesSearch = ent.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                              ent.sector.toLowerCase().includes(currentSearchQuery.toLowerCase());
        
        return matchesSector && matchesSearch;
    });

    renderTable(filteredData);
    updateMetrics(filteredData);
    renderCharts(filteredData);
}

function renderTable(data) {
    const tableBody = document.getElementById('enterpriseTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No matching enterprises found</td></tr>`;
        return;
    }

    data.forEach(ent => {
        // Defensive mapping for CSS status classes
        const statusClass = ent.status.toLowerCase() === 'operational' ? 'operational' : 'construction';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ent.name}</strong></td>
            <td><span class="sector-tag">${ent.sector}</span></td>
            <td>R ${ent.investment.toFixed(1)} M</td>
            <td>${ent.jobs.toLocaleString()}</td>
            <td><span class="status-badge ${statusClass}">${ent.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function updateMetrics(data) {
    const totalInvestmentEl = document.getElementById('totalInvestment');
    const totalJobsEl = document.getElementById('totalJobs');
    const activeTenantsEl = document.getElementById('activeTenants');

    const totalInvestment = data.reduce((sum, ent) => sum + ent.investment, 0);
    const totalJobs = data.reduce((sum, ent) => sum + ent.jobs, 0);

    if (totalInvestmentEl) totalInvestmentEl.innerText = `R ${totalInvestment.toFixed(1)} M`;
    if (totalJobsEl) totalJobsEl.innerText = totalJobs.toLocaleString();
    if (activeTenantsEl) activeTenantsEl.innerText = data.length;
}

function renderCharts(data) {
    const chartCtx = document.getElementById('analyticsChart');
    if (!chartCtx) return;

    const sectors = ['Automotive', 'Energy', 'Logistics'];
    const investmentPerSector = sectors.map(sec => {
        return data.filter(ent => ent.sector.toLowerCase() === sec.toLowerCase())
                   .reduce((sum, ent) => sum + ent.investment, 0);
    });

    if (analyticsChart) {
        analyticsChart.destroy();
    }

    analyticsChart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: sectors,
            datasets: [{
                label: 'FDI Allocation (Millions of Rands)',
                data: investmentPerSector,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function setupEventListeners() {
    // Live Search Event
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            filterAndRender();
        });
    }

    const sectorFilterContainer = document.getElementById('sectorFilterContainer');
    const sectorSelectDropdown = document.getElementById('sectorSelect');

    if (sectorFilterContainer) {

        sectorFilterContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentSectorFilter = e.target.getAttribute('data-sector') || e.target.innerText;
                filterAndRender();
            }
        });
    } else if (sectorSelectDropdown) {
        
        sectorSelectDropdown.addEventListener('change', (e) => {
            currentSectorFilter = e.target.value;
            filterAndRender();
        });
    }

    const addTenantForm = document.getElementById('addTenantForm');
    if (addTenantForm) {
        addTenantForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('tenantName').value;
            const sector = document.getElementById('tenantSector').value;
            const investment = parseFloat(document.getElementById('tenantInvestment').value);
            const jobs = parseInt(document.getElementById('tenantJobs').value, 10);
            const status = document.getElementById('tenantStatus').value || 'Operational';

            if (name && sector && !isNaN(investment) && !isNaN(jobs)) {
                enterpriseData.push({ name, sector, investment, jobs, status });
                filterAndRender();
                addTenantForm.reset();
                
                const modalToggle = document.getElementById('modalToggleCheckbox');
                if (modalToggle) modalToggle.checked = false;
                if (typeof closeModal === 'function') closeModal(); 
            }
        });
    }

    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            let csvContent = "data:text/csv;charset=utf-8,Enterprise Name,Sector,Investment (M),Jobs Created,Status\n";
            
            enterpriseData.forEach(ent => {
                csvContent += `"${ent.name}","${ent.sector}",${ent.investment},${ent.jobs},"${ent.status}"\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "SEZ_Enterprise_Performance_Report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}
