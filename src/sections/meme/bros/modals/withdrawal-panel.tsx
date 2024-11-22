import Basic from "./basic";
import Header from "../components/withdrawal-panel/header";
import List from "../components/withdrawal-panel/list";

export default function Withdrawal({ list, open, onClose, onSuccess }: any) {
  return (
    <Basic
      open={open}
      onClose={onClose}
      className="w-full text-[14px] font-medium"
    >
      <Header num={list.length} />
      <List list={list} onSuccess={onSuccess} />
    </Basic>
  );
}
