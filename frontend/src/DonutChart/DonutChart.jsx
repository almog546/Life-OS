import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ timeLogs }) {
    const areaDurations = timeLogs.reduce((acc, log) => {
        const areaName = log.area.name;
        if (!acc[areaName]) {
            acc[areaName] = 0;
        }
        acc[areaName] += log.duration;
        return acc;
    }, {});
    const data = {
        labels: Object.keys(areaDurations),
        datasets: [
            {
                label: 'Time Spent (minutes)',
                data: Object.values(areaDurations),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                    'rgba(83, 102, 255, 0.6)',
                    'rgba(255, 102, 204, 0.6)',
                    'rgba(102, 255, 178, 0.6)',
                    'rgba(255, 178, 102, 0.6)',
                    'rgba(178, 102, 255, 0.6)',

                    
                
                ],
                borderColor: [  
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(255, 102, 204, 1)',
                    'rgba(102, 255, 178, 1)',
                    'rgba(255, 178, 102, 1)',
                    'rgba(178, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return <Doughnut data={data} />;
}
    
