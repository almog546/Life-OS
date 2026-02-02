import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

export default function Navbar({user, onLogout}) {    
    return (<>
        {!user ? null : (
        <nav className={styles.navbar}>
            <div className={styles.logo}>Life OS</div>
           <div className={styles.navLinks}>
            <Link to ="/">Home</Link>
            <Link to ="/dashboard">Dashboard</Link>
            <Link to ="/focus">Focus</Link>
            <Link to ="/addtimelog">Add Time Log</Link>
           </div>
           <div className={styles.userSection}>
            <span className={styles.userName}>Hello, {user.name}</span>
            <button onClick={onLogout}>Logout</button>
           </div>
        </nav>
        )}
        </>
    );
}