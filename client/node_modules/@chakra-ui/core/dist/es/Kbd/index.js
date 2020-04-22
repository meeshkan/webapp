import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import Box from "../Box";
import { useColorMode } from "../ColorModeProvider";

var Kbd = function Kbd(props) {
  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var bg = {
    light: "gray.100",
    dark: "whiteAlpha.50"
  };
  return jsx(Box, _extends({
    as: "kbd",
    bg: bg[colorMode],
    rounded: "md",
    border: "1px",
    borderColor: "inherit",
    borderBottomWidth: "3px",
    fontSize: "0.8em",
    fontWeight: "bold",
    lineHeight: "normal",
    px: "0.4em",
    whiteSpace: "nowrap"
  }, props));
};

export default Kbd;