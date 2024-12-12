import Modal from "@/components/modal";

export default function RulesModal({
  open = false,
  onClose = () => {},
  onOpenRewards
}: any) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative">
        <div className="w-[830px] h-[80dvh] overflow-y-auto bg-[#B5956E] rounded-[20px] px-[50px] py-[30px] text-[20px]">
          <div className="font-bold">Bera’s Wonderland rule</div>
          <div className="font-bold mt-[10px]"> Henlo ho ho! </div>
          <div>
            Bera Claus is on his way to da town, bringing Gift Boxes to all the
            nice beras who have been diligently exploring the ecosystem.
          </div>
          <div className="mt-[10px]">
            How about naughty beras? Don’t fret you will still have chance to
            redeem yourself 🐻
          </div>
          <div className="font-bold mt-[16px]">
            ⏳ For how long will the Bera Claus stays in town?
          </div>
          <ul className="pl-[20px]">
            <li className="list-disc">3 weeks from December 10th - 31st</li>
          </ul>
          <div className="font-bold mt-[16px]">
            🎁 What exciting Gift Boxes will the Bera Claus bring to da town?
          </div>
          <div>
            Check{" "}
            <span onClick={onOpenRewards} className="cursor-pointer underline">
              Rewards list
            </span>{" "}
            for full deets!
          </div>
          <ul className="pl-[20px]">
            <li className="list-disc">Bery valuable ecosystem NFTs</li>
            <li className="list-disc">Bery valuable ecosystem tokens</li>
            <li className="list-disc">Mibera WLs</li>
            <li className="list-disc">Ooga Booga Beras WLs</li>
            <li className="list-disc">Steady teddy WLs</li>
            <li className="list-disc">Eden devices</li>
            <li className="list-disc">Puffpaw devices</li>
            <li className="list-disc">Beracave special Xmas accessories!</li>
            <li className="list-disc">Yapping letters 👀</li>
          </ul>
          <div className="font-bold mt-[16px]">
            🐻 How can you earn Gift Boxes?
          </div>
          <ul className="pl-[20px]">
            <li className="list-disc">Play around with some DeFi actions</li>
            <li className="list-disc">Interact with da POL</li>
            <li className="list-disc">
              Interact & learning about frens in the ecosystem
            </li>
            <li className="list-disc">
              Do your daily tasks & get familiar with projects
            </li>
          </ul>
        </div>
        <img
          src="/images/activity/christmas/bg-summary.svg"
          alt=""
          className="absolute top-[-30px] left-[-45px] w-[900px] max-w-[900px]"
        />
        <img
          src="/images/activity/christmas/bg-summary.svg"
          alt=""
          className="absolute bottom-[-34px] left-[-45px] w-[900px] max-w-[900px]"
          style={{
            transform: "rotateX(180deg)"
          }}
        />
      </div>
    </Modal>
  );
}
