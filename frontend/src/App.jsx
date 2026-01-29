import { useState } from 'react'
import Signup from './Signup/Signup.jsx'
import Login from './Login/Login.jsx'
import { useEffect } from 'react'
import { useNavigate, useLocation, Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Home from './Home/Home.jsx'
import Focus from './Focus/Focus.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import AddTimeLog from './AddTimeLog/AddTimeLog.jsx'

function App() {
 const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logout, setLogout] = useState(false);

    async function onLogout() {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/logout`,
                {
                    method: 'POST',
                    credentials: 'include',
                },
            );
            if (res.ok) {
                setUser(null);
                setLogout(true);
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    }
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/me`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    },
                );
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [location]);
 

  return (
    <>
    
    <Routes>
      <Route path="/signup" element={<Signup  user={user} />} />
      <Route path="/login" element={<Login user={user} />} />
        <Route path="/" element={<Home user={user}  />} />
        <Route path="/focus" element={<Focus user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/addtimelog" element={<AddTimeLog />} />
            </Routes>
    </>
  )
}

export default App
