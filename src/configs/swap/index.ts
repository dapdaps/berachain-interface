import beraswap from "./beraswap";
import kodiak from "./kodiak";
import oogaBooga from "./ooga-booga";

export default {
  beraswap,
  kodiak,
  "ooga-booga": oogaBooga
} as Record<string, any>;

export const dexs: Record<string, any> = {
  beraswap,
  kodiak,
  "ooga booga": oogaBooga
};
