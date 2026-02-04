import styles from './AddTimeLog.module.css';
import { useState, useEffect  } from 'react';
import { Navigate } from 'react-router-dom';


export default function AddTimeLog({ user, handleShowText }) {
    const [timeLogs, setTimeLogs] = useState([]);
const [duration, setDuration] = useState('');
const [focusId, setFocusId] = useState('');
const [areaId, setAreaId] = useState('');
const [areas, setAreas] = useState([]);
const [focusItems, setFocusItems] = useState([]);
const [description, setDescription] = useState('');
const [energyBefore, setEnergyBefore] = useState('');
const [energyAfter, setEnergyAfter] = useState('');
const [attentionLevel, setAttentionLevel] = useState('');


useEffect(() => {
    async function fetchTimeLogs() {
        try {
            const response = await fetch('http://localhost:3000/api/timelogs', {    
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
    async function fetchAreas() {
        try {
            const response = await fetch('http://localhost:3000/api/areas', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setAreas(data.areas);
            }
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    }
    fetchAreas();
}, []);
useEffect(() => {
    async function fetchFocusItems() {
        try {
            const response = await fetch('http://localhost:3000/api/focus', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setFocusItems(data.focus);
            }
        } catch (error) {
            console.error('Error fetching focus items:', error);
        }
    }
    fetchFocusItems();
}, []);
async function createTimeLogChange(e) {
    e.preventDefault();
    try{
        const response = await fetch('http://localhost:3000/api/timelogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({duration: Number(duration), focusId: focusId ? Number(focusId) : undefined, areaId: Number(areaId), description, energyBefore: energyBefore ? Number(energyBefore) : undefined, energyAfter: energyAfter ? Number(energyAfter) : undefined, attentionLevel: attentionLevel ? Number(attentionLevel) : undefined }),
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            setTimeLogs([...timeLogs, data.newTimeLog]);
            handleShowText('Time log created successfully!');
            setDuration('');
            setFocusId('');
            setAreaId('');
            setDescription('');
            setEnergyBefore('');
            setEnergyAfter('');
            setAttentionLevel('');
        }
    } catch (error) {
        console.error('Error creating time log:', error);
    }
}



    return (
       <>
       {!user ? (
       <Navigate to="/signup" replace />
         ) : null}
       <div  className={styles.container}>
       <h1>Add Time Log</h1>
      
             <form className={styles.form} onSubmit={createTimeLogChange}>
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="What did you do?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    value={energyBefore}
                    onChange={(e) => setEnergyBefore(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Energy Before</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <select
                    value={energyAfter}
                    onChange={(e) => setEnergyAfter(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Energy After</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <select
                    value={attentionLevel}
                    onChange={(e) => setAttentionLevel(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Attention Level</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <div className={styles.selectContainer}>
                     <h4 className={styles.selectAreaMessage}>Select Area first</h4>
                <select
                    value={areaId}
                    onChange={(e) => setAreaId(e.target.value)}
                    className={styles.select}
                    required
                >
                    <option value="">Select Area</option>
                    {areas.map((area) => (
                        <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                </select>
                <select
                    value={focusId}
                    onChange={(e) => setFocusId(e.target.value)}
                    className={styles.select}
                    >
                    <option value="">Select Focus Item</option>
                    {focusItems.filter(focus => focus.areaId.toString() === areaId).map((focus) => (
                        <option key={focus.id} value={focus.id}>{focus.name}</option>
                    ))}
                </select>
                </div>
                
                
                <button type="submit" className={styles.addButton}>Add Time Log</button>
            </form>
            </div>
       </>
    );
}

 