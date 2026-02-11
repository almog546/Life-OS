import { use } from 'react';
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api/axios';




export default function Home({ user, handleShowText }) {
    const [areas, setAreas] = useState([]);
    const [editingArea, setEditingArea] = useState(false); 
    const [newAreaName, setNewAreaName] = useState('');
    const [createAreaName, setCreateAreaName] = useState(false);
    
    const [newArea, setNewArea] = useState('');
   
    useEffect(() => {
        async function fetchAreas() {
            try {
                const response = await api.get('/api/areas');
                if (response.status === 200) {
                    setAreas(response.data.areas);
                }
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        }
        fetchAreas();
    }, []);
    function handleEditClick(id, currentName) {
        setEditingArea(prevId => (prevId === id ? null : id));
        setNewAreaName(currentName);
    }
    async function updateAreaName(id){
        try {
            const response = await api.put(`/api/areas/${id}`, { name: newAreaName });
            if (response.status === 200) {
                setAreas(areas.map(area => area.id === id ? response.data.area : area));
                setEditingArea(false);
                handleShowText('Area updated successfully!');
            }
        } catch (error) {
            console.error('Error updating area:', error);
        }
    }
    async function deleteArea(id){
        try {
            const response = await api.delete(`/api/areas/${id}`);
            if (response.status === 200) {
                setAreas(areas.filter(area => area.id !== id));
                handleShowText('Area deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting area:', error);
        }
    }
    async function createArea(){
        try {
            const response = await api.post('/api/areas', { name: newArea });
            if (response.status === 201 || response.status === 200) {
                setAreas([...areas, response.data.area]);
                setNewArea('');
                handleShowText('Area created successfully!');
            }
        } catch (error) {
            console.error('Error creating area:', error);
        }
    }
    function creatnewAreaChange(){
        setCreateAreaName(true);
    }

    return (
        <>
        {!user ? (
            <Navigate to="/signup" replace />
        ) : null}<>
            <div className={styles.container}>
               <h1>Split your life into areas</h1>
              
                <div className={styles.areas}>
                    {areas.map((area) => (
                        <div key={area.id} className={styles.area}>
                            <h2>{editingArea === area.id ? (
                                <>
                                <textarea
                                    value={newAreaName}
                                    onChange={(e) => setNewAreaName(e.target.value)}
                                    className={styles.textarea}
                                  
                                />
                                <button onClick={() => updateAreaName(area.id)} className={styles.saveButton}>Save</button>
                                </>
                            ) : (
                                area.name
                            )}</h2>
                            <button onClick={() => handleEditClick(area.id, area.name)}>{editingArea === area.id ? 'Cancel' : 'Edit'}</button>
                            <button onClick={() => deleteArea(area.id)}>Delete</button>
                        </div>
                        
                       
                    ))}
                </div>
                <div className={styles.createArea}>
                    {createAreaName ? (
                        <>
                        <input
                            type="text"
                            placeholder="New Area Name"
                            value={newArea}
                            onChange={(e) => setNewArea(e.target.value)}
                        />
                        <button onClick={createArea} className={styles.createButton}>Create Area</button>
                        <button onClick={() => setCreateAreaName(false)} className={styles.cancelButton}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={creatnewAreaChange} className={styles.createButton}>+ Create New Area</button>
                    )}
                    
                     <Link to="/focus" className={styles.continueButton}>Continue</Link>
                </div>
            </div>
            </>
        </>
    );
}