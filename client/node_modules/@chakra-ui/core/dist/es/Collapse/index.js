import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import AnimateHeight from "react-animate-height";
import Box from "../Box";
var Collapse = forwardRef(function (_ref, ref) {
  var isOpen = _ref.isOpen,
      _ref$animateOpacity = _ref.animateOpacity,
      animateOpacity = _ref$animateOpacity === void 0 ? true : _ref$animateOpacity,
      onAnimationStart = _ref.onAnimationStart,
      onAnimationEnd = _ref.onAnimationEnd,
      duration = _ref.duration,
      _ref$easing = _ref.easing,
      easing = _ref$easing === void 0 ? "ease" : _ref$easing,
      _ref$startingHeight = _ref.startingHeight,
      startingHeight = _ref$startingHeight === void 0 ? 0 : _ref$startingHeight,
      _ref$endingHeight = _ref.endingHeight,
      endingHeight = _ref$endingHeight === void 0 ? "auto" : _ref$endingHeight,
      rest = _objectWithoutPropertiesLoose(_ref, ["isOpen", "animateOpacity", "onAnimationStart", "onAnimationEnd", "duration", "easing", "startingHeight", "endingHeight"]);

  return jsx(AnimateHeight, _extends({
    duration: duration,
    easing: easing,
    animateOpacity: animateOpacity,
    height: isOpen ? endingHeight : startingHeight,
    applyInlineTransitions: false,
    css: {
      transition: "height .2s ease,opacity .2s ease-in-out,transform .2s ease-in-out",
      "&.rah-animating--to-height-zero": {
        opacity: 0,
        transform: "translateY(-0.625rem)"
      }
    }
  }, {
    onAnimationStart: onAnimationStart,
    onAnimationEnd: onAnimationEnd
  }), jsx(Box, _extends({
    ref: ref
  }, rest)));
});
Collapse.displayName = "Collapse";
export default Collapse;