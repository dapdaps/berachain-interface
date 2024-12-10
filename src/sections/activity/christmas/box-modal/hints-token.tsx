export default function TokenHints({ amount }: any) {
  return (
    <>
      <div className="text-[14px] font-medium mt-[6px]">
        You got a <span className="font-bold">{amount} $Snowflake</span>
      </div>
      <div className="text-[14px] font-medium">
        Trade now or hold? Up to you 😏
      </div>
      <div className="w-[233px] flex justify-around">
        {/* <button className="text-[16px] font-bold underline">Bex</button> */}
        <a
          href="/dex/kodiak"
          target="_blank"
          className="text-[16px] font-bold underline"
        >
          Kodiak
        </a>
      </div>
    </>
  );
}
