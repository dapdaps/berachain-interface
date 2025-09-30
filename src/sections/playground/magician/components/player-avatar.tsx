import clsx from "clsx";
import { EMove, Moves } from "../config";

const PlayerAvatar = (props: any) => {
  const { avatar, moves, className, avatarClassName, isMoveAvatar = true } = props;

  return (
    <div
      className={clsx(
        "relative shrink-0 w-[44px] h-[44px] rounded-[10px] bg-no-repeat bg-center bg-contain flex justify-center",
        className,
        !avatar ? "bg-[url('/images/playground/magician/avatar-empty.png')]" : "",
      )}
      style={avatar ? {
        backgroundImage: `url("${avatar}")`,
      } : {}}
    >
      {
        typeof moves === "number" && isMoveAvatar && (
          <img
            src={Moves[moves as EMove]?.avatar}
            alt=""
            className={clsx("w-[30px] h-[29px] object-center object-contain shrink-0 absolute top-[-20px]", avatarClassName)}
          />
        )
      }
    </div>
  );
};

export default PlayerAvatar;
