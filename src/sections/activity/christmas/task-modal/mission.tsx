import Button from "./button";
import PresentIcon from "./present-icon";
import CheckedButton from "./checked-button";

export default function Mission({ mission }: any) {
  return (
    <div className="mt-[10px] bg-black/5 rounded-[10px] h-[78px] px-[16px] flex justify-between items-center">
      <div className="text-[16px] font-medium">{mission.desc}</div>
      {/* <CheckedButton /> */}

      <Button>
        <span>{mission.action}</span>
        {new Array(mission.reward).fill(1).map((i: any) => (
          <PresentIcon key={i} />
        ))}
      </Button>
    </div>
  );
}
