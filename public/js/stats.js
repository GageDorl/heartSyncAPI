
import { renderHeader } from "../partials/header";
import { fetchCurrentUser, fetchActivities, fetchLetters, fetchRelationship, fetchCheckins} from "./fetch-data.mjs";
let baseHue = 343;
let baseLightness = 70;
let moodChart;
let closenessChart;
document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    baseHue = user.baseHue ? user.baseHue.trim() : 343;
    baseLightness = user.baseLightness ? user.baseLightness.trim() : 70;
    const checkins = await fetchCheckins(user._id);
    checkStreak(checkins);
    setDates("wtd");
    document.querySelector('.loading').classList.add('hidden');
    document.querySelector('.stats-display').classList.remove('hidden');
});

function checkStreak(checkins) {
    if(checkins) {
        const sortedCheckins = checkins.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        let streak = 0;
        let currentDate = new Date();
        for(let checkin of sortedCheckins) {
            const checkinDate = new Date(checkin.createdAt);
            if(isSameDay(checkinDate, currentDate)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if(checkinDate < currentDate) {
                break;
            }
        }
        document.getElementById("streak-value").textContent = streak;
    }
}

const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

const timeframeSelect = document.getElementById("timeframe");
timeframeSelect.addEventListener("change", async () => {
    const timeframe = timeframeSelect.value;
    setDates(timeframe);
});

const getStatsInRange = (items, type, startDate, endDate) => {
    let filteredItems = [];
    switch (type){
        case "letters":
            filteredItems = items.filter(item => {
                const itemDate = new Date(item.sentAt || item.createdAt);
                return itemDate >= startDate && itemDate <= endDate;
            });
            break;
        case "activities":
            filteredItems = items.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate && itemDate <= endDate;
            });
            break;
        case "checkins":
            filteredItems = items.filter(item => {
                const itemDate = new Date(item.createdAt);
                return itemDate >= startDate && itemDate <= endDate;
            });
            break;
    }
    return filteredItems;
}

async function setDates(timeframe) {
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    let activities = [];
    let letters = [];
    let checkins = [];
    if(relationship && relationship.status === "accepted") {
        activities = await fetchActivities(relationship._id);
        console.log("Fetched activities:", activities);
        letters = await fetchLetters(relationship._id);
        console.log("Fetched letters:", letters);
        checkins = await fetchCheckins(user._id);
        console.log("Fetched checkins:", checkins);
    }
    let startDate = new Date();
    let endDate = new Date();
    switch(timeframe) {
        case "wtd":
            startDate.setDate(endDate.getDate() - 7);
            
            document.getElementById("custom-date-range").classList.add("hidden");
            getAllStats(activities, letters, checkins, startDate, endDate);
            break;
        case "mtd":
            startDate.setMonth(endDate.getMonth() - 1);
            document.getElementById("custom-date-range").classList.add("hidden");
            getAllStats(activities, letters, checkins, startDate, endDate);
            break;
        case "3mth":
            startDate.setMonth(endDate.getMonth() - 3);
            document.getElementById("custom-date-range").classList.add("hidden");
            getAllStats(activities, letters, checkins, startDate, endDate);
            break;
        case "custom":
            document.getElementById("custom-date-range").classList.remove("hidden");
            break;   
    }

    const applyDateRangeBtn = document.getElementById("apply-date-range-btn");
    applyDateRangeBtn.addEventListener("click", async () => {
        let timezoneOffset = new Date().getTimezoneOffset() * 60000;
        let startDateValueAsNumber = document.getElementById("start-date").valueAsNumber;
        let endDateValueAsNumber = document.getElementById("end-date").valueAsNumber;
        startDate = new Date(startDateValueAsNumber + timezoneOffset);
        endDate = new Date(endDateValueAsNumber + timezoneOffset);
        endDate.setHours(23, 59, 59, 999);
        getAllStats(activities, letters, checkins, startDate, endDate);
    });
}

function getAllStats(activities, letters, checkins, startDate, endDate) {
    let statsActivities = getStatsInRange(activities, "activities", startDate, endDate);
    let statsLetters = getStatsInRange(letters, "letters", startDate, endDate);
    let statsCheckins = getStatsInRange(checkins, "checkins", startDate, endDate);
    setStatsDisplay(statsActivities, statsLetters, statsCheckins, startDate, endDate);
}

function setStatsDisplay(activities, letters, checkins, startDate, endDate) {
    let happyCount = 0;
    let neutralCount = 0;
    let sadCount = 0;
    let angryCount = 0;
    let anxiousCount = 0;
    let excitedCount = 0;
    const moods = checkins.map(checkin => {
        switch(checkin.mood.toLowerCase()) {
            case "happy":
                happyCount++;
                break;
            case "neutral":
                neutralCount++;
                break;
            case "sad":
                sadCount++;
                break;
            case "angry":
                angryCount++;
                break;
            case "anxious":
                anxiousCount++;
                break;
            case "excited":
                excitedCount++;
                break;
        }
        return checkin.mood;
    });
    let moodCounts = {
        happy: happyCount,
        neutral: neutralCount,
        sad: sadCount,
        angry: angryCount,
        anxious: anxiousCount,
        excited: excitedCount
    };
    let mostCommonMood = "N/A";
    let highestCount = 0;
    for(let mood in moodCounts) {
        if(moodCounts[mood] > highestCount) {
            highestCount = moodCounts[mood];
            mostCommonMood = mood.charAt(0).toUpperCase() + mood.slice(1);
        }
    }
    document.getElementById("primary-mood-value").textContent = mostCommonMood;
    const averageCloseness = checkins.reduce((sum, checkin) => sum + (checkin.closenessLevel || 0), 0) / (checkins.length || 1);
    document.getElementById("avg-closeness-value").textContent = averageCloseness.toFixed(2);
    const activityCount = activities.length;
    document.getElementById("activity-count-value").textContent = activityCount;

    const closenessData = checkins.map(checkin => {
        const date = new Date(checkin.createdAt);
        return {
            x: date.setHours(0,0,0,0),
            y: checkin.closenessLevel,
            mood: checkin.mood,
            notes: checkin.notes
        };
    });


    const chartColors = {
        primary: `hsl(${baseHue}, 100%, ${baseLightness}%)`,
        accent: `hsl(${baseHue}, 100%, ${baseLightness - 20}%)`
    };

    console.log(startDate, endDate);
    function renderClosenessChart(startDate, endDate) {
        const ctx = document.getElementById('closenessChart').getContext('2d');
        // Optional: filter by date range before plotting
        if (closenessChart) {
            closenessChart.destroy();
        }

        closenessChart = new Chart(ctx, {
            type: 'line',
            data: {
            datasets: [
                {
                    label: 'Closeness Level',
                    data: closenessData,
                    parsing: false, 
                    backgroundColor: chartColors.primary,
                    pointBackgroundColor: 'rgba(0,0,0,0)',
                    fill: true,
                    tension: 0.1,
                    pointRadius: 1,
                    
                    pointHoverRadius: 2
                }
            ]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false, // important for resizing
            plugins: {
                legend: {
                display: false
                },
                tooltip: {
                callbacks: {
                    title: (items) => {
                        return items[0].label
                    },
                    label: (item) => {
                    const p = item.raw;
                    const lines = [
                        `Closeness: ${p.y}`
                    ];
                    if (p.mood)   lines.push(`Mood: ${p.mood}`);
                    if (p.notes)  lines.push(`Note: ${p.notes}`);
                    return lines;
                    }
                }
                }
            },
            scales: {
                x: {
                    min: startDate,
                    max: endDate.setHours(0,0,0,0),
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'pp', // date-fns format, e.g. Nov 18, 2025
                    },
                    title: {
                        display: false,
                        text: 'Date'
                    },
                    ticks: {
                        maxRotation: 0,
                        font: {
                            family: 'League Spartan, system-ui, sans-serif'
                        },
                        color: chartColors.accent,
                        formatter: function(value, index, ticks) {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0)'
                    }
                },
                y: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 1,
                        display: false
                    },
                    title: {
                        display: false,
                        text: 'Closeness Level'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.2)'
                    }
                },
                
            }
            }
        });
    }
    renderClosenessChart(startDate, endDate);

    const moodLabels = Object.keys(moodCounts).map(mood => mood.charAt(0).toUpperCase() + mood.slice(1));
    const moodValues = Object.values(moodCounts);

    function renderMoodChart() {
        const ctx = document.getElementById('moodChart').getContext('2d');

        if (moodChart) {
            moodChart.destroy();
        }

        moodChart = new Chart(ctx, {
            type: 'radar',
            data: {
            labels: moodLabels,
            datasets: [
                {
                    label: 'Mood Count',
                    data: moodValues,
                    borderColor: chartColors.accent,                 // accent
                    backgroundColor: chartColors.primary,             // primary
                    pointBackgroundColor: 'rgba(0,0,0,0)',
                    pointBorderColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    tension: 0.1,
                    pointRadius: 2,
                    pointHoverRadius: 2
                }
            ]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: -1,
                    ticks: {
                        stepSize: 1,
                        display: false
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.6)'
                    },
                    angleLines: {
                        color: 'rgba(0,0,0,0.6)'
                    },
                    pointLabels: {
                        font: {
                        family: 'League Spartan, system-ui, sans-serif'
                        },
                        color: chartColors.accent
                    }
                }
            },
            animation: {
                duration: 1000,       // 1 second
                easing: 'easeOutQuad' // nice smooth curve
            },
            plugins: {
                legend: {
                display: false
                },
                tooltip: {
                callbacks: {
                    label: (ctx) => {
                    const label = ctx.label || '';
                    const value = ctx.raw || 0;
                    return `${label}: ${value} day${value === 1 ? '' : 's'}`;
                    }
                }
                }
            }
            }
        });
    }
    renderMoodChart();
    console.log(moodChart)

}