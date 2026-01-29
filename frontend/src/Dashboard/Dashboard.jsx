import styles from './Dashboard.module.css';
import { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {

const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1>Today</h1>         
            <h2>Your Time Logs for Today</h2>
             <button type="submit" className={styles.addButton} onClick={() => navigate('/addtimelog')}>Add Time Log</button>
                
         
            </div>
    );
}


