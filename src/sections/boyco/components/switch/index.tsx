import { ListIcon, ChartIcon } from "./icons";

export default function Switch({ tab }: any) {
  return tab === "list" ? <ListIcon /> : <ChartIcon />;
}
