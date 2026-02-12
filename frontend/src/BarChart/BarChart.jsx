import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ labels, datasets, options, height = 300 }) {
  const data = {
    labels,
    datasets,
  };

  return <Bar data={data} options={options} height={height} />;
}
