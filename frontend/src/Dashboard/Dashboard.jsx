import styles from './Dashboard.module.css';
import { useState, useEffect, use  } from 'react';
import { useNavigate,Navigate } from 'react-router-dom';
import { useRef } from 'react';
import DonutChart from '../DonutChart/DonutChart.jsx';




export default function Dashboard({ user }) {
    const [timeLogs, setTimeLogs] = useState([]);
    const navigate = useNavigate();
    const date = new Date();
    
    const [chartKey, setChartKey] = useState(0);

    useEffect(() => {
        async function fetchTimeLogs() {
            try {
                const response = await fetch('http://localhost:3000/api/timelogs/today', {    
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setTimeLogs(data.timeLogs);
                }
            } catch (error) {
                console.error('Error fetching time logs:', error);
            }
        }
        fetchTimeLogs();
    }, []);
    useEffect(() => {
        const onResize = () => setChartKey((prev) => prev + 1);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);


   

     function totalDuration() {
        
        return timeLogs.reduce((total, log) => total + log.duration, 0);
    }
   function mostFrequentArea(logs) {
        const areaCount = Object.values(
            logs.reduce((acc, log) => {
                if(!acc[log.area.areaId]) {
                    acc[log.area.areaId] = {
                        areaid: log.area.areaId,
                        name: log.area.name,
                        duration: 0
                    };
                }
                acc[log.area.areaId].duration += log.duration;
                return acc;
            }, {})
        );
        areaCount.find((area) => area.duration === Math.max(...areaCount.map(a => a.duration)))?.name || 'N/A';
        const mostFrequent = areaCount.reduce((max, area) => area.duration > max.duration ? area : max, {duration: 0});
        return mostFrequent.name || 'N/A';
                    }
                    function afteravarageEnergyLevel() {
                        if (timeLogs.length === 0) return 0;
                        const totalEnergy = timeLogs.reduce((total, log) => total + log.energyAfter, 0);
                        return (totalEnergy / timeLogs.length).toFixed(1);
                    }
                function lastactivity(logs) {
                    const
                        lastLog = logs.reduce((latest, log) => {
                            return new Date(log.createdAt) > new Date(latest.createdAt) ? log : latest;
                        }, logs[0]);
                    if (!lastLog) return 'N/A';
                    return `${lastLog.area.name} - ${lastLog.duration} minutes `;
                }

    

    
         



    return (
        <>
            {!user ? <Navigate to="/signup" replace /> : null}

            <div className={styles.container}>
                <h1>Dashboard</h1>
                <h2 className={styles.date}>
                    Today {date.toLocaleDateString()}
                </h2> <div className={styles.buttons}>
                <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => navigate('/addtimelog')}
                    >
                        Add Time Log
                    </button>
                    <button className={styles.viewButton}>View Today</button>
                    </div>
                    <div className={styles.todaySummary}>
                        <h2 className={styles.todayAtAGlanceTitle}>Today at a Glance</h2>
                        <div className={styles.todayAtAGlanceGrid}>
                            <div className={styles.totalDuration}>
                                <h3>Total Focused Time</h3>
                                <p>{totalDuration()} minutes</p>
                            </div>
                            <div className={styles.mostFrequentArea}>
                                <h3>Most Frequent Area</h3>
                                <p>{mostFrequentArea(timeLogs)}</p>
                            </div>
                            <div className={styles.averageEnergyLevel}>
                                <h3>Average Energy After Session</h3>
                                <p>5/{afteravarageEnergyLevel()}</p>
                            </div>
                        </div>
                    </div>
                     <div className={styles.lastActivity}>
                        <h3>Last Activity</h3>
                        <p>{lastactivity(timeLogs)}</p>
                    </div>

                    <div className={styles.donutChart}> 
                    <DonutChart key={chartKey} timeLogs={timeLogs}   />
                    </div>
                   
            </div>
        </>
    );
}



