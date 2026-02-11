import styles from './Calendar.module.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState, } from 'react';
import dayjs from 'dayjs';



export default function Calendar() {
    const [timeLogs, setTimeLogs] = useState([]);
   

    useEffect(() => {
        async function fetchAlltimeData() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timelogs`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setTimeLogs(data.timeLogs);
                }
            } catch (error) {
                console.error('Error fetching all-time data:', error);
            }
        }
        fetchAlltimeData();
    }, []);
    

    function transformTimeLogsToEvents(logs) {
        const totalsByDay = logs.reduce((acc, log) => {
            const day = dayjs(log.createdAt).format('YYYY-MM-DD');

            if (!acc[day]) {
                acc[day] = 0;
            }
            acc[day] += log.duration;
            return acc;
        }, {});

        return Object.entries(totalsByDay).map(([date, totalDuration]) => {
            const hours = Math.floor(totalDuration / 60);
            const minutes = totalDuration % 60;
            
            let timeString = '';
            if (hours > 0) {
                timeString = `${hours}h ${minutes}m`;
            } else {
                timeString = `${minutes}m`;
            }
            
            return {
                title: timeString,
                date,
                className: styles.calendarEvent
            };
        });
    }
    

    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <h2>Calendar</h2>
            </div>
            <div className={styles.calendarCard}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek'
                    }}
                    height="50rem"
                    events={transformTimeLogsToEvents(timeLogs)}
                  
                />
            </div>
        </div>
    );
}
