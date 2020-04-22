import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/taggedTemplateLiteralLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  0% {\n    stroke-dasharray: 1, 400;\n    stroke-dashoffset: 0;\n  }\n\n  50% {\n    stroke-dasharray: 400, 400;\n    stroke-dashoffset: -100;\n  }\n\n  100% {\n    stroke-dasharray: 400, 400;\n    stroke-dashoffset: -300;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/** @jsx jsx */
import { jsx, keyframes } from "@emotion/core";
import { useColorMode } from "../ColorModeProvider";
import Box from "../Box";
import { forwardRef } from "react";
var circularProgressCircle = keyframes(_templateObject());
var spin = keyframes(_templateObject2());
export var CircularProgressLabel = function CircularProgressLabel(props) {
  return jsx(Box, _extends({
    position: "absolute",
    left: "50%",
    top: "50%",
    lineHeight: "1",
    transform: "translate(-50%, -50%)",
    fontSize: "0.25em",
    css: {
      fontVariantNumeric: "tabular-nums"
    }
  }, props));
};

function getComputedProps(_ref) {
  var min = _ref.min,
      max = _ref.max,
      size = _ref.size,
      value = _ref.value,
      angle = _ref.angle,
      thickness = _ref.thickness,
      trackColor = _ref.trackColor,
      color = _ref.color,
      capIsRound = _ref.capIsRound,
      isIndeterminate = _ref.isIndeterminate;
  var radius = 50;
  var diameter = radius * 2;
  var circumference = diameter * Math.PI;
  var strokeDasharray = Math.round(circumference * 1000) / 1000;
  var viewBox = diameter / (1 - thickness / 2);
  var viewBoxAttr = viewBox / 2 + " " + viewBox / 2 + " " + viewBox + " " + viewBox;
  var strokeWidth = thickness / 2 * viewBox;
  var progress = 1 - (value - min) / (max - min);
  var strokeDashoffset = progress * circumference;

  function getCircleProps(_ref2) {
    var thickness = _ref2.thickness,
        offset = _ref2.offset,
        color = _ref2.color;
    return {
      as: "circle",
      color: color,
      fill: "transparent",
      stroke: "currentColor",
      strokeWidth: thickness,
      strokeDasharray: strokeDasharray,
      strokeDashoffset: offset,
      cx: viewBox,
      cy: viewBox,
      r: radius
    };
  }

  return {
    rootProps: {
      size: "1em",
      fontSize: size,
      display: "inline-block",
      position: "relative",
      veriticalAlign: "middle",
      role: "progressbar",
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": isIndeterminate ? null : value
    },
    svgProps: _objectSpread({
      as: "svg",
      viewBox: viewBoxAttr,
      verticalAlign: "top",
      transform: "rotate3d(0, 0, 1, " + (angle - 90) + "deg)",
      size: "100%"
    }, isIndeterminate && {
      transformOrigin: "50% 50%",
      animation: spin + " 2s linear infinite"
    }),
    trackCircleProps: getCircleProps({
      thickness: strokeWidth,
      offset: 0,
      color: trackColor
    }),
    indicatorCircleProps: _objectSpread({}, getCircleProps({
      thickness: strokeWidth,
      offset: strokeDashoffset,
      color: color
    }), {}, capIsRound && {
      strokeLinecap: "round"
    }, {}, isIndeterminate && {
      transition: "stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease",
      animation: circularProgressCircle + " 1.5s ease-in-out infinite",
      strokeDasharray: "1 400",
      strokeDashoffset: "0"
    }, {
      stroke: "currentColor"
    })
  };
}

var CircularProgress = forwardRef(function (props, ref) {
  var _props$size = props.size,
      size = _props$size === void 0 ? "48px" : _props$size,
      _props$max = props.max,
      max = _props$max === void 0 ? 100 : _props$max,
      _props$min = props.min,
      min = _props$min === void 0 ? 0 : _props$min,
      isIndeterminate = props.isIndeterminate,
      _props$thickness = props.thickness,
      thickness = _props$thickness === void 0 ? 0.2 : _props$thickness,
      value = props.value,
      _props$angle = props.angle,
      angle = _props$angle === void 0 ? 0 : _props$angle,
      capIsRound = props.capIsRound,
      children = props.children,
      _props$trackColor = props.trackColor,
      trackColor = _props$trackColor === void 0 ? "gray" : _props$trackColor,
      _props$color = props.color,
      color = _props$color === void 0 ? "blue" : _props$color,
      rest = _objectWithoutPropertiesLoose(props, ["size", "max", "min", "isIndeterminate", "thickness", "value", "angle", "capIsRound", "children", "trackColor", "color"]);

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var _trackColor = {
    light: trackColor + ".100",
    dark: "whiteAlpha.300"
  };
  var _color = {
    light: color + ".500",
    dark: color + ".200"
  };

  var _getComputedProps = getComputedProps({
    min: min,
    max: max,
    value: value,
    size: size,
    angle: angle,
    thickness: thickness,
    capIsRound: capIsRound,
    isIndeterminate: isIndeterminate,
    color: _color[colorMode],
    trackColor: _trackColor[colorMode]
  }),
      rootProps = _getComputedProps.rootProps,
      indicatorCircleProps = _getComputedProps.indicatorCircleProps,
      svgProps = _getComputedProps.svgProps,
      trackCircleProps = _getComputedProps.trackCircleProps;

  return jsx(Box, _extends({
    ref: ref
  }, rootProps, rest), jsx(Box, svgProps, jsx(Box, _extends({}, trackCircleProps, {
    "data-progress-track": true
  })), jsx(Box, _extends({}, indicatorCircleProps, {
    "data-progress-indicator": true
  }))), children);
});
CircularProgress.displayName = "CircularProgress";
export default CircularProgress;