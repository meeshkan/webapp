import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import Box from "../Box";
import { inputSizes } from "../Input/styles";
var InputElement = forwardRef(function (_ref, ref) {
  var _placementProp;

  var size = _ref.size,
      children = _ref.children,
      _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? "left" : _ref$placement,
      _ref$disablePointerEv = _ref.disablePointerEvents,
      disablePointerEvents = _ref$disablePointerEv === void 0 ? false : _ref$disablePointerEv,
      props = _objectWithoutPropertiesLoose(_ref, ["size", "children", "placement", "disablePointerEvents"]);

  var height = inputSizes[size] && inputSizes[size]["height"];
  var fontSize = inputSizes[size] && inputSizes[size]["fontSize"];
  var placementProp = (_placementProp = {}, _placementProp[placement] = "0", _placementProp);
  return jsx(Box, _extends({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: height,
    width: height,
    fontSize: fontSize,
    top: "0",
    zIndex: 2,
    ref: ref
  }, disablePointerEvents && {
    pointerEvents: "none"
  }, placementProp, props), children);
});
InputElement.displayName = "InputElement";
var InputLeftElement = forwardRef(function (props, ref) {
  return jsx(InputElement, _extends({
    ref: ref,
    placement: "left"
  }, props));
});
InputLeftElement.displayName = "InputLeftElement";
var InputRightElement = forwardRef(function (props, ref) {
  return jsx(InputElement, _extends({
    ref: ref,
    placement: "right"
  }, props));
});
InputRightElement.displayName = "InputRightElement";
export { InputLeftElement, InputRightElement };
export default InputElement;