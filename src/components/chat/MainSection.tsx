import { useState } from "react";
import IconSend from "@public/images/chat/send.svg";
import IconCheckPosition from "@public/images/chat/check-position.svg";
import IconWallet from "@public/images/chat/wallet.svg";
import IconTopVault from "@public/images/chat/top-vault.svg";
import InterestItem, { INTEREST_ITEMS } from "./InterestItem";
import QuickOptionTabs from "./QuickOptionTabs";
import { useChatContext } from "./context/chat-context";
import { createNewChat } from "./services/chat-service";

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
  
  const { startNewChat, addMessage, addChatHistory } = useChatContext();

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      try {
        startNewChat(inputValue);
        const userMessage = inputValue;
        setInputValue("");
        const { messages, chatHistory } = await createNewChat(userMessage);
        if (messages.length > 1) {
          addMessage(messages[1]);
        }
        addChatHistory(chatHistory);
      } catch (error) {
        console.error("Set Error:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
            placeholder="What are you feeling to do today?"
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