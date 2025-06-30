import Card from "@/components/card"
import Modal from "@/components/modal"
import clsx from "clsx"
import { memo, useEffect, useState } from "react"

export default memo(function Faq() {
  const [faqVisible, setFaqVisible] = useState(false)
  const [faqIndex, setFaqIndex] = useState(0)
  const FaqList = [{
    question: "What is Bintent?",
    answer: (
      <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
        Bintent is Beratown's version of NEAR Intents, which enables any application to integrate intents for easy user interactions. An intent starts with the user specifying their desired outcome and broadcasting it to solvers. For instance, a user might want to "buy 10 ETH with BTC."
        Bintent essentially acts as a unified liquidity layer. The user expresses an intent, Bintent evaluates various options to fulfil it, selects the best one, and then settles the intent commitment onchain, providing you with the best price available.
        Read more <span className="cursor-pointer font-bold underline" onClick={() => {
          window.open("https://dapdap.mirror.xyz/l4CBrs8pUJNrf0Zskh8ydkK-Gk8Z8U_m8HUrn-AGjxg")
        }}>here</span>.
      </div>
    )
  }, {
    question: "How does Bintent work?",
    answer: (
      <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
        <div>Using Bintent consists of two simple steps:</div>
        <div className="flex gap-[6px]"><span className="mt-[6px] w-[8px] h-[8px] rounded-full bg-black" />Step 1. Deposit Tokens</div>
        <div className="pl-[14px] flex gap-[6px]"><span className="mt-[6px] w-[8px] h-[8px] rounded-full border border-black" />You send your tokens to the Bintent smart contract.</div>
        <div className="pl-[14px] flex gap-[6px]"><span className="mt-[6px] w-[8px] h-[8px] rounded-full border border-black" />The tokens are credited to your balance.</div>
        <div className="flex gap-[6px]"><span className="mt-[6px] w-[8px] h-[8px] rounded-full bg-black" />Step 2. Create an Intent</div>
        <div className="pl-[14px] flex gap-[6px]"><span className="mt-[6px] w-[8px] h-[8px] rounded-full border border-black" />Choose tokens which you want to swap (e.g. swap ETH on Ethereum to SOL on Solana)</div>
        <div className="pl-[14px] flex gap-[6px]"><span className="mt-[6px] w-[8px] h-[8px] rounded-full border border-black" />Press "Swap"</div>
        <div className="pl-[14px] flex gap-[6px]"><span className="mt-[6px] w-[8px] h-[8px] rounded-full border border-black" />Bintent automatically finds the best rate and offers you to sign the transaction</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] mt-[6px] w-[8px] h-[8px] rounded-full bg-black" />To withdraw your assets, click the "Withdraw" button and select which token you want to withdraw and to which chain.</div>
      </div>
    )
  }, {
    question: "Why is Bintent better than bridging / swapping manually?",
    answer: (
      <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">1.</span>Best price execution without bridging: Bintent scans multiple liquidity sources (onchain, CeFi, DeFi, and off-chain) to find the best price for your swap.</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">2.</span>No gas fees, lower costs and faster execution: solvers optimize for both cost and speed, reducing unnecessary fees and delays.</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">3.</span>Simplified user experience: no need to understand bridge mechanics, swap routes, or liquidity sources—Bintent handles everything for you.</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">4.</span>One account, any chain: supporting liquidity from non-smart contract chains like Bitcoin, Dogecoin, and XRP, Beratown users don't need to switch wallets or manage multiple accounts to access assets across different networks.</div>
      </div>
    )
  }, {
    question: "I see that I need to deposit my assets. Am I able to withdraw these at any time? ",
    answer: (
      <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
        You can deposit or withdraw your assets at any time. Simply click on 'deposit' and/or 'withdraw'.
      </div>
    )
  }, {
    question: "What networks can I withdraw assets to?",
    answer: (
      <div className="text-[#3D405A] text-[14px] font-medium leading-[150%]">
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">1.</span>NEAR</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">2.</span>Ethereum</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">3.</span>Arbitrum</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">4.</span>Base</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">5.</span>Solana</div>
        <div className="flex gap-[6px]"><span className="min-w-[8px] w-[8px]">6.</span>Berachain</div>
      </div>
    )
  }]
  const [offset, setOffset] = useState<any>(328);

  useEffect(() => {
    const onResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1645) {
        const decrease = (1645 - windowWidth) / 2;
        const newOffset = Math.max(200, 328 - decrease);
        setOffset(newOffset);
      } else {
        setOffset(328);
      }
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    }
  }, []);

  return (
    <>
      <div
        onClick={() => {
          setFaqVisible(true)
        }}
        className="cursor-pointer absolute w-[109px] bottom-[191px] left-1/2"
        style={{
          transform: `translateX(calc(-50% + ${offset}px))`
        }}
      >
        <img src="/images/faq_signs.svg" alt="faq_signs" />
      </div>
      <Modal
        open={faqVisible}
        onClose={() => {
          setFaqVisible(false)
        }}
      >
        <Card className="w-[585px] p-[24px_22px_34px]">
          <div className="pl-[9px] text-black font-CherryBomb text-[26px]">FAQ</div>

          <div className="flex flex-col gap-[10px]">
            {
              FaqList?.map((faq: any, index: number) => (
                <div onClick={() => {
                  setFaqIndex(index === faqIndex ? -1 : index)
                }} className={clsx("cursor-pointer w-full p-[25px_20px] rounded-[16px] border border-black", index === faqIndex ? "bg-white" : "bg-[#F9F4D1]")}>
                  <div className="flex items-center justify-between">
                    <div className="text-black font-CherryBomb text-[16px] leading-[90%]">{faq.question}</div>
                    <div className={clsx("w-[10px]", index === faqIndex ? "" : "rotate-180")}>
                      <img src="/images/faq_right.svg" alt="faq_right" />
                    </div>
                  </div>
                  <div className={clsx("mt-[12px]", index === faqIndex ? "block" : "hidden")}>{faq.answer}</div>
                </div>
              ))
            }
          </div>
        </Card>
      </Modal>
    </>
  )
})
