import Header from "./header";
import Mydeposit from "./my-deposit";
import Earn from "./earn";
import Actions from "./actions";

export default function Laptop({ onBack = () => {} }: any) {
  return (
    <div className="h-[calc(100vh-380px)] overflow-y-auto">
      <Header />
      <div className="flex justify-between items-start mt-[16px]">
        <div>
          <Mydeposit />
          <Earn />
        </div>
        <Actions />
      </div>
    </div>
  );
}
