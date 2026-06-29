import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

type Pose = "greet" | "think" | "cheer";

export default function Mascot({ pose = "greet", size = 96 }: { pose?: Pose; size?: number }) {
  const mouth =
    pose === "cheer"
      ? "M40 56q12 12 24 0"
      : pose === "think"
      ? "M40 60h24"
      : "M40 58q12 6 24 0";
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="nb" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#9486E4" />
          <Stop offset="100%" stopColor="#5B4BD6" />
        </LinearGradient>
        <RadialGradient id="ns" cx="0.3" cy="0.25" r="0.6">
          <Stop offset="0%" stopColor="#fff" stopOpacity={0.7} />
          <Stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={50} cy={22} rx={20} ry={4} stroke="#BE8E3C" strokeWidth={2.4} fill="none" />
      <Path d="M22 56c0-15 12-26 28-26s28 11 28 26v14c0 4-3 7-7 7H29c-4 0-7-3-7-7z" fill="url(#nb)" />
      <Path d="M22 56c0-15 12-26 28-26s28 11 28 26v14c0 4-3 7-7 7H29c-4 0-7-3-7-7z" fill="url(#ns)" />
      <Circle cx={30} cy={56} r={4} fill="#F6DEDA" opacity={0.7} />
      <Circle cx={70} cy={56} r={4} fill="#F6DEDA" opacity={0.7} />
      {pose === "think" ? (
        <>
          <Path d="M34 44h8" stroke="#1A1A17" strokeWidth={3} strokeLinecap="round" />
          <Path d="M58 44h8" stroke="#1A1A17" strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Circle cx={38} cy={42} r={3.6} fill="#1A1A17" />
          <Circle cx={62} cy={42} r={3.6} fill="#1A1A17" />
        </>
      )}
      <Path d={mouth} stroke="#1A1A17" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M50 30v-8" stroke="#5B4BD6" strokeWidth={3} strokeLinecap="round" />
      <Circle cx={50} cy={20} r={3.5} fill="#BE8E3C" />
    </Svg>
  );
}
