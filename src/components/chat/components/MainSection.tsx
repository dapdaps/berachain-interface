import { useState } from "react";
import IconSend from "@public/images/chat/send.svg";
import InterestItem from "./InterestItem";
import QuickOptionTabs from "./QuickOptionTabs";
import { useChatContext } from "../context/chat-context";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

export default function MainSection() {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<any>();

  const { sendChatMessage, vaults, setIsFromHistory } = useChatContext();

  const { address } = useAccount();
  const { open } = useAppKit();

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleOptionClick = async (option: any) => {
    if (!address) {
      open();
      return;
    }

    setSelectedOption(option);
    const userMessage = option.content;
    setInputValue("");
    await sendChatMessage(userMessage);
    setIsFromHistory(false);
  };

  const handleSubmit = async () => {
    if (!address) {
      open();
      return;
    }

    if (inputValue.trim()) {
      const userMessage = inputValue;
      setInputValue("");
      await sendChatMessage(userMessage);
      setIsFromHistory(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[620px] h-full mx-auto mt-[62px]">
        <div className="relative w-full">
          <textarea
            className="font-Montserrat text-[14px] font-[500] leading-[12px] w-full min-h-[80px] py-4 px-4 rounded-lg border border-black bg-white shadow-[inset_6px_5px_0px_0px_rgba(0,0,0,0.25)] focus:outline-none resize-none"
            placeholder="What do you feel like doing today?"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div
            className="absolute right-3 bottom-3 cursor-pointer"
            onClick={handleSubmit}
          >
            <IconSend />
          </div>
        </div>

        <QuickOptionTabs
          options={vaults.recommendChat}
          loading={vaults.recommendChatLoading}
          selectedOption={selectedOption}
          onOptionClick={handleOptionClick}
          className="mt-4"
        />

        {vaults.recommendList?.length > 0 && (
          <div className="w-full mt-20 font-Montserrat">
            <h2 className="font-Montserrat text-[13px] font-[700] leading-[13px] mb-3">
              You might be interested in
            </h2>
            <div className="flex flex-col gap-2">
              {vaults.recommendList?.map((item: any, index: number) => (
                <InterestItem key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
