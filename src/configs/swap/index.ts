import bex from "./bex";
import kodiak from "./kodiak";
import oogaBooga from "./ooga-booga";
import burrbear from "./burrbear";

export default {
  bex,
  kodiak,
  "ooga-booga": oogaBooga,
  burrbear
} as Record<string, any>;

export const dexs: Record<string, any> = {
  bex,
  kodiak,
  "ooga booga": oogaBooga,
  burrbear
};
