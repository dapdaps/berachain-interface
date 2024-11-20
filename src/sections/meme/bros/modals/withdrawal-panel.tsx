import Basic from "./basic";
import Header from "../components/withdrawal-panel/header";
import List from "../components/withdrawal-panel/list";

export default function Withdrawal({ open, onClose }: any) {
  return (
    <Basic
      open={open}
      onClose={onClose}
      className="w-[520px] text-[14px] font-medium"
    >
      <Header />
      <List />
    </Basic>
  );
}
