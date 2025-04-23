import clsx from "clsx";

export default function DoubleTokenIcons({
  size,
  className,
  icon0,
  icon1
}: {
  size: number;
  icon0: string;
  className?: string;
  icon1: string;
}) {
  return (
    <div
      className={clsx("relative", className)}
      style={{
        width: size,
        height: size
      }}
    >
      <img
        src={icon0}
        alt="token1"
        className="absolute top-0 left-0 w-full h-full"
        style={{
          clipPath: "polygon(0 0, 0 100%, 100% 0)"
        }}
      />
      <img
        src={icon1}
        alt="token2"
        className="absolute top-0 left-0 w-full h-full"
        style={{
          clipPath: "polygon(100% 0, 100% 0, 100% 100%, 0 100%, 0 100%)"
        }}
      />
    </div>
  );
}
