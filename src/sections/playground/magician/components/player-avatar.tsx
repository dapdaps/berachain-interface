import clsx from "clsx";
import { EMove, Moves } from "../config";

const PlayerAvatar = (props: any) => {
  const { avatar, moves, className, avatarClassName } = props;

  return (
    <div
      className={clsx(
        "relative shrink-0 w-[44px] h-[44px] rounded-[10px] bg-no-repeat bg-center bg-contain",
        className,
        !avatar ? "bg-[url('/images/playground/magician/avatar-empty.png')]" : "",
      )}
      style={avatar ? {
        backgroundImage: `url("${avatar}")`,
      } : {}}
    >

    </div>
  );
};

export default PlayerAvatar;
