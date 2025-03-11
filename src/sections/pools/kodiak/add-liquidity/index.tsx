import { forwardRef } from "react";
import V2 from "./v2";
import V3 from "./v3";
import Island from "./island";

export default forwardRef(function AddLiquidity(
  { version, ...rest }: any,
  ref: any
) {
  if (version === "v2") {
    return <V2 {...rest} />;
  }
  if (version === "v3") {
    return <V3 {...rest} ref={ref} />;
  }
  return <Island {...rest} />;
});
