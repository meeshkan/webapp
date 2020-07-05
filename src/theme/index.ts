import foundations from "./foundations";
import components from "./components";
import styles from "./styles";

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const theme = {
  ...foundations,
  components,
  styles,
  config,
};

export type Theme = typeof theme;

export default theme;
