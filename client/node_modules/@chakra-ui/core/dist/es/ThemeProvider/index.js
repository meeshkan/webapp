/** @jsx jsx */
import { jsx, ThemeContext } from "@emotion/core";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming";
import { useContext } from "react";
import theme from "../theme";

var ThemeProvider = function ThemeProvider(_ref) {
  var theme = _ref.theme,
      children = _ref.children;
  return jsx(EmotionThemeProvider, {
    theme: theme
  }, children);
};

ThemeProvider.defaultProps = {
  theme: theme
};

var useTheme = function useTheme() {
  var theme = useContext(ThemeContext);

  if (theme === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return theme;
};

export default ThemeProvider;
export { useTheme };