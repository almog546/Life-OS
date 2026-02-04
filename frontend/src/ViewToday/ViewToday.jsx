import styles from './ViewToday.module.css';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';


export default function ViewToday({ user }) {
    const [timeLogs, setTimeLogs] = useState([]);
    const [editingLog, setEditingLog] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [editedDuration, setEditedDuration] = useState('');
    const [editedEnergyBefore, setEditedEnergyBefore] = useState('');
    const [editedEnergyAfter, setEditedEnergyAfter] = useState('');
    const [editedAttentionLevel, setEditedAttentionLevel] = useState('');
   

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
    async function handleDeleteLog(id) {
    

    try {
        const response = await fetch(`http://localhost:3000/api/timelogs/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            setTimeLogs(prev => prev.filter((log) => log.id !== id));
        }
    } catch (error) {
        console.error('Error deleting time log:', error);
    }
}

async function handleEditLog(id,e) {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:3000/api/timelogs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                description: editedDescription,
                duration: editedDuration === '' ? undefined : Number(editedDuration),
                energyBefore: editedEnergyBefore === '' ? undefined : Number(editedEnergyBefore),
                energyAfter: editedEnergyAfter === '' ? undefined : Number(editedEnergyAfter),
                attentionLevel: editedAttentionLevel === '' ? undefined : Number(editedAttentionLevel),
              
            }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.reload();
            setTimeLogs(prev =>
                prev.map((log) => (log.id === id ? data.updatedTimeLog : log))
            );
            
        }
    } catch (error) {
        console.error('Error editing time log:', error);
    }

}

function handleEditLogClick(id) {
    const logToEdit = timeLogs.find(
        (log) => log.id === Number(id)
    );
    if (!logToEdit) return;
    setEditingLog(logToEdit);
}





    return <>{!user ? (
        <Navigate to="/signup" replace />
    ) : (
        <div className={styles.container}>
            <h1>Today</h1>
           
            <div className={styles.timeLogs}>
                {timeLogs.length === 0 ? (
                    <p>No time logs for today.</p>
                ) : (
                    timeLogs.map((log) => (
                        <div key={log.id} className={styles.timeLog}>
                            <p className={styles.area}> Area: {log.area?.name}</p>
                            <p className={styles.focus}>{!log.focus ? null : 'Focus Item: ' + log.focus.name}</p>
                            <p className={styles.duration}>Duration: {log.duration} minutes</p>
                            <p className={styles.description}>Description: {log.description}</p>
                            <p className={styles.energyBefore}>Energy Before: {log.energyBefore}</p>
                            <p className={styles.energyAfter}>Energy After: {log.energyAfter}</p>
                            <p className={styles.attentionLevel}>Attention Level: {log.attentionLevel}</p>
                            <p className={styles.createdAt}>Created At: {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <button onClick={() => handleDeleteLog(log.id)} className={styles.deleteBtn}>Delete</button>
                            <button onClick={() => handleEditLogClick(log.id)} className={styles.editBtn}>Edit</button>
                            {editingLog && editingLog.id === log.id ? (
                                <form className={styles.editForm} onSubmit={(e) => handleEditLog(log.id,e)}>
                                    <input
                                        type="number"
                                        placeholder="Duration (minutes)"
                                        value={editedDuration}
                                        onChange={(e) => setEditedDuration(e.target.value)}
                                        className={styles.input}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        className={styles.input}
                                    />
                                    <select
                                        value={editedEnergyBefore}
                                        onChange={(e) => setEditedEnergyBefore(e.target.value)}
                                        className={styles.input}
                                    >
                                        <option value="">Energy Before</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    <select
                                        value={editedEnergyAfter}
                                        onChange={(e) => setEditedEnergyAfter(e.target.value)}
                                        className={styles.input}
                                    >
                                        <option value="">Energy After</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>    
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    <select
                                        value={editedAttentionLevel}
                                        onChange={(e) => setEditedAttentionLevel(e.target.value)}
                                        className={styles.input}
                                    >
                                        
                                    
                                        <option value="">Attention Level</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                  
                                    <button  className={styles.saveBtn} type='submit' >Save</button>
                                    <button type="button" onClick={() => setEditingLog(false)} className={styles.cancelBtn}>Cancel</button>
                                </form>
                            ) : null}
                            
                        </div>
                    ))
                )}
            </div>
                
        </div>
    )}
    </>
    
}