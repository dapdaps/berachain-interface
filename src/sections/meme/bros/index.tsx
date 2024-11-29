import History from "./history";
import Content from "./content";
import { useParams } from "next/navigation";

export default function Bros() {
  const urlParams = useParams();
  if (urlParams.sub === "history") return <History />;

  return <Content />;
}
