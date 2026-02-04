import styles from './Dashboard.module.css';
import { useState, useEffect   } from 'react';
import { useNavigate,Navigate } from 'react-router-dom';
import { useRef } from 'react';
import DonutChart from '../DonutChart/DonutChart.jsx';




export default function Dashboard({ user }) {
    const [togglelogs, setTogglelogs] = useState('today');
    const [timeLogs, setTimeLogs] = useState([]);
    const [timeLogsWeek, setTimeLogsWeek] = useState([]);
    const [timeLogsMonth, setTimeLogsMonth] = useState([]);
    const [timeLogsYear, setTimeLogsYear] = useState([]);
    const navigate = useNavigate();
    const date = new Date();
    
    const [chartKey, setChartKey] = useState(0);
    const [weekChartKey, setWeekChartKey] = useState(0);
    const [monthChartKey, setMonthChartKey] = useState(0);
    const [yearChartKey, setYearChartKey] = useState(0);

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
        async function fetchTimeLogs() {
            try {
                const response = await fetch('http://localhost:3000/api/timelogs/week', {    
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setTimeLogsWeek(data.timeLogs);
                }
            } catch (error) {
                console.error('Error fetching time logs:', error);
            }
        }
        fetchTimeLogs();
    }, []);
     useEffect(() => {
        async function fetchTimeLogs() {
            try {
                const response = await fetch('http://localhost:3000/api/timelogs/month', {    
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setTimeLogsMonth(data.timeLogs);
                }
            } catch (error) {
                console.error('Error fetching time logs:', error);
            }
        }
        fetchTimeLogs();
    }, []);
      useEffect(() => {
        async function fetchTimeLogs() {
            try {
                const response = await fetch('http://localhost:3000/api/timelogs/year', {    
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setTimeLogsYear(data.timeLogs);
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
     useEffect(() => {
        const onResize = () => setWeekChartKey((prev) => prev + 1);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
     useEffect(() => {
        const onResize = () => setMonthChartKey((prev) => prev + 1);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
     useEffect(() => {
        const onResize = () => setYearChartKey((prev) => prev + 1);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    function totalDurationWeek() {
        
        return timeLogsWeek.reduce((total, log) => total + log.duration, 0);
    }
    function totalDurationMonth() {
        
        return timeLogsMonth.reduce((total, log) => total + log.duration, 0);
    }
    function totalDurationYear() {
        
        return timeLogsYear.reduce((total, log) => total + log.duration, 0);
    }
     function totalDurationdaily() {
        
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
                    function afteravarageEnergyLeveldaily() {
                        if (timeLogs.length === 0) return 0;
                        const totalEnergy = timeLogs.reduce((total, log) => total + log.energyAfter, 0);
                        return (totalEnergy / timeLogs.length).toFixed(1);
                    }
                     function afteravarageEnergyLevelweek() {
                        if (timeLogsWeek.length === 0) return 0;
                        const totalEnergy = timeLogsWeek.reduce((total, log) => total + log.energyAfter, 0);
                        return (totalEnergy / timeLogsWeek.length).toFixed(1);
                    }
                        function afteravarageEnergyLevelmonth() {
                        if (timeLogsMonth.length === 0) return 0;
                        const totalEnergy = timeLogsMonth.reduce((total, log) => total + log.energyAfter, 0);
                        return (totalEnergy / timeLogsMonth.length).toFixed(1);
                    }
                        function afteravarageEnergyLevelyear() {
                        if (timeLogsYear.length === 0) return 0;
                        const totalEnergy = timeLogsYear.reduce((total, log) => total + log.energyAfter, 0);
                        return (totalEnergy / timeLogsYear.length).toFixed(1);
                    }
                function lastactivity(logs) {
                    const
                        lastLog = logs.reduce((latest, log) => {
                            return new Date(log.createdAt) > new Date(latest.createdAt) ? log : latest;
                        }, logs[0]);
                    if (!lastLog) return 'N/A';
                    return `${lastLog.area.name} - ${lastLog.duration} minutes `;
                }
               
                function handleViewToday() {
                    setTogglelogs('today');
                }
                function handleViewWeek() {
                    setTogglelogs('week');
                }
                function handleViewMonth() {
                    setTogglelogs('month');
                }
                function handleViewYear() {
                    setTogglelogs('year');
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
                    <button className={styles.viewButton} onClick={() => navigate('/viewtoday')}>View Today</button>
                    </div>
                    <div className={styles.buttons}>
                    <button className={styles.viewButton} onClick={handleViewToday}>Today</button>
                    <button className={styles.viewButton} onClick={handleViewWeek}>Weekly</button>
                    <button className={styles.viewButton} onClick={handleViewMonth}>Monthly</button>
                    <button className={styles.viewButton} onClick={handleViewYear}>Yearly</button>
                    </div>
                    {togglelogs === 'today' && (
                        <div>
                            
                            {timeLogs.length === 0 ? (
                                <p>No time logs for today.</p>
                            ) : (
                                <ul className={styles.timeLogList}>
                    <div className={styles.todaySummary}>
                        <h2 className={styles.todayAtAGlanceTitle}>Today at a Glance</h2>
                        <div className={styles.todayAtAGlanceGrid}>
                            <div className={styles.totalDuration}>
                                <h3>Total Focused Time</h3>
                                <p>{totalDurationdaily()} minutes</p>
                            </div>
                            <div className={styles.mostFrequentArea}>
                                <h3>Most Frequent Area</h3>
                                <p>{mostFrequentArea(timeLogs)}</p>
                            </div>
                            <div className={styles.averageEnergyLevel}>
                                <h3>Average Energy After Session</h3>
                                <p>5/{afteravarageEnergyLeveldaily()}</p>
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
                                </ul>
                            )}
                        </div>
                    )}
                    {togglelogs === 'week' && (
                        <div>
                          
                            {timeLogsWeek.length === 0 ? (
                                <p>No time logs for this week.</p>
                            ) : (
                                 <ul className={styles.timeLogList}>
                    <div className={styles.todaySummary}>
                        <h2 className={styles.todayAtAGlanceTitle}>Week at a Glance</h2>
                        <div className={styles.todayAtAGlanceGrid}>
                            <div className={styles.totalDuration}>
                                <h3>Total Focused Time</h3>
                                <p>{totalDurationWeek()} minutes</p>
                            </div>
                            <div className={styles.mostFrequentArea}>
                                <h3>Most Frequent Area</h3>
                                <p>{mostFrequentArea(timeLogsWeek)}</p>
                            </div>
                            <div className={styles.averageEnergyLevel}>
                                <h3>Average Energy After Session</h3>
                                <p>5/{afteravarageEnergyLevelweek()}</p>
                            </div>
                        </div>
                    </div>
                                

                    <div className={styles.donutChart} style={{marginTop: '2rem'}}> 
                    <DonutChart key={weekChartKey} timeLogs={timeLogsWeek}   />
                    </div>
                                </ul>
                            )}
                        </div>
                    )}
                    {togglelogs === 'month' && (
                        <div>
                            
                            {timeLogsMonth.length === 0 ? (
                                <p>No time logs for this month.</p>
                            ) : (
                                 <ul className={styles.timeLogList}>
                    <div className={styles.todaySummary}>
                        <h2 className={styles.todayAtAGlanceTitle}>Month at a Glance</h2>
                        <div className={styles.todayAtAGlanceGrid}>
                            <div className={styles.totalDuration}>
                                <h3>Total Focused Time</h3>
                                <p>{totalDurationMonth()} minutes</p>
                            </div>
                            <div className={styles.mostFrequentArea}>
                                <h3>Most Frequent Area</h3>
                                <p>{mostFrequentArea(timeLogsMonth)}</p>
                            </div>
                            <div className={styles.averageEnergyLevel}>
                                <h3>Average Energy After Session</h3>
                                <p>5/{afteravarageEnergyLevelmonth()}</p>
                            </div>
                        </div>
                    </div>
                                

                    <div className={styles.donutChart} style={{marginTop: '2rem'}}> 
                    <DonutChart key={monthChartKey} timeLogs={timeLogsMonth}   />
                    </div>
                                </ul>
                            )}
                        </div>
                    )}
                    {togglelogs === 'year' && (
                        <div>
                            
                            {timeLogsYear.length === 0 ? (
                                <p>No time logs for this year.</p>
                            ) : (
                                  <ul className={styles.timeLogList}>
                    <div className={styles.todaySummary}>
                        <h2 className={styles.todayAtAGlanceTitle}>Year at a Glance</h2>
                        <div className={styles.todayAtAGlanceGrid}>
                            <div className={styles.totalDuration}>
                                <h3>Total Focused Time</h3>
                                <p>{totalDurationYear()} minutes</p>
                            </div>
                            <div className={styles.mostFrequentArea}>
                                <h3>Most Frequent Area</h3>
                                <p>{mostFrequentArea(timeLogsYear)}</p>
                            </div>
                            <div className={styles.averageEnergyLevel}>
                                <h3>Average Energy After Session</h3>
                                <p>5/{afteravarageEnergyLevelyear()}</p>
                            </div>
                        </div>
                    </div>
                                

                    <div className={styles.donutChart} style={{marginTop: '2rem'}}> 
                    <DonutChart key={yearChartKey} timeLogs={timeLogsYear}   />
                    </div>
                                </ul>
                            )}
                        </div>
                    )}
                   
            </div>
        </>
    );
}



