import { Navigate } from 'react-router-dom';
import styles from './Areas.module.css';
import { useState, useEffect } from 'react';




export default function Areas({ user , handleShowText}) {
  const [timeLogs, setTimeLogs] = useState([]);
const [editingArea, setEditingArea] = useState(null); 
const [newAreaName, setNewAreaName] = useState('');
const [deleteconfirm, setDeleteConfirm] = useState(false);
const [areas, setAreas] = useState([]);
const [areaId, setAreaId] = useState('');



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
  function handleareaduration(acc, log) {
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
}

async function deleteArea(id){
    try {
        const response = await fetch(`http://localhost:3000/api/areas/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            setTimeLogs(prev => prev.filter((log) => log.areaId !== id));
            handleShowText('Area deleted successfully!');
        }
    } catch (error) {
        console.error('Error deleting area:', error);
    }
}
async function editArea(id){
    try {
        const response = await fetch(`http://localhost:3000/api/areas/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newAreaName }),
        });
        const data = await response.json();
        if (response.ok) {
            
            handleShowText('Area edited successfully!');
        }
    } catch (error) {
        console.error('Error editing area:', error);
    }
}
function toggleEdit(areaId){
    setEditingArea(editingArea === areaId ? undefined : areaId);
}
function handleDeleteConfirm(areaId){
    setDeleteConfirm(deleteconfirm === areaId ? undefined : areaId);
}
async function transferAndDelete(id, newAreaId){
    try {
        const response = await fetch(`http://localhost:3000/api/timelogs/${id}/transfer`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ areaId: newAreaId }),
        });
        const data = await response.json();
        if (response.ok) {
            handleShowText('Area transferred successfully!');
             deleteArea(id);
             window.location.reload();
        }
    } catch (error) {
        console.error('Error transferring area:', error);
    }
}


      
  return (<>
  {!user ? (
   <Navigate to="/signup" replace />
  ) : null}

    <div className={styles.container}>
      <h1 className={styles.title}>Areas</h1>
      <p className={styles.description}>Manage how your time is categorized.</p>
        <div className={styles.areasList}>
        {Object.values(timeLogs.reduce(handleareaduration, {})).map((area) => (
            <div key={area.areaId} className={styles.areaCard}>
                <h2>{area.name}</h2>
                <p>Total Time Spent: {area.duration} minutes</p>
                <button className={styles.editButton} onClick={() => toggleEdit(area.areaId)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => handleDeleteConfirm(area.areaId)}>Delete</button>
                {deleteconfirm === area.areaId ? (
                    <div className={styles.deleteConfirm}>
                        <p>Delete Area</p>
                        <p>To delete this area, choose where to move its time</p>
                        
                            
                            
                
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
                                       <div>
                            <button className={styles.confirmButton} onClick={() => {transferAndDelete(area.areaId, areaId); setDeleteConfirm(false);}}>Transfer & Delete</button>
                        <button className={styles.cancelButton} onClick={() => setDeleteConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                ) : null}
                {editingArea  === area.areaId ? (
                    <form className={styles.editForm} onSubmit={() => editArea(area.areaId)}>
                        <input
                            type="text"
                            placeholder="New Area Name"
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            className={styles.input}
                        />
                        <button type="submit" className={styles.saveButton}>Save</button>
                        
                    </form>
                ) : null}
            </div>
        ))}
        </div>
        
    </div>
  </>);
}