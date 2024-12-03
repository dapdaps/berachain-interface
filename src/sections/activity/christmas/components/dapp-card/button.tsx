import BasicButton from "../../task-modal/button";
import PresentIcon from "../../task-modal/present-icon";

export default function Button({ action, reward, className }: any) {
  return (
    <BasicButton className={className}>
      <span>{action}</span>
      {new Array(reward).fill(1).map((i: any) => (
        <PresentIcon key={i} />
      ))}
    </BasicButton>
  );
}
