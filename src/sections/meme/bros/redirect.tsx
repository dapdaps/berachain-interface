import History from "./history";
import Vote from "./vote";
import { useParams } from "next/navigation";

export default function Redirect() {
  const urlParams = useParams();
  if (urlParams.sub === "history") return <History />;
  if (urlParams.sub === "vote") return <Vote />;
}
