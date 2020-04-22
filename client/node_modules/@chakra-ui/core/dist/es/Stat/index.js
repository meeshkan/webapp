import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";
import React, { forwardRef } from "react";
import Icon from "../Icon";
import Text from "../Text";
import Box from "../Box";
import Flex from "../Flex";
var StatLabel = forwardRef(function (props, ref) {
  return React.createElement(Text, _extends({
    ref: ref,
    fontWeight: "medium",
    fontSize: "sm"
  }, props));
});
StatLabel.displayName = "StatLabel";
var StatHelpText = forwardRef(function (props, ref) {
  return React.createElement(Text, _extends({
    ref: ref,
    fontSize: "sm",
    opacity: "0.8",
    mb: 2
  }, props));
});
StatHelpText.displayName = "StatHelpText";

var StatNumber = function StatNumber(props) {
  return React.createElement(Text, _extends({
    fontSize: "2xl",
    verticalAlign: "baseline",
    fontWeight: "semibold"
  }, props));
};

var arrowOptions = {
  increase: {
    name: "triangle-up",
    color: "green.400"
  },
  decrease: {
    name: "triangle-down",
    color: "red.400"
  }
};
var StatArrow = forwardRef(function (_ref, ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? "increase" : _ref$type,
      ariaLabel = _ref["aria-label"],
      rest = _objectWithoutPropertiesLoose(_ref, ["type", "aria-label"]);

  return React.createElement(Icon, _extends({
    ref: ref,
    mr: 1,
    size: "14px",
    verticalAlign: "middle",
    "aria-label": ariaLabel
  }, arrowOptions[type], rest));
});
StatArrow.displayName = "StatArrow";
var Stat = forwardRef(function (props, ref) {
  return React.createElement(Box, _extends({
    ref: ref,
    flex: "1",
    pr: 4,
    position: "relative"
  }, props));
});
Stat.displayName = "Stat";
var StatGroup = forwardRef(function (props, ref) {
  return React.createElement(Flex, _extends({
    ref: ref,
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start"
  }, props));
});
StatGroup.displayName = "StatGroup";
export { StatLabel, StatNumber, Stat, StatHelpText, StatArrow, StatGroup };