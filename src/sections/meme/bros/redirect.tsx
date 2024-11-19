import History from "./history";
import { useParams } from "next/navigation";

export default function Redirect() {
  const urlParams = useParams();
  if (urlParams.sub === "history") return <History />;
}
