import Basic from "./basic";

export default function Rules({ open, onClose }: any) {
  return (
    <Basic
      open={open}
      onClose={onClose}
      className="w-[520px] text-[14px] font-medium"
    >
      <div className="text-[20px] font-bold">Super Meme Bros. Rules</div>
      <div className="mt-[20px]">Stake memes, vote, and earn rewards！</div>
      <div className="my-[10px] text-[16px] font-semibold">
        Campaign Process
      </div>
      <div>
        1. Voting: Vote for your favorite memes. Top-ranked memes qualify for
        staking.
      </div>
      <div className="mt-[10px]">
        2. Staking: Stake selected memes to earn rewards.{" "}
      </div>
      <div className="mt-[10px]">
        3. Rewards: Rewards are distributed based on meme rankings.
      </div>
      <div className="my-[10px] text-[16px] font-semibold">Key Actions</div>
      <div>
        - Vote: Users must hold more than 1 $BEAR to be eligible to vote and can
        support only one meme.
      </div>
      <div className="mt-[10px]">
        - Stake/Unstake: Stake memes during Weeks 2-3. Unstake is available
        after the campaign ends.
      </div>
      <div className="mt-[10px]">
        - Withdraw: Withdraw tokens 10 days after unstaking.
      </div>
      <div className="mt-[10px]">
        Make your favorite meme the champion—join now! 🎉
      </div>
    </Basic>
  );
}
