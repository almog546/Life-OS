import styles from './Focus.module.css';
import { useState, useEffect  } from 'react';
import { Navigate } from 'react-router-dom';

import { Link } from 'react-router-dom';


export default function Focus({ user, handleShowText }) {
    const [newFocus, setNewFocus] = useState([]);
    const [createfocusItem, setCreateFocusItem] = useState(false);
    const [name, setName] = useState('');
    const [areas, setAreas] = useState([]);
    const [areaId, setAreaId] = useState('');
    

    useEffect(() => {
        async function fetchFocusItems() {
            try {
                const response = await fetch('http://localhost:3000/api/focus', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setNewFocus(data.focus);
                }
            } catch (error) {
                console.error('Error fetching focus items:', error);
            }
        }
        fetchFocusItems();
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
    function creatfocusItemChange() {
        setCreateFocusItem(!createfocusItem);
    }
    async function handleCreateFocusItem(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/focus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, areaId: Number(areaId) }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setNewFocus([...newFocus, data.newFocus]);
                setName('');
                setCreateFocusItem(false);
                handleShowText('Focus item created successfully!');
            }
        } catch (error) {
            console.error('Error creating focus item:', error);
        }
    }
    async function deleteFocusItem(id){
        try {
            const response = await fetch(`http://localhost:3000/api/focus/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setNewFocus(newFocus.filter(item => item.id !== id));
                handleShowText('Focus item deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting focus item:', error);
        }
    }


    return (
       <>
       {!user ? (
       <Navigate to="/signup" replace />
         ) : null}
        <div className={styles.container}>
            <h1>Is there anything you’re already spending time on? </h1>
            <div className={styles.focusList}>
                {newFocus.map((item) => (
                    <div key={item.id} className={styles.focusItem}>
                        <p>{item.name}</p>
                        <button onClick={() => deleteFocusItem(item.id)} className={styles.deleteButton}>Delete</button>
                    </div>
                ))}
                {createfocusItem ? (
                    <form className={styles.createFocusForm} onSubmit={handleCreateFocusItem}>
                        <input
                            type="text"
                            placeholder="Focus Item Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
                        <select className={styles.select}
                            onChange={(e) => setAreaId(e.target.value)}
                            value={areaId}

                        >
                            <option value="">Select Area</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>{area.name}</option>
                            ))}
                        </select>
                        

                        <button type="submit" className={styles.addButton}>Add Focus Item</button>
                        <button onClick={creatfocusItemChange} className={styles.cancelButton}>Cancel</button>
                    </form>
                ) : (
                    <button onClick={creatfocusItemChange} className={styles.createButton}>Create New Focus Item</button>
                )}
            </div>
            <div className={styles.navigationButtons}>
            
             <Link to="/dashboard" className={styles.skipButton}>
                        Skip
                    </Link>

           
            <Link to="/dashboard" className={styles.continueButton}>Continue </Link>
            </div>
        </div>
       
       </>
    );
}