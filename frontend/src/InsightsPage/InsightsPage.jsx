import styles from './InsightsPage.module.css';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
export default function InsightsPage() {
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [yearlyData, setYearlyData] = useState([]);
    const [alltimeData, setAlltimeData] = useState([]);
    const [toggle, settoggle] = useState('weekly');

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
    dayjs(log.time).isSame(dayjs().subtract(1, 'week'), 'week')
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
    }, {}
);
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

     
         
        
    return (
        <>
       
        <div className={styles.container}>
            <div className={styles.header}>
            <h1>Insights</h1>
            
            </div>
             <div className={styles.toggle}>
                <span onClick={handleViewWeek}>Week</span>
                <span onClick={handleViewMonth}>Month</span>
                <span onClick={handleViewYear}>Year</span>
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
                    <p>Monthly insights will go here.</p>
                </div>
             )}
            
             
             {toggle === 'Comparison' && (
                <div className={styles.insight}>
                    <p>Comparisons will go here.</p>
                </div>
             )}
        </div>
        </>
    );
}