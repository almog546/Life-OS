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
import Navbar from './Navbar/Navbar.jsx'
import ViewToday from './ViewToday/ViewToday.jsx'
import Areas from './Areas/Areas.jsx'
import InsightsPage from './InsightsPage/InsightsPage.jsx'
import Calendar from './Calendar/Calendar.jsx'
import api from './api/axios';




function App() {
 const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logout, setLogout] = useState(false);
     const [showText, setShowText] = useState('');

    async function onLogout() {
        try {
            const res = await api.post('/api/auth/logout');
            if (res.status === 200) {
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
            const res = await api.get('/api/auth/me');
            if (res.status === 200) {
                setUser(res.data.user);
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
}, []);
if (loading) {
    return <div>Loading...</div>;
}


    function handleShowText(text) {
        setShowText(text);

        setTimeout(() => {
              setShowText('');
            }, 2000);
    }
 

  return (
    <>
    {showText && <div className="globalToast">{showText}</div>}
        <Navbar user={user} onLogout={onLogout} />
    
    <Routes>
      <Route path="/signup" element={<Signup  user={user} handleShowText={handleShowText} />} />
      <Route path="/login" element={<Login user={user} setUser={setUser} handleShowText={handleShowText} />} />
        <Route path="/" element={<Home user={user} handleShowText={handleShowText} />} />
        <Route path="/focus" element={<Focus user={user} handleShowText={handleShowText} />} />
        <Route path="/dashboard" element={<Dashboard user={user} handleShowText={handleShowText} />} />
        <Route path="/addtimelog" element={<AddTimeLog user={user} handleShowText={handleShowText} />} />
        <Route path="/viewtoday" element={<ViewToday user={user} handleShowText={handleShowText} />} />
        <Route path="/areas" element={<Areas user={user} handleShowText={handleShowText} />} />
        <Route path="/insights" element={<InsightsPage user={user} handleShowText={handleShowText} />} />
        <Route path="/calendar" element={<Calendar user={user} handleShowText={handleShowText} />} />
           

            </Routes>
    </>
  )
}

export default App
