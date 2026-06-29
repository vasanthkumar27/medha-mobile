import Svg, { Circle, Path, Rect, SvgProps } from "react-native-svg";

type Props = SvgProps & { size?: number; color?: string };

const wrap = (size: number, p: SvgProps) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  ...p,
});

export const IFlame = ({ size = 20, color = "#BE8E3C", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M12 2c1 3-1 4.5-2.5 6S7 11 7 13a5 5 0 0 0 10 0c0-2.5-1.7-4.2-2.5-6C13.5 4.5 13 3 12 2z" fill={color} />
  </Svg>
);
export const IDiamond = ({ size = 19, color = "#4E7CB6", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M6 3h12l3 5-9 13L3 8z" fill={color} opacity={0.9} />
  </Svg>
);
export const IHeart = ({ size = 20, color = "#C0534A", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" fill={color} />
  </Svg>
);
export const IBolt = ({ size = 18, color = "#5B4BD6", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M13 2 4 14h6l-1 8 9-12h-6z" fill={color} />
  </Svg>
);
export const IClose = ({ size = 26, color = "#A8A49B", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
  </Svg>
);
export const ICheck = ({ size = 14, color = "#fff", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M20 6 9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const ISend = ({ size = 17, color = "#fff", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="m22 2-7 20-4-9-9-4z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 2 11 13" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
export const IBack = ({ size = 18, color = "#7C7972", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const ILogo = ({ size = 15, color = "#fff", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 12v5c3 3 9 3 12 0v-5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const IScan = ({ size = 25, color = "#fff", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke={color} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 12h18" stroke={color} strokeWidth={2.3} strokeLinecap="round" />
  </Svg>
);
export const IHome = ({ size = 22, color = "#A8A49B", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M3 11l9-8 9 8" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 10v10h14V10" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const ICards = ({ size = 22, color = "#A8A49B", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Rect x={3} y={5} width={13} height={14} rx={2} stroke={color} strokeWidth={2.4} />
    <Path d="M21 8v11a2 2 0 0 1-2 2H8" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const IChat = ({ size = 22, color = "#A8A49B", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const IFile = ({ size = 22, color = "#A8A49B", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2v6h6M9 15l2 2 4-4" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const IUser = ({ size = 22, color = "#A8A49B", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2.4} />
    <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
  </Svg>
);
export const IBell = ({ size = 22, color = "#A8A49B", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13.7 21a2 2 0 0 1-3.4 0" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
  </Svg>
);
export const IRefresh = ({ size = 16, color = "#7C7972", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M21 2v6h-6" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 12a9 9 0 0 1 15-6.7L21 8" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const ILock = ({ size = 22, color = "#A8A49B", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={2.4} />
    <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const ISparkle = ({ size = 18, color = "#BE8E3C", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" fill={color} />
  </Svg>
);
export const ITrophy = ({ size = 24, color = "#BE8E3C", ...p }: Props) => (
  <Svg {...wrap(size, p)}>
    <Path d="M6 9V2h12v7a6 6 0 0 1-12 0z" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3M9 22h6M12 16v6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
