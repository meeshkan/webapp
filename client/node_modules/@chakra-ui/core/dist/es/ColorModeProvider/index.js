import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createContext, useContext, useState } from "react";
import useDarkMode from "use-dark-mode"; // This context handles the color mode (light or dark) of the UI

export var ColorModeContext = createContext({
  colorMode: "light",
  toggleColorMode: function toggleColorMode() {}
});

var ColorModeProvider = function ColorModeProvider(_ref) {
  var value = _ref.value,
      children = _ref.children;

  var _useState = useState(value),
      manualMode = _useState[0],
      setManualMode = _useState[1];

  var manualToggle = function manualToggle() {
    if (manualMode === "light") {
      setManualMode("dark");
    }

    if (manualMode === "dark") {
      setManualMode("light");
    }
  };

  var _useDarkMode = useDarkMode(false),
      isDarkMode = _useDarkMode.value,
      toggle = _useDarkMode.toggle;

  var colorMode = isDarkMode ? "dark" : "light";
  var childContext = value != null ? {
    colorMode: manualMode,
    toggleColorMode: manualToggle
  } : {
    colorMode: colorMode,
    toggleColorMode: toggle
  };
  return jsx(ColorModeContext.Provider, {
    value: childContext
  }, children);
};

var DarkMode = function DarkMode(props) {
  return jsx(ColorModeProvider, _extends({
    value: "dark"
  }, props));
};

var LightMode = function LightMode(props) {
  return jsx(ColorModeProvider, _extends({
    value: "light"
  }, props));
};

var useColorMode = function useColorMode() {
  var context = useContext(ColorModeContext);

  if (context === undefined) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }

  return context;
};

export default ColorModeProvider;
export { useColorMode, DarkMode, LightMode };