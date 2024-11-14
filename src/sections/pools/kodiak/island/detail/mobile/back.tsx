export default function Back({ onClick }: any) {
  return (
    <button onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width="31"
          height="31"
          rx="15.5"
          fill="#FFF5A9"
          stroke="#4B371F"
        />
        <path
          d="M18 22L13 16L18 10"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
