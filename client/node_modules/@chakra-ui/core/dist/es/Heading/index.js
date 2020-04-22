import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import Box from "../Box";
import { forwardRef } from "react";
var sizes = {
  "2xl": ["4xl", null, "5xl"],
  xl: ["3xl", null, "4xl"],
  lg: ["xl", null, "2xl"],
  md: "xl",
  sm: "md",
  xs: "sm"
};
var Heading = forwardRef(function (_ref, ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "xl" : _ref$size,
      props = _objectWithoutPropertiesLoose(_ref, ["size"]);

  return jsx(Box, _extends({
    ref: ref,
    as: "h2",
    fontSize: sizes[size],
    lineHeight: "shorter",
    fontWeight: "bold",
    fontFamily: "heading"
  }, props));
});
Heading.displayName = "Heading";
export default Heading;