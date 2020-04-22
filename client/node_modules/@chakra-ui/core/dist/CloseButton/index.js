"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _Icon = _interopRequireDefault(require("../Icon"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _ColorModeProvider = require("../ColorModeProvider");

/** @jsx jsx */
var baseProps = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  rounded: "md",
  transition: "all 0.2s",
  flex: "0 0 auto",
  _hover: {
    bg: "blackAlpha.100"
  },
  _active: {
    bg: "blackAlpha.200"
  },
  _disabled: {
    cursor: "not-allowed"
  },
  _focus: {
    boxShadow: "outline"
  }
};
var sizes = {
  lg: {
    button: "40px",
    icon: "16px"
  },
  md: {
    button: "32px",
    icon: "12px"
  },
  sm: {
    button: "24px",
    icon: "10px"
  }
};

var CloseButton = function CloseButton(_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "md" : _ref$size,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? "button" : _ref$type,
      isDisabled = _ref.isDisabled,
      color = _ref.color,
      _ref$ariaLabel = _ref["aria-label"],
      ariaLabel = _ref$ariaLabel === void 0 ? "Close" : _ref$ariaLabel,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["size", "type", "isDisabled", "color", "aria-label"]);

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var hoverColor = {
    light: "blackAlpha.100",
    dark: "whiteAlpha.100"
  };
  var activeColor = {
    light: "blackAlpha.200",
    dark: "whiteAlpha.200"
  };
  var buttonSize = sizes[size] && sizes[size]["button"];
  var iconSize = sizes[size] && sizes[size]["icon"];
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    as: "button",
    outline: "none",
    "aria-disabled": isDisabled,
    disabled: isDisabled,
    "aria-label": ariaLabel,
    size: buttonSize,
    _hover: {
      bg: hoverColor[colorMode]
    },
    _active: {
      bg: activeColor[colorMode]
    },
    type: type
  }, baseProps, rest), (0, _core.jsx)(_Icon["default"], {
    color: color,
    focusable: "false",
    name: "close",
    "aria-hidden": true,
    size: iconSize
  }));
};

var _default = CloseButton;
exports["default"] = _default;