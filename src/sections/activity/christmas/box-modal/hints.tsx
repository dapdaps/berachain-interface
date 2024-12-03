export default function Hints({ name }: any) {
  return (
    <>
      <div className="text-[14px] font-medium mt-[6px]">
        You got a <span className="font-bold">{name}</span>, you can
      </div>
      <div className="text-[14px] font-medium">
        check it in your{" "}
        <a href="/cave" className="underline">
          Bera Cave
        </a>
        .
      </div>
    </>
  );
}
