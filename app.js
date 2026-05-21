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
let sortColumn = '';
let sortDirection = true; // true = ASC, false = DESC
let chartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    filterAndRender();
    setupFormListener();
});

function setCurrentDate() {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.innerText = new Date().toLocaleDateString('en-ZA', options);
    }
}

function normalizeSector(sectorStr) {
    const s = sectorStr.toLowerCase();
    if (s.includes('auto')) return 'automotive';
    if (s.includes('energ')) return 'energy';
    if (s.includes('logis')) return 'logistics';
    return s;
}

function filterAndRender() {
    
    let processedData = enterpriseData.filter(ent => {
        const tenantSector = normalizeSector(ent.sector);
        const filterSector = normalizeSector(currentSectorFilter);
        
        const matchesSector = filterSector === 'all' || tenantSector === filterSector;
        const matchesSearch = ent.name.toLowerCase().includes(currentSearchQuery.toLowerCase());
        
        return matchesSector && matchesSearch;
    });

    if (sortColumn) {
        processedData.sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];

            if (typeof valA === 'string') {
                return sortDirection ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else {
                return sortDirection ? valA - valB : valB - valA;
            }
        });
    }

    renderTable(processedData);
    updateKPIs(processedData);
    renderChart(processedData);
}

function renderTable(data) {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No enterprises found matching criteria.</td></tr>`;
        return;
    }

    data.forEach(ent => {
        const statusClass = ent.status.toLowerCase() === 'operational' ? 'operational' : 'construction';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ent.name}</strong></td>
            <td>${ent.sector}</td>
            <td>R ${ent.investment.toFixed(1)} M</td>
            <td>${ent.jobs.toLocaleString()}</td>
            <td><span class="status-badge ${statusClass}">${ent.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateKPIs(data) {
    const fdiEl = document.getElementById('kpi-fdi');
    const projectsEl = document.getElementById('kpi-projects');
    const jobsEl = document.getElementById('kpi-jobs');

    const totalFDI = data.reduce((sum, item) => sum + item.investment, 0);
    const totalJobs = data.reduce((sum, item) => sum + item.jobs, 0);

    if (fdiEl) fdiEl.innerText = `R ${totalFDI.toFixed(1)} M`;
    if (projectsEl) projectsEl.innerText = data.length;
    if (jobsEl) jobsEl.innerText = totalJobs.toLocaleString();
}

function renderChart(data) {
    const canvas = document.getElementById('investmentChart');
    if (!canvas) return;

    const sectors = ['Automotive', 'Energy', 'Logistics'];
    const sums = sectors.map(sec => {
        return data.filter(ent => normalizeSector(ent.sector) === normalizeSector(sec))
                   .reduce((sum, ent) => sum + ent.investment, 0);
    });

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: sectors,
            datasets: [{
                label: 'Capital Invested (Millions of Rands)',
                data: sums,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

window.setSector = function(sector) {
    currentSectorFilter = sector;
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const attr = btn.getAttribute('onclick');
        if (attr && attr.includes(`'${sector}'`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    filterAndRender();
};

window.handleSearch = function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        currentSearchQuery = searchInput.value;
        filterAndRender();
    }
};

window.handleSort = function(column) {
    if (sortColumn === column) {
        sortDirection = !sortDirection;
    } else {
        sortColumn = column;
        sortDirection = true;
    }
    filterAndRender();
};

window.openModal = function() {
    const modal = document.getElementById('registerModal');
    if (modal) modal.style.display = 'block';
};

window.closeModal = function() {
    const modal = document.getElementById('registerModal');
    if (modal) modal.style.display = 'none';
};

window.onclick = function(event) {
    const modal = document.getElementById('registerModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

window.exportToCSV = function() {
    let csv = "Enterprise Name,Sector,Investment (M),Jobs Created,Status\n";
    enterpriseData.forEach(ent => {
        csv += `"${ent.name}","${ent.sector}",${ent.investment},${ent.jobs},"${ent.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Coega_SEZ_Tenant_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function setupFormListener() {
    const form = document.getElementById('tenantForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value;
        const rawSector = document.getElementById('formSector').value;
        const investment = parseFloat(document.getElementById('formInvestment').value);
        const jobs = parseInt(document.getElementById('formJobs').value, 10);
        const status = document.getElementById('formStatus').value;

        let mappedSector = "Automotive";
        if (rawSector === "energy") mappedSector = "Energy";
        if (rawSector === "logistics") mappedSector = "Logistics";

        if (name && !isNaN(investment) && !isNaN(jobs)) {
            enterpriseData.push({
                name: name,
                sector: mappedSector,
                investment: investment,
                jobs: jobs,
                status: status
            });

            filterAndRender();
            form.reset();
            closeModal();
        }
    });
}
