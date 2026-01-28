import styles from './Focus.module.css';
import { useState, useEffect, use } from 'react';

export default function Focus() {
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
            }
        } catch (error) {
            console.error('Error deleting focus item:', error);
        }
    }


    return (
       <>
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
            <button className={styles.skipButton}>Skip</button>
            <button className={styles.continueButton}>Continue</button>
            </div>
        </div>
       
       </>
    );
}