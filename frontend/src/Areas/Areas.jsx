import styles from './Areas.module.css';
import { useState, useEffect } from 'react';

export default function Areas() {
  const [timeLogs, setTimeLogs] = useState([]);

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
    function handleareaduration() {
        timeLogs.reduce((acc, log) => acc + log.duration, 0);

    }
        
      
  return (
    <div className={styles.container}>
      <h1>Areas</h1>
      <p>Manage how your time is categorized.</p>
        <div className={styles.areasList}>
            {timeLogs.map(log => (
                <div key={log.id} className={styles.areaCard}>
                    <h3>{log.area.name}</h3>
                    <p>Duration: {log.duration} minutes</p>
                    
                    
                </div>
            ))}
        </div>
        
    </div>
  );
}