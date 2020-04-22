import _extends from "@babel/runtime/helpers/extends";
import React from "react";
import Box from "../Box";
var Text = React.forwardRef(function (props, ref) {
  return React.createElement(Box, _extends({
    ref: ref,
    as: "p",
    fontFamily: "body"
  }, props));
});
Text.displayName = "Text";
export default Text;