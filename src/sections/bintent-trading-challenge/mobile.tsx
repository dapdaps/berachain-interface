import { memo } from "react";
import TaskBoard from "./components/task-board";
import Leaderboard from "./components/leaderboard";
import AirshipSvg from "@public/images/campaign/mobile/airship.svg";

export default memo(function Mobile() {
  return (
    <div className="pt-[50px] px-[8px] absolute left-0 top-0 right-0 bottom-0 z-30 overflow-auto">
      <AirshipSvg />
      <TaskBoard />
      <Leaderboard />
    </div>
  )
})
