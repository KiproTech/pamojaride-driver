import { Bar } from  "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EarningsChart = ({ trips }) => {
  const labels = trips.map((trip) => `${trip.start} → ${trip.destination}`);
  const data = {
    labels,
    datasets: [
      {
        label: "Amount Collected (KES)",
        data: trips.map((trip) => trip.amount),
        backgroundColor: "#4ade80",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Earnings per Trip" },
    },
  };

  return (
    <div className="earnings-chart">
      <Bar data={data} options={options} />
    </div>
  );
};

export default EarningsChart;