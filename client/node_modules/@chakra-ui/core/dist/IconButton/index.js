"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Icon = _interopRequireDefault(require("../Icon"));

var _Button = _interopRequireDefault(require("../Button"));

var _Box = _interopRequireDefault(require("../Box"));

/** @jsx jsx */
var IconButton = (0, _react.forwardRef)(function (_ref, ref) {
  var icon = _ref.icon,
      isRound = _ref.isRound,
      ariaLabel = _ref["aria-label"],
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["icon", "isRound", "aria-label"]);
  // Remove some props before passing it to IconButton
  var isFullWidth = rest.isFullWidth,
      leftIcon = rest.leftIcon,
      rightIcon = rest.rightIcon,
      loadingText = rest.loadingText,
      props = (0, _objectWithoutPropertiesLoose2["default"])(rest, ["isFullWidth", "leftIcon", "rightIcon", "loadingText"]);
  return (0, _core.jsx)(_Button["default"], (0, _extends2["default"])({
    p: "0",
    borderRadius: isRound ? "full" : "md",
    ref: ref,
    "aria-label": ariaLabel
  }, props), typeof icon === "string" ? (0, _core.jsx)(_Icon["default"], {
    name: icon,
    focusable: "false",
    color: "currentColor",
    "aria-hidden": true
  }) : (0, _core.jsx)(_Box["default"], {
    as: icon,
    "aria-hidden": true,
    focusable: "false",
    color: "currentColor"
  }));
});
IconButton.displayName = "IconButton";
IconButton.defaultProps = _Button["default"].defaultProps;
var _default = IconButton;
exports["default"] = _default;