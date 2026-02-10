import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';


export default function Navbar({user, onLogout}) {    
    const [toggleMenu, setToggleMenu] = useState(false);
   
    function handleToggleMenu() {
        setToggleMenu(!toggleMenu);
    }
    return (<>
        {!user ? null : (
        <nav className={styles.navbar}>
            <div className={styles.logo}>Life OS</div>
           
           <div className={styles.navLinks}>
            <Link to ="/">Home</Link>
            <Link to ="/dashboard">Dashboard</Link>
            <Link to ="/focus">Focus</Link>
            <Link to ="/addtimelog">Add Time Log</Link>
            <Link to ="/insights">Insights</Link>
            
           </div>
           <div className={styles.userSection}>
            <span className={styles.userName} onClick={handleToggleMenu}>Hello, {user.name} </span>
            {toggleMenu && (
                <div className={styles.dropdownMenu}>
                    <Link to ="/areas" className={styles.dropdownLink}>Areas</Link>
                     <Link to ="/">Home</Link>
            <Link to ="/dashboard">Dashboard</Link>
            <Link to ="/focus">Focus</Link>
            <Link to ="/addtimelog">Add Time Log</Link>
            <Link to ="/insights">Insights</Link>
            <Link to ="/areas" className={styles.dropdownLink}>Areas</Link>
            

                    <button onClick={onLogout} className={styles.dropdownLink}>Logout</button>
                </div>
            )}
           </div>
           
        </nav>
        )}
        </>
    );
}