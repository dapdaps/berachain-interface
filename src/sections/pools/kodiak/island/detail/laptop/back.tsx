export default function Back({ onClick }: any) {
  return (
    <button onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width="33"
          height="33"
          rx="10.5"
          fill="white"
          stroke="#373A53"
        />
        <path
          d="M20 11L15.2 17L20 23"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
