import { useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect, use, useCallback } from "react";
import { Vector3, type Group } from "three";
import { Line } from "@react-three/drei";
import { useStore } from "../store/Store";
import { Ruler } from "./Ruler";
const pulleyPosition = new Vector3(0, 0, 0); // Position of the pulley

const g = 9.81; // Gravitational acceleration in m/s^2

export const Simulation = ({ runSim }: any) => {
  const triggerAction = useStore((state) => state.triggerAction);
  const addAction = useStore((state) => state.addAction);

  const [renderObjects, setRenderObjects] = useState<any[]>([]); // Array to hold objects to be rendered

  const T = useRef(0); // Time in seconds

  const groupRef = useRef<Group | null>(null); // Reference to the group in the simulation
  const objects = useRef<any[]>([]); // Array to hold objects in the simulation

  const simulationData = useRef<any>({}); // Object to hold simulation data

  // const lineHorizontalRef = useRef<any>(null); // Reference for the horizontal line
  // const lineVerticalRef = useRef<any>(null); // Reference for the vertical line

  const getVelocity = (initialV: number, a: number, t: number) => {
    return initialV + a * t;
  };

  const getPosition = (
    initialP: number,
    initialV: number,
    t: number,
    a: number
  ) => {
    return initialP + initialV * t + 0.5 * a * Math.pow(t, 2);
  };

  const Step = (t: number) => {
    if (objects) {
      const totalMass = objects.current.reduce(
        (p_obj, obj) => p_obj + obj.mass,
        0
      );

      const a = (objects.current[1].mass * g) / totalMass;

      // Calculate forces for each object
      objects.current.forEach((obj, index) => {
        const weight = [0, -obj.mass * g, 0]; // Weight force
        if (obj.contactWithGround) {
          weight[1] += obj.mass * g; // Add normal force if in contact with ground
        }

        // TODO improve decision on what has traction
        // For now, assume only the horizontal object has traction
        // and it only has traction in the X axis
        const traction = [0, 0, 0];
        if (obj.connectedTo.length > 0) {
          if (obj.connectedTo.length > 1) {
            // Multiple forces in the X and Y axes for traction
          } else {
            // Single force in the X axis for traction
            if (!objects.current[1].contactWithGround) {
              traction[obj.contactWithGround ? 0 : 1] = obj.mass * a;
            }
          }
        }

        obj.forces.push([weight, traction]);

        const currentResultantForce = [
          weight[0] + traction[0],
          weight[1] + traction[1],
          weight[2] + traction[2],
        ];
        obj.resultantForce.push(currentResultantForce);

        const currentAcceleration = [
          currentResultantForce[0] / obj.mass,
          currentResultantForce[1] / obj.mass,
          currentResultantForce[2] / obj.mass,
        ];

        obj.acceleration.push(currentAcceleration);

        let newVelocity = [0, 0, 0];
        let newPosition = [0, 0, 0];
        if (obj.position.length != 0) {
          newVelocity = [...obj.velocity[obj.velocity.length - 1]];
          newPosition = [...obj.position[obj.position.length - 1]];
        } else {
          newVelocity = [...obj.initialV];
          newPosition = [...obj.initialP];
        }

        if (currentAcceleration[0] < 0 || currentAcceleration[0] > 0) {
          const vX = getVelocity(obj.initialV[0], a, t);
          const pX = getPosition(
            obj.initialP[0],
            obj.initialV[0],
            t,
            a * Math.sign(currentResultantForce[0])
          );

          if (pX >= -0.1 - obj.width / 2) {
            //object has reached a wall, stop it
            newVelocity[0] = 0;
            newPosition[0] = -0.1; // stop at the wall
          } else {
            newVelocity[0] = vX;
            newPosition[0] = pX;
          }
        }

        if (currentAcceleration[1] < 0 || currentAcceleration[1] > 0) {
          const vY = getVelocity(obj.initialV[1], a, t);
          const pY = getPosition(
            obj.initialP[1],
            obj.initialV[1],
            t,
            a * Math.sign(currentResultantForce[1])
          );

          if (pY <= -obj.height / 2) {
            //object has reached a ground, stop it
            newVelocity[1] = 0;
            newPosition[1] = 0; // stop at ground
            obj.contactWithGround = true; // mark as in contact with ground
          } else {
            newVelocity[1] = vY;
            newPosition[1] = pY;
          }
        }

        obj.velocity.push(newVelocity);
        obj.position.push(newPosition);

        groupRef.current?.children[index].position.set(
          newPosition[0],
          newPosition[1],
          newPosition[2]
        );
      });

      const simData = simulationData.current;
      simData.a = [...simData.a, a];
      simData.g = [...simData.g, g];
      simData.time = [...simData.time, t];

      triggerAction(
        "updateSimulationData",
        "simulationData",
        undefined,
        simData
      );

      triggerAction("updateFormulaData", "formulaData", undefined, simData);
      simulationData.current = simData;
    }
  };

  const SimSetup = () => {
    const newObjects = [
      {
        id: "cube_1",
        width: 0.3,
        height: 0.3,
        mass: 80,
        connectedTo: [1],
        contactWithGround: true,
        initialP: [-3, 2.7, 0],
        initialV: [0, 0, 0],
        position: [],
        velocity: [],
        acceleration: [],
        forces: [],
        resultantForce: [],
      },
      {
        id: "cube_2",
        width: 0.3,
        height: 0.3,
        mass: 10,
        connectedTo: [0],
        contactWithGround: false,
        initialP: [0, 2.35, 0],
        initialV: [0, 0, 0],
        position: [],
        velocity: [],
        acceleration: [],
        forces: [],
        resultantForce: [],
      },
    ];

    objects.current = newObjects;
    simulationData.current = {
      a: [],
      g: [],
      objects: newObjects,
      time: [],
    };

    setRenderObjects(
      newObjects.map((obj) => {
        return {
          id: obj.id,
          width: obj.width,
          height: obj.height,
          position: obj.initialP,
        };
      })
    ); // Update render objects state

    console.log(
      "Simulation setup with objects:",
      newObjects.map((obj) => obj.id)
    );
  };

  const resetSimulation = useCallback(() => {
    T.current = 0;
    objects.current = [];
    setRenderObjects([]);
    simulationData.current = { a: [], g: [], objects: [], time: [] };
    SimSetup();
    console.log("Simulation reset");
  }, [setRenderObjects]);

  // Simulation setup
  useEffect(() => {
    SimSetup();
  }, [setRenderObjects]);

  // Step simulation in render loop
  useFrame((state, delta) => {
    if (runSim && objects.current.length > 0 && T.current < 3) {
      Step(T.current);
      T.current += delta;
    }
  });

  // Reset simulation
  useEffect(() => {
    addAction({
      target: "simulation",
      trigger: "ResetSim",
      cb: () => {
        resetSimulation();
      },
    });
  }, [addAction, resetSimulation]);

  return (
    <group ref={groupRef}>
      {/* Render objects based on positions and other properties */}
      {renderObjects.map((obj) => (
        <mesh
          key={obj.id}
          name={obj.id}
          position={obj.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[obj.width, obj.height, obj.width]} />
          <meshStandardMaterial color={obj.id === "cube_1" ? "red" : "green"} />
        </mesh>
      ))}

      {/* base */}
      <mesh position={[-1.9, 1.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2.6, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      {/* pulley */}
      <group position={[-0.35, 2.6, 0]}>
        <mesh rotation={[0, 0, Math.PI / 7]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.15, 0.15]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
      <Ruler
        position={[-3, 2.55, 0.55]}
        orientation={"horizontal"}
        size={2.5}
        name="Ruler"
      />
      <Ruler
        position={[0.4, 2.35, 0.55]}
        orientation={"vertical"}
        size={2.5}
        sign={-1}
        order={"descending"}
        name="Ruler"
      />

      {renderObjects.length > 0 && (
        <group>
          <Line
            points={[objects.current[0].position, pulleyPosition]}
            color={"#23aaff"} // Default
          />
          <Line
            points={[objects.current[1].position, pulleyPosition]}
            color={"#ff2323"} // Default
          />
        </group>
      )}
    </group>
  );
};
