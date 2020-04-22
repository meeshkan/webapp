import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import Icon from "../Icon";
import PseudoBox from "../PseudoBox";
import { useColorMode } from "../ColorModeProvider";
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
      rest = _objectWithoutPropertiesLoose(_ref, ["size", "type", "isDisabled", "color", "aria-label"]);

  var _useColorMode = useColorMode(),
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
  return jsx(PseudoBox, _extends({
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
  }, baseProps, rest), jsx(Icon, {
    color: color,
    focusable: "false",
    name: "close",
    "aria-hidden": true,
    size: iconSize
  }));
};

export default CloseButton;