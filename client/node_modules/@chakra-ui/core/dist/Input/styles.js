"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.inputSizes = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ThemeProvider = require("../ThemeProvider");

var _ColorModeProvider = require("../ColorModeProvider");

var _styledSystem = require("styled-system");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var outlinedStyle = function outlinedStyle(_ref) {
  var theme = _ref.theme,
      colorMode = _ref.colorMode,
      focusBorderColor = _ref.focusBorderColor,
      errorBorderColor = _ref.errorBorderColor;
  var bg = {
    light: "white",
    dark: "whiteAlpha.100"
  };
  var borderColor = {
    light: "inherit",
    dark: "whiteAlpha.50"
  };
  var hoverColor = {
    light: "gray.300",
    dark: "whiteAlpha.200"
  };
  /**
   * styled-system's get takes 3 args
   * - object or array to read from
   * - key to get
   * - fallback value
   */

  var _focusBorderColor = (0, _styledSystem.get)(theme.colors, focusBorderColor, focusBorderColor // If color doesn't exist in theme, use it's raw value
  );

  var _errorBorderColor = (0, _styledSystem.get)(theme.colors, errorBorderColor, errorBorderColor);

  return _objectSpread({}, readOnly, {
    border: "1px",
    borderColor: borderColor[colorMode],
    bg: bg[colorMode],
    _hover: {
      borderColor: hoverColor[colorMode]
    },
    _disabled: {
      opacity: "0.4",
      cursor: "not-allowed"
    },
    _focus: {
      zIndex: 1,
      borderColor: _focusBorderColor,
      boxShadow: "0 0 0 1px " + _focusBorderColor
    },
    _invalid: {
      borderColor: _errorBorderColor,
      boxShadow: "0 0 0 1px " + _errorBorderColor
    }
  });
};

var readOnly = {
  _readOnly: {
    bg: "transparent",
    boxShadow: "none !important",
    userSelect: "all"
  }
};

var filledStyle = function filledStyle(_ref2) {
  var theme = _ref2.theme,
      focusBorderColor = _ref2.focusBorderColor,
      errorBorderColor = _ref2.errorBorderColor,
      colorMode = _ref2.colorMode;
  var bg = {
    light: "gray.100",
    dark: "whiteAlpha.50"
  };
  var hoverColor = {
    light: "gray.200",
    dark: "whiteAlpha.100"
  };

  var _focusBorderColor = (0, _styledSystem.get)(theme.colors, focusBorderColor, focusBorderColor);

  var _errorBorderColor = (0, _styledSystem.get)(theme.colors, errorBorderColor, errorBorderColor);

  return _objectSpread({}, readOnly, {
    border: "2px",
    borderColor: "transparent",
    bg: bg[colorMode],
    _hover: {
      bg: hoverColor[colorMode]
    },
    _disabled: {
      opacity: "0.4",
      cursor: "not-allowed"
    },
    _focus: {
      zIndex: 1,
      bg: "transparent",
      borderColor: _focusBorderColor
    },
    _invalid: {
      borderColor: _errorBorderColor
    }
  });
};

var flushedStyle = function flushedStyle(_ref3) {
  var theme = _ref3.theme,
      focusBorderColor = _ref3.focusBorderColor,
      errorBorderColor = _ref3.errorBorderColor;

  var _focusBorderColor = (0, _styledSystem.get)(theme.colors, focusBorderColor, focusBorderColor);

  var _errorBorderColor = (0, _styledSystem.get)(theme.colors, errorBorderColor, errorBorderColor);

  return _objectSpread({}, readOnly, {
    borderBottom: "2px",
    borderColor: "inherit",
    rounded: 0,
    px: undefined,
    bg: "transparent",
    _focus: {
      zIndex: 1,
      borderColor: _focusBorderColor
    },
    _invalid: {
      borderColor: _errorBorderColor
    }
  });
};

var unstyledStyle = {
  bg: "transparent",
  px: undefined,
  height: undefined
};

var variantProps = function variantProps(props) {
  switch (props.variant) {
    case "flushed":
      return flushedStyle(props);

    case "unstyled":
      return unstyledStyle;

    case "filled":
      return filledStyle(props);

    case "outline":
      return outlinedStyle(props);

    default:
      return {};
  }
};

var baseProps = {
  display: "flex",
  alignItems: "center",
  position: "relative",
  transition: "all 0.2s",
  outline: "none",
  appearance: "none"
};
var inputSizes = {
  lg: {
    fontSize: "lg",
    px: 4,
    height: 12,
    rounded: "md"
  },
  md: {
    fontSize: "md",
    px: 4,
    height: 10,
    rounded: "md"
  },
  sm: {
    fontSize: "sm",
    px: 3,
    height: 8,
    rounded: "sm"
  }
};
exports.inputSizes = inputSizes;

var sizeProps = function sizeProps(props) {
  return inputSizes[props.size];
};

var useInputStyle = function useInputStyle(props) {
  var theme = (0, _ThemeProvider.useTheme)();

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var _props = _objectSpread({}, props, {
    theme: theme,
    colorMode: colorMode
  });

  return _objectSpread({
    width: props.isFullWidth ? "100%" : undefined
  }, baseProps, {}, sizeProps(_props), {}, variantProps(_props));
};

var _default = useInputStyle;
exports["default"] = _default;