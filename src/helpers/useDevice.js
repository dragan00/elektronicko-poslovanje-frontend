import { useWindowSize } from "react-use";
import { breakpoints } from "../styles/breakpoints";

export default function useDevice() {
  // Variables
  const { width } = useWindowSize();

  return width > breakpoints.xl ? "desktop" : "mobile";
}
