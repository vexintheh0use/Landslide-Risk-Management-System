const regionData = {
    all: {
        moisture: "64%", rain: "12.4", seismic: "Stable",
        chartData: [45, 59, 80, 81, 56, 55, 40],
        alerts: [
            { id: 1, region: "East Sikkim", level: "High", desc: "Critical soil moisture saturation. Evacuation protocols recommended." },
            { id: 2, region: "Dima Hasao, Assam", level: "High", desc: "Earth movement detected on Hwy 27." },
            { id: 3, region: "Cherrapunji, Meghalaya", level: "Medium", desc: "Continuous moderate rainfall." }
        ]
    },
    assam: {
        moisture: "72%", rain: "18.2", seismic: "Stable",
        chartData: [30, 45, 60, 90, 75, 50, 65],
        alerts: [
            { id: 2, region: "Dima Hasao", level: "High", desc: "Earth movement detected on Hwy 27." },
            { id: 4, region: "Karbi Anglong", level: "Medium", desc: "Elevated sensor levels." }
        ]
    },
    meghalaya: {
        moisture: "88%", rain: "25.6", seismic: "Minor Tremor",
        chartData: [60, 70, 110, 95, 80, 120, 105],
        alerts: [
            { id: 3, region: "Cherrapunji", level: "Medium", desc: "Continuous moderate rainfall." },
            { id: 5, region: "East Khasi Hills", level: "Medium", desc: "Waterlogging reported on slopes." }
        ]
    },
    sikkim: {
        moisture: "45%", rain: "5.1", seismic: "Stable",
        chartData: [20, 15, 30, 25, 10, 5, 12],
        alerts: [
            { id: 1, region: "East Sikkim", level: "High", desc: "Critical soil moisture saturation from past runoff." },
            { id: 6, region: "North Sikkim", level: "Low", desc: "Normal conditions observed." }
        ]
    }
};

const stateFilter = document.getElementById("stateFilter");
const alertsList = document.getElementById("alertsList");
const moistureVal = document.getElementById("moistureVal");
const rainVal = document.getElementById("rainVal");
const seismicVal = document.getElementById("seismicVal");

const ctx = document.getElementById('rainfallChart').getContext('2d');
let rainfallChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Precipitation (mm)',
            data: regionData.all.chartData,
            backgroundColor: 'rgba(255, 102, 0, 0.6)',
            borderColor: 'rgba(255, 102, 0, 1)',
            borderWidth: 1,
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                grid: { color: '#222222' },
                ticks: { color: '#888888' }
            },
            x: { 
                grid: { display: false },
                ticks: { color: '#888888' }
            }
        }
    }
});

function updateDashboard(regionKey) {
    const data = regionData[regionKey];

    moistureVal.textContent = data.moisture;
    rainVal.textContent = data.rain + " mm/h";
    seismicVal.textContent = data.seismic;

    if(data.seismic !== "Stable") {
        seismicVal.style.color = "#ff3b3b";
    } else {
        seismicVal.style.color = "#ffffff";
    }

    rainfallChart.data.datasets[0].data = data.chartData;
    rainfallChart.update();

    alertsList.innerHTML = "";
    if (data.alerts.length === 0) {
        alertsList.innerHTML = "<p style='color:#a0a0a0'>No active alerts.</p>";
        return;
    }

    data.alerts.forEach(alert => {
        const card = document.createElement("div");
        card.className = `alert-card risk-${alert.level.toLowerCase()}`;
        card.innerHTML = `
            <h3>${alert.region} [${alert.level}]</h3>
            <p>${alert.desc}</p>
        `;
        alertsList.appendChild(card);
    });
}

stateFilter.addEventListener("change", (e) => {
    updateDashboard(e.target.value);
});

updateDashboard("all");