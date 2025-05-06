export default function LabelIcon({ width, className }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="36"
      width="50"
      viewBox={`0 0 50 36`}
      fill="none"
      className={className}
      style={{
        transform: `scaleX(${width / 50})`,
        transformOrigin: "left"
      }}
    >
      <path d="M0 0H50L40 36H0V0Z" fill="#392C1D" />
    </svg>
  );
}
