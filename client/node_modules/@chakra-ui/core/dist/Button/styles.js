"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _colorsUtils = require("../theme/colors-utils");

var _ColorModeProvider = require("../ColorModeProvider");

var _ThemeProvider = require("../ThemeProvider");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var grayGhostStyle = {
  light: {
    color: "inherit",
    _hover: {
      bg: "gray.100"
    },
    _active: {
      bg: "gray.200"
    }
  },
  dark: {
    color: "whiteAlpha.900",
    _hover: {
      bg: "whiteAlpha.200"
    },
    _active: {
      bg: "whiteAlpha.300"
    }
  }
};

var ghostVariantProps = function ghostVariantProps(_ref) {
  var color = _ref.color,
      colorMode = _ref.colorMode,
      theme = _ref.theme;

  var _color = theme.colors[color] && theme.colors[color][200];

  var result;

  if (color === "gray") {
    result = grayGhostStyle;
  } else {
    result = {
      light: {
        color: color + ".500",
        bg: "transparent",
        _hover: {
          bg: color + ".50"
        },
        _active: {
          bg: color + ".100"
        }
      },
      dark: {
        color: color + ".200",
        bg: "transparent",
        _hover: {
          bg: (0, _colorsUtils.addOpacity)(_color, 0.12)
        },
        _active: {
          bg: (0, _colorsUtils.addOpacity)(_color, 0.24)
        }
      }
    };
  }

  return result[colorMode];
}; ////////////////////////////////////////////////////////////


var outlineVariantProps = function outlineVariantProps(props) {
  var color = props.color,
      colorMode = props.colorMode;
  var borderColor = {
    light: "gray.200",
    dark: "whiteAlpha.300"
  };
  return _objectSpread({
    border: "1px",
    borderColor: color === "gray" ? borderColor[colorMode] : "current"
  }, ghostVariantProps(props));
}; ////////////////////////////////////////////////////////////


var graySolidStyle = {
  light: {
    bg: "gray.100",
    _hover: {
      bg: "gray.200"
    },
    _active: {
      bg: "gray.300"
    }
  },
  dark: {
    bg: "whiteAlpha.200",
    _hover: {
      bg: "whiteAlpha.300"
    },
    _active: {
      bg: "whiteAlpha.400"
    }
  }
};

var solidVariantProps = function solidVariantProps(_ref2) {
  var color = _ref2.color,
      colorMode = _ref2.colorMode;
  var style = {
    light: {
      bg: color + ".500",
      color: "white",
      _hover: {
        bg: color + ".600"
      },
      _active: {
        bg: color + ".700"
      }
    },
    dark: {
      bg: color + ".200",
      color: "gray.800",
      _hover: {
        bg: color + ".300"
      },
      _active: {
        bg: color + ".400"
      }
    }
  };

  if (color === "gray") {
    style = graySolidStyle;
  }

  return style[colorMode];
}; ////////////////////////////////////////////////////////////


var linkVariantProps = function linkVariantProps(_ref3) {
  var color = _ref3.color,
      colorMode = _ref3.colorMode;
  var _color = {
    light: color + ".500",
    dark: color + ".200"
  };
  var _activeColor = {
    light: color + ".700",
    dark: color + ".500"
  };
  return {
    p: 0,
    height: "auto",
    lineHeight: "normal",
    color: _color[colorMode],
    _hover: {
      textDecoration: "underline"
    },
    _active: {
      color: _activeColor[colorMode]
    }
  };
}; ////////////////////////////////////////////////////////////


var disabledProps = {
  _disabled: {
    opacity: "40%",
    cursor: "not-allowed",
    boxShadow: "none"
  }
}; ////////////////////////////////////////////////////////////

var sizes = {
  lg: {
    height: 12,
    minWidth: 12,
    fontSize: "lg",
    px: 6
  },
  md: {
    height: 10,
    minWidth: 10,
    fontSize: "md",
    px: 4
  },
  sm: {
    height: 8,
    minWidth: 8,
    fontSize: "sm",
    px: 3
  },
  xs: {
    height: 6,
    minWidth: 6,
    fontSize: "xs",
    px: 2
  }
};

var sizeProps = function sizeProps(_ref4) {
  var size = _ref4.size;
  return sizes[size];
}; ////////////////////////////////////////////////////////////


var focusProps = {
  _focus: {
    boxShadow: "outline"
  }
}; ////////////////////////////////////////////////////////////

var unstyledStyle = {
  userSelect: "inherit",
  bg: "none",
  border: 0,
  color: "inherit",
  display: "inline",
  font: "inherit",
  lineHeight: "inherit",
  m: 0,
  p: 0,
  textAlign: "inherit"
}; ////////////////////////////////////////////////////////////

var variantProps = function variantProps(props) {
  switch (props.variant) {
    case "solid":
      return solidVariantProps(props);

    case "ghost":
      return ghostVariantProps(props);

    case "link":
      return linkVariantProps(props);

    case "outline":
      return outlineVariantProps(props);

    case "unstyled":
      return unstyledStyle;

    default:
      return {};
  }
}; ////////////////////////////////////////////////////////////


var baseProps = {
  display: "inline-flex",
  appearance: "none",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 250ms",
  userSelect: "none",
  position: "relative",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
  lineHeight: "1.2",
  outline: "none"
}; ////////////////////////////////////////////////////////////

var useButtonStyle = function useButtonStyle(props) {
  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var theme = (0, _ThemeProvider.useTheme)();

  var _props = _objectSpread({}, props, {
    colorMode: colorMode,
    theme: theme
  });

  return _objectSpread({}, baseProps, {}, sizeProps(_props), {}, focusProps, {}, disabledProps, {}, variantProps(_props));
};

var _default = useButtonStyle;
exports["default"] = _default;