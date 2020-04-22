import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/taggedTemplateLiteralLoose";

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["\n  animation: ", " 1s linear infinite;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  from { background-position: 1rem 0}\n  to { background-position: 0 0 }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/** @jsx jsx */
import { jsx, keyframes, css } from "@emotion/core";
import { useColorMode } from "../ColorModeProvider";
import Box from "../Box";
import { generateStripe } from "../theme/colors-utils";
import { valueToPercent } from "../Slider";
var stripe = keyframes(_templateObject());
var stripeAnimation = css(_templateObject2(), stripe);
export var ProgressLabel = function ProgressLabel(props) {
  return jsx(Box, _extends({
    textAlign: "center",
    width: "100%"
  }, props));
};

var ProgressIndicator = function ProgressIndicator(_ref) {
  var isIndeterminate = _ref.isIndeterminate,
      min = _ref.min,
      max = _ref.max,
      value = _ref.value,
      rest = _objectWithoutPropertiesLoose(_ref, ["isIndeterminate", "min", "max", "value"]);

  var percent = valueToPercent(value, min, max);
  return jsx(Box, _extends({
    height: "100%",
    "aria-valuemax": max,
    "aria-valuemin": min,
    "aria-valuenow": isIndeterminate ? null : value,
    role: "progressbar",
    transition: "all 0.3s",
    width: percent + "%"
  }, rest));
};

var progressbarSizes = {
  lg: "1rem",
  md: "0.75rem",
  sm: "0.5rem"
};

var ProgressTrack = function ProgressTrack(_ref2) {
  var size = _ref2.size,
      rest = _objectWithoutPropertiesLoose(_ref2, ["size"]);

  return jsx(Box, _extends({
    pos: "relative",
    height: progressbarSizes[size],
    overflow: "hidden"
  }, rest));
};

var Progress = function Progress(_ref3) {
  var _ref3$color = _ref3.color,
      color = _ref3$color === void 0 ? "blue" : _ref3$color,
      _ref3$value = _ref3.value,
      value = _ref3$value === void 0 ? 63 : _ref3$value,
      _ref3$min = _ref3.min,
      min = _ref3$min === void 0 ? 0 : _ref3$min,
      _ref3$max = _ref3.max,
      max = _ref3$max === void 0 ? 100 : _ref3$max,
      _ref3$size = _ref3.size,
      size = _ref3$size === void 0 ? "md" : _ref3$size,
      hasStripe = _ref3.hasStripe,
      isAnimated = _ref3.isAnimated,
      borderRadius = _ref3.borderRadius,
      rounded = _ref3.rounded,
      children = _ref3.children,
      isIndeterminate = _ref3.isIndeterminate,
      rest = _objectWithoutPropertiesLoose(_ref3, ["color", "value", "min", "max", "size", "hasStripe", "isAnimated", "borderRadius", "rounded", "children", "isIndeterminate"]);

  var _borderRadius = rounded || borderRadius;

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var trackColor = {
    light: "gray.100",
    dark: "whiteAlpha.300"
  };
  var indicatorColor = {
    light: color + ".500",
    dark: color + ".200"
  };
  var stripeStyle = {
    light: generateStripe({}),
    dark: generateStripe({
      color: "rgba(0,0,0,0.1)"
    })
  };
  return jsx(ProgressTrack, _extends({
    size: size,
    bg: trackColor[colorMode],
    borderRadius: _borderRadius
  }, rest), jsx(ProgressIndicator, _extends({
    min: min,
    max: max,
    value: value,
    bg: indicatorColor[colorMode],
    borderRadius: _borderRadius
  }, isIndeterminate && {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    willChange: "left, right"
  }, {
    css: [hasStripe && stripeStyle[colorMode], hasStripe && isAnimated && stripeAnimation]
  })));
};

export default Progress;