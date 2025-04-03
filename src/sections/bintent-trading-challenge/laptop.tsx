import { memo } from "react";
import Leaderboard from "./components/leaderboard";
import TaskBoard from "./components/task-board";
export default memo(function Laptop() {
  return (
    <div className="absolute left-0 top-0 right-0 bottom-0 z-30 overflow-auto">
      <TaskBoard />
      <Leaderboard />
    </div>
  )
})
