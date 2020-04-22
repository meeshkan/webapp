import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/taggedTemplateLiteralLoose";

function _templateObject4() {
  var data = _taggedTemplateLiteralLoose(["\n  animation: ", " ", "s;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteralLoose(["\nfrom { opacity: 0; }\nto   { opacity: 1; }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["\n  border-color: ", " !important;\n  box-shadow: none !important;\n  opacity: 0.7;\n  // do not !important this for Firefox support\n  background: ", ";\n\n  // Prevent background color from extending to the border and overlappping\n  background-clip: padding-box !important;\n  cursor: default;\n\n  // Transparent text will occupy space but be invisible to the user\n  color: transparent !important;\n  animation: ", "s linear infinite alternate\n    ", ";\n  pointer-events: none;\n  user-select: none;\n\n  // Make pseudo-elements (CSS icons) and children invisible\n  &::before,\n  &::after,\n  * {\n    visibility: hidden !important;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\nfrom {\n  border-color: ", ";\n  background: ", ";\n}\n\nto {\n  border-color: ", ";\n  background: ", ";\n}\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/** @jsx jsx */
import { Fragment, useMemo } from "react";
import { useTheme } from "../ThemeProvider";
import { useColorMode } from "../ColorModeProvider";
import { css, jsx, keyframes } from "@emotion/core";
import Box from "../Box";

var skeletonGlow = function skeletonGlow(colorStart, colorEnd) {
  return keyframes(_templateObject(), colorStart, colorStart, colorEnd, colorEnd);
};

var getStyle = function getStyle(_ref) {
  var colorStart = _ref.colorStart,
      colorEnd = _ref.colorEnd,
      speed = _ref.speed;
  return css(_templateObject2(), colorStart, colorStart, speed, skeletonGlow(colorStart, colorEnd));
};

var fadeIn = keyframes(_templateObject3());

var fadeInCss = function fadeInCss(duration) {
  return css(_templateObject4(), fadeIn, duration);
};

var Skeleton = function Skeleton(props) {
  var _useTheme = useTheme(),
      colors = _useTheme.colors;

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var defaultStart = {
    light: colors.gray[100],
    dark: colors.gray[800]
  };
  var defaultEnd = {
    light: colors.gray[400],
    dark: colors.gray[600]
  };

  var _props$colorStart = props.colorStart,
      colorStart = _props$colorStart === void 0 ? defaultStart[colorMode] : _props$colorStart,
      _props$colorEnd = props.colorEnd,
      colorEnd = _props$colorEnd === void 0 ? defaultEnd[colorMode] : _props$colorEnd,
      _props$isLoaded = props.isLoaded,
      isLoaded = _props$isLoaded === void 0 ? false : _props$isLoaded,
      _props$fadeInDuration = props.fadeInDuration,
      fadeInDuration = _props$fadeInDuration === void 0 ? 0.4 : _props$fadeInDuration,
      _props$speed = props.speed,
      speed = _props$speed === void 0 ? 0.8 : _props$speed,
      rest = _objectWithoutPropertiesLoose(props, ["colorStart", "colorEnd", "isLoaded", "fadeInDuration", "speed"]);

  var fadeInStyle = useMemo(function () {
    return fadeInCss(fadeInDuration);
  }, [fadeInDuration]);
  var skeletonStyle = useMemo(function () {
    return getStyle({
      colorStart: colorStart,
      colorEnd: colorEnd,
      speed: speed
    });
  }, [colorStart, colorEnd, speed]);

  if (isLoaded) {
    return jsx(Box, _extends({
      css: fadeInStyle
    }, rest));
  }

  return jsx(Box, _extends({
    css: skeletonStyle,
    borderRadius: "2px"
  }, rest));
};

export default Skeleton;