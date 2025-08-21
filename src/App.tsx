import "./styles/App.css";
import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { Simulation } from "./components/Simulation";
import { useEffect, useRef, useState } from "react";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { Charts } from "./components/Charts";
import { Formulas } from "./components/Formulas";
import { useStore } from "./store/Store";

function App() {
  const triggerAction = useStore((state) => state.triggerAction);
  const [setupDone, setSetupDone] = useState(false);
  const [runSim, setRunSim] = useState(false);

  return (
    <div className="App">
      <div className="topRow">
        <div className="formulasContainer">
          <div className="controlsContainer">
            <button
              onClick={() => {
                setRunSim(true);
              }}
            >
              Run
            </button>
            <button
              onClick={() => {
                triggerAction("ResetSim", "simulation");
              }}
            >
              Rerun
            </button>
          </div>
          <Formulas />
        </div>
        <div className="viewerContainer">
          <Canvas shadows camera={{ position: [-0.5, 5, 4] }}>
            <fog attach="fog" args={["black", 15, 22.5]} />
            <Simulation runSim={runSim} />
            <Grid
              renderOrder={-1}
              position={[0, 0, 0]}
              infiniteGrid
              cellSize={0.6}
              cellThickness={0.6}
              sectionSize={3.3}
              sectionThickness={1.5}
              fadeDistance={30}
            />
            <OrbitControls enableZoom={false} makeDefault />
            <EffectComposer enableNormalPass={false}>
              <Bloom luminanceThreshold={2} mipmapBlur />
              <ToneMapping />
            </EffectComposer>
            <Environment background preset="sunset" blur={0.8} />
          </Canvas>
        </div>
      </div>
      <div className="chartsContainer">
        <Charts />
      </div>
    </div>
  );
}

export default App;
