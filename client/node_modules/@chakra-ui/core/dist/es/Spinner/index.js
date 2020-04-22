import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/taggedTemplateLiteralLoose";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/** @jsx jsx */
import { jsx, keyframes } from "@emotion/core";
import { forwardRef } from "react";
import Box from "../Box";
import VisuallyHidden from "../VisuallyHidden";
var spin = keyframes(_templateObject());
var sizes = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem"
};
var Spinner = forwardRef(function (_ref, ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "md" : _ref$size,
      _ref$label = _ref.label,
      label = _ref$label === void 0 ? "Loading..." : _ref$label,
      _ref$thickness = _ref.thickness,
      thickness = _ref$thickness === void 0 ? "2px" : _ref$thickness,
      _ref$speed = _ref.speed,
      speed = _ref$speed === void 0 ? "0.45s" : _ref$speed,
      color = _ref.color,
      _ref$emptyColor = _ref.emptyColor,
      emptyColor = _ref$emptyColor === void 0 ? "transparent" : _ref$emptyColor,
      props = _objectWithoutPropertiesLoose(_ref, ["size", "label", "thickness", "speed", "color", "emptyColor"]);

  var _size = sizes[size] || size;

  return jsx(Box, _extends({
    ref: ref,
    display: "inline-block",
    borderWidth: thickness,
    borderColor: "currentColor",
    borderBottomColor: emptyColor,
    borderLeftColor: emptyColor,
    borderStyle: "solid",
    rounded: "full",
    color: color,
    animation: spin + " " + speed + " linear infinite",
    size: _size
  }, props), label && jsx(VisuallyHidden, null, label));
});
Spinner.displayName = "Spinner";
export default Spinner;