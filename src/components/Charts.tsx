import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useStore } from "../store/Store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = Array.from(Array(15).keys());

const dataPositionPlaceholder = {
  labels,
  datasets: [
    {
      label: "Body 1",
      data: [],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Body 2",
      data: [],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const dataVelocityPlaceholder = {
  labels,
  datasets: [
    {
      label: "Body 1",
      data: [],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Body 2",
      data: [],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const dataAccelerationPlaceholder = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const optionsPosition = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Position",
    },
  },
  scales: {
    x: {
      type: "linear",
      position: "bottom",
    },
  },
};

const optionsVelocity = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Velocity",
    },
  },
};

const optionsAcceleration = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Acceleration",
    },
  },
};

export function Charts() {
  const addAction = useStore((state) => state.addAction);
  const [dataPosition, setDataPosition] = useState(dataPositionPlaceholder);
  const [dataVelocity, setDataVelocity] = useState(dataVelocityPlaceholder);
  const [dataAcceleration, setDataAcceleration] = useState(
    dataAccelerationPlaceholder
  );

  useEffect(() => {
    addAction({
      target: "simulationData",
      trigger: "updateSimulationData",
      cb: (event) => {
        // console.log("Simulation data received:", event);

        const labelsTime =
          event.time.map((time: number) => time.toFixed(3)) || [];

        const _dataPosition: any = {
          datasets: [
            {
              label: "Dataset 1",
              data: event.objects[0].position.map((p: any) => {
                return { x: p[0] + 3, y: p[1] };
              }),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Dataset 2",
              data: event.objects[1].position.map((p: any) => {
                return { x: p[0], y: p[1] - 2.35 };
              }),
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };

        const _dataVelocity = {
          labels: labelsTime,
          datasets: [
            {
              label: "Dataset 1",
              data: event.objects[0].velocity.map((v: any) => v[0]),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Dataset 2",
              data: event.objects[1].velocity.map((v: any) => v[1]),
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };

        const _dataAcceleration = {
          labels: labelsTime,
          datasets: [
            {
              label: "Dataset 1",
              data: event.objects[0].acceleration.map((f: any) => f[0]),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Dataset 2",
              data: event.objects[1].acceleration.map((f: any) => f[1]),
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };

        setDataPosition(_dataPosition);
        setDataVelocity(_dataVelocity);
        setDataAcceleration(_dataAcceleration);
      },
    });
  }, [addAction]);

  return (
    <>
      <div className="chart-card">
        <Line options={optionsPosition as any} data={dataPosition} />
      </div>
      <div className="chart-card">
        <Line options={optionsVelocity} data={dataVelocity} />
      </div>
      <div className="chart-card">
        <Line options={optionsAcceleration} data={dataAcceleration} />
      </div>
    </>
  );
}
