"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _react = require("react");

/** @jsx jsx */
var baseStyleProps = {
  transition: "all 0.15s ease-out",
  cursor: "pointer",
  textDecoration: "none",
  outline: "none",
  _focus: {
    boxShadow: "outline"
  },
  _disabled: {
    opacity: "0.4",
    cursor: "not-allowed",
    textDecoration: "none"
  }
};
var Link = (0, _react.forwardRef)(function (_ref, ref) {
  var isDisabled = _ref.isDisabled,
      isExternal = _ref.isExternal,
      onClick = _ref.onClick,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["isDisabled", "isExternal", "onClick"]);
  var externalProps = isExternal ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : null;
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    as: "a",
    ref: ref,
    tabIndex: isDisabled ? -1 : undefined,
    "aria-disabled": isDisabled,
    onClick: isDisabled ? function (event) {
      return event.preventDefault();
    } : onClick,
    _hover: {
      textDecoration: "underline"
    }
  }, externalProps, baseStyleProps, rest));
});
Link.displayName = "Link";
var _default = Link;
exports["default"] = _default;