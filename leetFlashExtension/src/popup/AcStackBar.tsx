import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const options = {
  indexAxis: "y" as const,
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      display: false,
      ticks: {
        display: false,
      },
    },
    y: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        display: true,
      },
    },
  },
};

const labels = ["# AC"];

export function AcStackBar({ total, ac_count }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Accepted",
        data: [ac_count],
        backgroundColor: "rgb(75, 192, 192)",
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      {
        label: "Failed",
        data: [total - ac_count],
        backgroundColor: "rgb(255, 99, 132)",
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  };
  return <Bar options={options} data={data} />;
}
