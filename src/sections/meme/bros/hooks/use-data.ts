import context from "../context";
import { useContext } from "react";

export default function useData() {
  return useContext(context);
}
