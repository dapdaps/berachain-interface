import { useState } from "react";
import IconSend from "@public/images/chat/send.svg";
import IconCheckPosition from "@public/images/chat/check-position.svg";
import IconWallet from "@public/images/chat/wallet.svg";
import IconTopVault from "@public/images/chat/top-vault.svg";
import InterestItem, { INTEREST_ITEMS } from "./InterestItem";
import QuickOptionTabs from "./QuickOptionTabs";

// 选项数据定义
const optionItems = [
  {
    id: "positions",
    icon: <IconCheckPosition />,
    text: "Check my positions",
  },
  {
    id: "wallet",
    icon: <IconWallet />,
    text: "Check my wallet assets",
  },
  {
    id: "vault",
    icon: <IconTopVault />,
    text: "Top vault via my assets",
  },
];

export default function MainSection() {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("positions");

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log("Submitted:", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[620px] h-full mx-auto mt-[62px]">
        <div className="relative w-full">
          <textarea
            className="w-full min-h-[80px] py-4 px-4 rounded-lg border border-black bg-white shadow-[inset_6px_5px_0px_0px_rgba(0,0,0,0.25)] focus:outline-none resize-none"
            placeholder="What are you feeling to do today?"
            value={inputValue}
            onChange={handleInputChange}
            style={{
              fontFamily: "Montserrat",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "100%",
            }}
          />
          <div className="absolute right-3 bottom-3" onClick={handleSubmit}>
            <IconSend />
          </div>
        </div>

        <QuickOptionTabs
          options={optionItems}
          selectedOption={selectedOption}
          onOptionClick={handleOptionClick}
          className="mt-4"
        />

        <div className="w-full mt-20 font-Montserrat">
          <h2 className="font-Montserrat text-[13px] font-[700] leading-[13px] mb-3">
            You might be interested in
          </h2>
          <div className="flex flex-col gap-2">
            {INTEREST_ITEMS.map((item, index) => (
              <InterestItem
                key={index}
                item={{
                  ...item,
                  onClick: () =>
                    console.log("Interest item clicked:", item.title),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
