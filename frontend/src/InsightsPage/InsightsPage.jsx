import styles from './InsightsPage.module.css';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import BarChart from '../BarChart/BarChart.jsx';

export default function InsightsPage() {
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [yearlyData, setYearlyData] = useState([]);
    const [alltimeData, setAlltimeData] = useState([]);
    const [toggle, settoggle] = useState('week');
    const [comparetoggle, setCompareToggle] = useState('week');

    useEffect(() => {
        async function fetchWeeklyData() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timelogs/week`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setWeeklyData(data.timeLogs);
                }
            } catch (error) {
                console.error('Error fetching weekly data:', error);
            }
        }
        fetchWeeklyData();
    }, []);

    useEffect(() => {
        async function fetchAlltimeData() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timelogs`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setAlltimeData(data.timeLogs);
                }
            } catch (error) {
                console.error('Error fetching all-time data:', error);
            }
        }
        fetchAlltimeData();
    }, []);

    useEffect(() => {
        async function fetchMonthlyData() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timelogs/month`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setMonthlyData(data.timeLogs);
                }
            } catch (error) {
                console.error('Error fetching monthly data:', error);
            }
        }
        fetchMonthlyData();
    }, []);

    function mostFrequentAreaWeekly(logs) {
        const areaDuration = logs.reduce((acc, log) => {
            const areaId = log.areaId;
            if (!acc[areaId]) {
                acc[areaId] = {
                    areaId: areaId,
                    name: log.area.name,
                    duration: 0
                };
            }
            acc[areaId].duration += log.duration;
            return acc;
        }, {});

        const sortedAreas = Object.values(areaDuration).sort((a, b) => b.duration - a.duration);
        return sortedAreas.length > 0 ? sortedAreas[0].name : 'No data';
    }

    function howMuchAreasWeekly(logs) {
        const areaCount = logs.reduce((acc, log) => {
            const areaId = log.areaId;
            if (!acc[areaId]) {
                acc[areaId] = true;
            }
            return acc;
        }, {});

        return Object.keys(areaCount).length;
    }

    function CompareAreasWeekly(logs, alltime) {
        const previousWeek = alltime.filter(log =>
            dayjs(log.createdAt).isSame(dayjs().subtract(1, 'week'), 'week')
        );
        const previousWeekduration = previousWeek.reduce((acc, log) => {
            const areaId = log.areaId;
            if (!acc[areaId]) {
                acc[areaId] = {
                    areaId: areaId,
                    name: log.area.name,
                    duration: 0
                };
            }
            acc[areaId].duration += log.duration;
            return acc;
        }, {});

        const currentWeekduration = logs.reduce((acc, log) => {
            const areaId = log.areaId;
            if (!acc[areaId]) {
                acc[areaId] = {
                    areaId: areaId,
                    name: log.area.name,
                    duration: 0
                };
            }
            acc[areaId].duration += log.duration;
            return acc;
        }, {});

        const previousWeekAreas = Object.keys(previousWeekduration).length;
        const currentWeekAreasTotal = Object.keys(currentWeekduration).length;
        if (currentWeekAreasTotal > previousWeekAreas) {
            return 'more areas';
        } else if (currentWeekAreasTotal < previousWeekAreas) {
            return 'fewer areas';
        } else {
            return 'the same amount of areas';
        }
    }

    function attentionLevelWeekly(logs) {
        const areaAttention = logs.reduce((total, log) => total + log.attentionLevel, 0);
        return (areaAttention / logs.length).toFixed(1);
    }

    function handleViewWeek() {
        settoggle('week');
    }

    function handleViewMonth() {
        settoggle('month');
    }

    function handleViewYear() {
        settoggle('year');
    }

    function handleViewAlltime() {
        settoggle('Comparison');
    }

    function mostFrequentAreaMonthly(logs) {
        const areaDuration = logs.reduce((acc, log) => {
            const areaId = log.areaId;
            if (!acc[areaId]) {
                acc[areaId] = {
                    areaId: areaId,
                    name: log.area.name,
                    duration: 0
                };
            }
            acc[areaId].duration += log.duration;
            return acc;
        }, {});

        const sortedAreas = Object.values(areaDuration).sort((a, b) => b.duration - a.duration);
        return sortedAreas.length > 0 ? sortedAreas[0].name : 'No data';
    }

    function CompareAreasMonthly(logs, alltime) {
        const previousMonth = alltime.filter(log =>
            dayjs(log.createdAt).isSame(dayjs().subtract(1, 'month'), 'month')
        );
        const previousMonthDuration = previousMonth.reduce((acc, log) => {
            const areaId = log.areaId;
            if (!acc[areaId]) {
                acc[areaId] = {
                    areaId: areaId,
                    name: log.area.name,
                    duration: 0
                };
            }
            acc[areaId].duration += log.duration;
            return acc;
        }, {});

        const currentMonthDuration = logs.reduce((acc, log) => {
            const areaId = log.areaId;
            if (!acc[areaId]) {
                acc[areaId] = {
                    areaId: areaId,
                    name: log.area.name,
                    duration: 0
                };
            }
            acc[areaId].duration += log.duration;
            return acc;
        }, {});

        const previousMonthAreas = Object.keys(previousMonthDuration).length;
        const currentMonthAreasTotal = Object.keys(currentMonthDuration).length;
        if (currentMonthAreasTotal > previousMonthAreas) {
            return 'more areas';
        } else if (currentMonthAreasTotal < previousMonthAreas) {
            return 'fewer areas';
        } else {
            return 'the same amount of areas';
        }
    }

    function howMuchAreasMonthly(logs) {
        const areaCount = logs.reduce((acc, log) => {
            const areaId = log.areaId;
            if (!acc[areaId]) {
                acc[areaId] = true;
            }
            return acc;
        }, {});

        return Object.keys(areaCount).length;
    }

    function handleCompareWeek() {
        setCompareToggle('week');
    }

    function handleCompareMonth() {
        setCompareToggle('month');
    }

    function totalDuration(logs) {
        return logs.reduce((total, log) => total + log.duration, 0);
    }
    function averageAttentionLevel(logs) {
        const totalAttention = logs.reduce((total, log) => total + log.attentionLevel, 0);
        return (totalAttention / logs.length).toFixed(1);
    }
    function avarageEnergyLevelBefore(logs) {
        const totalEnergy = logs.reduce((total, log) => total + log.energyBefore, 0);
        return (totalEnergy / logs.length).toFixed(1);
    }
     function avarageEnergyLevelAfter(logs) {
        const totalEnergy = logs.reduce((total, log) => total + log.energyAfter, 0);
        return (totalEnergy / logs.length).toFixed(1);
    }

    const lastWeekStart = dayjs().subtract(1, 'week').startOf('week');
    const lastWeekEnd = dayjs().subtract(1, 'week').endOf('week');
    
    const lastMonthStart = dayjs().subtract(1, 'month').startOf('month');
    const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month');

    const thisweekDuration = totalDuration(weeklyData);
    const lastweekDuration = totalDuration(alltimeData.filter(log =>
        dayjs(log.createdAt).isBetween(lastWeekStart, lastWeekEnd, null, '[]')
    ));
    const thisweekAttention = averageAttentionLevel(weeklyData);
    const lastweekAttention = averageAttentionLevel(alltimeData.filter(log =>
        dayjs(log.createdAt).isBetween(lastWeekStart, lastWeekEnd, null, '[]')
    ));
    const thisweekEnergy = avarageEnergyLevelBefore(weeklyData);
    const lastweekEnergy = avarageEnergyLevelBefore(alltimeData.filter(log =>
        dayjs(log.createdAt).isBetween(lastWeekStart, lastWeekEnd, null, '[]')
    ));
    const thisweekEnergyAfter = avarageEnergyLevelAfter(weeklyData);
        const lastweekEnergyAfter = avarageEnergyLevelAfter(alltimeData.filter(log =>
        dayjs(log.createdAt).isBetween(lastWeekStart, lastWeekEnd, null, '[]')
    ));

    const thismonthDuration = totalDuration(monthlyData);
    const lastmonthDuration = totalDuration(alltimeData.filter(log =>
        dayjs(log.createdAt).isBetween(lastMonthStart, lastMonthEnd, null, '[]')
    ));
    const thismonthAttention = averageAttentionLevel(monthlyData);
    const lastmonthAttention = averageAttentionLevel(alltimeData.filter(log =>
        dayjs(log.createdAt).isBetween(lastMonthStart, lastMonthEnd, null, '[]')
    ));
    const thismonthEnergy = avarageEnergyLevelBefore(monthlyData);
    const lastmonthEnergy = avarageEnergyLevelBefore(alltimeData.filter(log =>
        dayjs(log.createdAt).isBetween(lastMonthStart, lastMonthEnd, null, '[]')
    ));
    const thismonthEnergyAfter = avarageEnergyLevelAfter(monthlyData);
    const lastmonthEnergyAfter = avarageEnergyLevelAfter(alltimeData.filter(log =>
        dayjs(log.createdAt).isBetween(lastMonthStart, lastMonthEnd, null, '[]')
    ));
    const labels = ['Last Week', 'This Week'];
    const datasets = [
        {
            label: 'Total Duration (minutes)',
            data: [lastweekDuration, thisweekDuration],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ];
    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Duration (minutes)',
                },
            },
        },
    };
    const attentionLabels = ['Last Week', 'This Week'];
    const attentionDatasets = [
        {
            label: 'Average Attention Level',
            data: [lastweekAttention, thisweekAttention],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        },
    ];
    const attentionOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Attention Level',
                },
            },
        },
    };
    const energyLabelsBefore = ['Last Week', 'This Week'];
    const energyDatasetsBefore = [
        {
            label: 'Average Energy Level Before',
            data: [lastweekEnergy, thisweekEnergy],
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
        },
    ];
    const energyOptionsBefore = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Energy Level Before',
                },
            },
        },
    };
    const energyLabelsAfter = ['Last Week', 'This Week'];
    const energyDatasetsAfter = [
        {
            label: 'Average Energy Level After',
            data: [lastweekEnergyAfter, thisweekEnergyAfter],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },  
    ];
    const energyOptionsAfter = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Energy Level After',
                },
            },
        },
    };
    const monthLabels = ['Last Month', 'This Month'];
    const monthDatasets = [
        {
            label: 'Total Duration (minutes)',
            data: [lastmonthDuration, thismonthDuration],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ];
    const monthOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Duration (minutes)',
                },
            },
        },
    };
    const monthAttentionLabels = ['Last Month', 'This Month'];
    const monthAttentionDatasets = [
        {
            label: 'Average Attention Level',
            data: [lastmonthAttention, thismonthAttention],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        },
    ];
    const monthAttentionOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Attention Level',
                },
            },
        },
    };
    const monthEnergyLabelsBefore = ['Last Month', 'This Month'];
    const monthEnergyDatasetsBefore = [
        {
            label: 'Average Energy Level Before',
            data: [lastmonthEnergy, thismonthEnergy],
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
        },
    ];
    const monthEnergyOptionsBefore = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Energy Level Before',
                },
            },
        },
    };
    const monthEnergyLabelsAfter = ['Last Month', 'This Month'];
    const monthEnergyDatasetsAfter = [
        {
            label: 'Average Energy Level After',
            data: [lastmonthEnergyAfter, thismonthEnergyAfter],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
    ];
    const monthEnergyOptionsAfter = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Average Energy Level After',
                },
            },
        },
    };



    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Insights</h1>
                </div>
                <div className={styles.toggle}>
                    <span onClick={handleViewWeek}>Week</span>
                    <span onClick={handleViewMonth}>Month</span>
                    <span onClick={handleViewAlltime}>Comparison</span>
                </div>
                {toggle === 'week' && (
                    <div className={styles.insight}>
                        <p className={styles.insightItem}>Most of your time this week went to: {mostFrequentAreaWeekly(weeklyData)}</p>
                        <p className={styles.insightItem}>Your time this week was spread across {howMuchAreasWeekly(weeklyData)} areas.</p>
                        <p className={styles.insightItem}>Compared to last week, you spent time on {CompareAreasWeekly(weeklyData, alltimeData)}.</p>
                        <p className={styles.insightItem}>Your average attention level this week was: {attentionLevelWeekly(weeklyData)}</p>
                    </div>
                )}
                {toggle === 'month' && (
                    <div className={styles.insight}>
                        <p className={styles.insightItem}>Most of your time this month went to: {mostFrequentAreaMonthly(monthlyData)}</p>
                        <p className={styles.insightItem}>Compared to last month, you spent time on {CompareAreasMonthly(monthlyData, alltimeData)}.</p>
                        <p className={styles.insightItem}>Your time this month was spread across {howMuchAreasMonthly(monthlyData)} areas.</p>
                    </div>
                )}
                {toggle === 'Comparison' && (
                    <div className={styles.insight}>
                        <div className={styles.toggle}>
                        <span onClick={handleCompareWeek}>Compare This Week To Last Week</span>
                        <span onClick={handleCompareMonth}>Compare This Month To Last Month</span>
                        </div>
                        {comparetoggle === 'week' && (
                            <div className={styles.insight}>
                                <div className={styles.charts}>
                                    <div className={styles.chartContainer}>
                                <BarChart labels={labels} datasets={datasets} options={options} className={styles.chart} />
                                </div>
                                <div className={styles.chartContainer}>
                                <BarChart labels={attentionLabels} datasets={attentionDatasets} options={attentionOptions} className={styles.chart} />
                                </div>
                                </div>
                                <div className={styles.chartsTwo}>
                                    <div className={styles.chartContainer}>

                                <BarChart labels={energyLabelsBefore} datasets={energyDatasetsBefore} options={energyOptionsBefore} className={styles.chart} />
                                </div>
                                <div className={styles.chartContainer}>
                                <BarChart labels={energyLabelsAfter} datasets={energyDatasetsAfter} options={energyOptionsAfter} className={styles.chart} />
                                </div>
                                </div>
                            </div>
                        )}
                        {comparetoggle === 'month' && (
                            <div className={styles.insight}>
                                <div className={styles.charts}>
                                    <div className={styles.chartContainer}>
                                <BarChart labels={monthLabels} datasets={monthDatasets} options={monthOptions} className={styles.chart} />
                                </div>
                                <div className={styles.chartContainer}>
                                <BarChart labels={monthAttentionLabels} datasets={monthAttentionDatasets} options={monthAttentionOptions} className={styles.chart} />
                                </div>
                                </div>
                                <div className={styles.chartsTwo}>
                                    <div className={styles.chartContainer}>
                                <BarChart labels={monthEnergyLabelsBefore} datasets={monthEnergyDatasetsBefore} options={monthEnergyOptionsBefore} className={styles.chart} />
                                </div>
                                <div className={styles.chartContainer}>
                                <BarChart labels={monthEnergyLabelsAfter} datasets={monthEnergyDatasetsAfter} options={monthEnergyOptionsAfter} className={styles.chart} />
                                </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}