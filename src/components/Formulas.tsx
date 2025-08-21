import { useEffect, useState } from "react";
import { useStore } from "../store/Store";

import "../styles/Formulas.css";
export const Formulas = () => {
  const addAction = useStore((state) => state.addAction);

  const [t, setT] = useState(0);
  const [simData, setSimData] = useState<any>({
    pi: 0,
    pv: 0,
    position: 0,
    velocity: 0,
    acceleration: 0,
  });

  useEffect(() => {
    addAction({
      target: "formulaData",
      trigger: "updateFormulaData",
      cb: (event) => {
        // console.log("Simulation data received:", event);
        setT(event.time[event.time.length - 1].toFixed(2));
        setSimData({
          pi: event.objects[0].initialP[0],
          pv: event.objects[0].initialV[0],
          position: event.objects[0].position.at(-1),
          velocity: event.objects[0].velocity.at(-1),
          acceleration: event.objects[0].acceleration.at(-1),
        });
      },
    });
  }, [addAction]);

  return (
    <div className="formulas">
      <div className="bodyFormulas">
        <h2>Formulas</h2>
        <div className="formula">
          <p>
            Position:
            <br />
            <span>x = x₀ + v₀ * t + ½ * a * t²</span>
            <br />
            <span>
              x = {simData.pi} + {simData.pv} * {t} + ½ a{" "}
              {Math.pow(t, 2).toFixed(2)}
            </span>
          </p>
        </div>
        <div className="formula">
          <p>
            Velocity: <span>v = v₀ + at</span>
          </p>
        </div>
        <div className="formula">
          <p>
            Acceleration: <span>a = f / m</span>
          </p>
        </div>
      </div>
      <div className="bodyFormulas">
        <h2>Formulas</h2>
        <div className="formula">
          <p>
            Position:{" "}
            <span>
              x = x₀ + v₀{t} + ½a{Math.pow(t, 2).toFixed(2)}
            </span>
          </p>
        </div>
        <div className="formula">
          <p>
            Velocity: <span>v = v₀ + at</span>
          </p>
        </div>
        <div className="formula">
          <p>
            Acceleration: <span>a = f / m</span>
          </p>
        </div>
      </div>
    </div>
  );
};
