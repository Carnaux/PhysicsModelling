import { Text } from "@react-three/drei";

const fontProps = {
  font: "/Inter-Bold.woff",
  fontSize: 0.12,
  letterSpacing: -0.05,
  lineHeight: 1,
  "material-toneMapped": false,
};

export const Ruler = ({
  size,
  name,
  orientation,
  sign = 1,
  order = "crescent",
  position,
}: any) => {
  const createHorizontalIndicator = (i: number, label: string) => {
    return (
      <group key={`indicator_${i}`} position={[i, 0, 0]}>
        <mesh key={`dash_${i}`} position={[0, i % 1 != 0 ? 0 : -0.02, 0]}>
          <boxGeometry args={[0.02, i % 1 != 0 ? 0.1 : 0.15, 0.001]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <Text position={[0, -0.2, 0]} {...fontProps} children={label} />
      </group>
    );
  };

  const createVerticalIndicator = (i: number, label: string) => {
    return (
      <group key={`indicator_${i}`} position={[0, i, 0]}>
        <mesh key={`dash_${i}`} position={[i % 1 != 0 ? 0 : -0.02, 0, 0]}>
          <boxGeometry args={[i % 1 != 0 ? 0.1 : 0.15, 0.02, 0.001]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <Text position={[0.2, 0, 0]} {...fontProps} children={label} />
      </group>
    );
  };

  const generateRuler = () => {
    const indicators = [];
    for (let _i = 0; _i <= size; _i += 0.5) {
      const i = order === "crescent" ? _i : size - _i;
      const label = (i * sign).toString();
      if (orientation === "horizontal") {
        indicators.push(createHorizontalIndicator(i * sign, label));
      } else if (orientation === "vertical") {
        indicators.push(createVerticalIndicator(i * sign, label));
      }
    }

    return indicators.length > 0 ? (
      indicators
    ) : (
      <Text {...fontProps} children="No Ruler" />
    );
  };

  return (
    <group name={name} position={position}>
      {generateRuler()}
    </group>
  );
};
