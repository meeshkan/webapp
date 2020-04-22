import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @jsx jsx */
import { useContext } from "react";
import { TabContext } from ".";
import { useColorMode } from "../ColorModeProvider";
import { useTheme } from "../ThemeProvider";
export var baseProps = {
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  _focus: {
    zIndex: "1",
    boxShadow: "outline"
  }
};
export var disabledProps = {
  _disabled: {
    opacity: 0.4,
    cursor: "not-allowed"
  }
};

var lineStyle = function lineStyle(_ref) {
  var color = _ref.color,
      colorMode = _ref.colorMode;
  var _color = {
    light: color + ".600",
    dark: color + ".300"
  };
  return {
    tabList: {
      borderBottom: "2px",
      borderColor: "inherit"
    },
    tab: {
      borderBottom: "2px",
      borderColor: "transparent",
      mb: "-2px",
      _selected: {
        color: _color[colorMode],
        borderColor: "currentColor"
      },
      _active: {
        bg: "gray.200"
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed"
      }
    }
  };
}; // TODO: Create new issue in @styled-system/css to allow custom alias


var enclosedStyle = function enclosedStyle(_ref2) {
  var color = _ref2.color,
      colorMode = _ref2.colorMode,
      theme = _ref2.theme;
  var _selectedColor = {
    light: color + ".600",
    dark: color + ".300"
  };
  var _selectedBg = {
    light: "#fff",
    dark: theme.colors.gray[800]
  };
  return {
    tab: {
      roundedTop: "md",
      border: "1px",
      borderColor: "transparent",
      mb: "-1px",
      _selected: {
        color: _selectedColor[colorMode],
        borderColor: "inherit",
        borderBottomColor: _selectedBg[colorMode]
      }
    },
    tabList: {
      mb: "-1px",
      borderBottom: "1px",
      borderColor: "inherit"
    }
  };
};

var enclosedColoredStyle = function enclosedColoredStyle(_ref3) {
  var color = _ref3.color,
      colorMode = _ref3.colorMode;
  var bg = {
    light: "gray.50",
    dark: "whiteAlpha.50"
  };
  var _selectedColor = {
    light: color + ".600",
    dark: color + ".300"
  };
  var _selectedBg = {
    light: "#fff",
    dark: "gray.800"
  };
  return {
    tab: {
      border: "1px",
      borderColor: "inherit",
      bg: bg[colorMode],
      mb: "-1px",
      _notLast: {
        mr: "-1px"
      },
      _selected: {
        bg: _selectedBg[colorMode],
        color: _selectedColor[colorMode],
        borderColor: "inherit",
        borderTopColor: "currentColor",
        borderBottomColor: "transparent"
      }
    },
    tabList: {
      mb: "-1px",
      borderBottom: "1px",
      borderColor: "inherit"
    }
  };
};

var softRoundedStyle = function softRoundedStyle(_ref4) {
  var color = _ref4.color;
  return {
    tab: {
      rounded: "full",
      fontWeight: "semibold",
      color: "gray.600",
      _selected: {
        color: color + ".700",
        bg: color + ".100"
      }
    },
    tabList: {}
  };
};

var solidRoundedStyle = function solidRoundedStyle(_ref5) {
  var color = _ref5.color,
      colorMode = _ref5.colorMode;
  var _color = {
    light: "gray.600",
    dark: "inherit"
  };
  var _selectedBg = {
    light: color + ".600",
    dark: color + ".300"
  };
  var _selectedColor = {
    light: "#fff",
    dark: "gray.800"
  };
  return {
    tab: {
      rounded: "full",
      fontWeight: "semibold",
      color: _color[colorMode],
      _selected: {
        color: _selectedColor[colorMode],
        bg: _selectedBg[colorMode]
      }
    },
    tabList: {}
  };
};

export var variantStyle = function variantStyle(props) {
  switch (props.variant) {
    case "line":
      return lineStyle(props);

    case "enclosed":
      return enclosedStyle(props);

    case "enclosed-colored":
      return enclosedColoredStyle(props);

    case "soft-rounded":
      return softRoundedStyle(props);

    case "solid-rounded":
      return solidRoundedStyle(props);

    case "unstyled":
      return {};

    default:
      break;
  }
}; // TO DO: Add support for vertical orientation

export var orientationStyle = function orientationStyle(_ref6) {
  var align = _ref6.align,
      orientation = _ref6.orientation;
  var alignments = {
    end: "flex-end",
    center: "center",
    start: "flex-start"
  };
  var tabListStyle;
  var tabStyle;

  if (orientation === "horizontal") {
    tabListStyle = {
      alignItems: "center",
      justifyContent: alignments[align],
      maxWidth: "full"
    };
    tabStyle = {
      height: "100%"
    };
  }

  if (orientation === "vertical") {
    tabListStyle = {
      flexDirection: "column"
    };
    tabStyle = {
      width: "100%"
    };
  }

  return {
    tabList: tabListStyle,
    tab: tabStyle
  };
};
var tabSizes = {
  sm: {
    padding: "0.25rem 1rem",
    fontSize: "0.85rem"
  },
  md: {
    fontSize: "1rem",
    padding: "0.5rem 1rem"
  },
  lg: {
    fontSize: "1.15rem",
    padding: "0.75rem 1rem"
  }
};
export var useTabStyle = function useTabStyle() {
  var theme = useTheme();

  var _useContext = useContext(TabContext),
      variant = _useContext.variant,
      color = _useContext.color,
      size = _useContext.size,
      isFitted = _useContext.isFitted,
      orientation = _useContext.orientation;

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var _variantStyle = variantStyle({
    variant: variant,
    color: color,
    theme: theme,
    colorMode: colorMode
  });

  var _orientationStyle = orientationStyle({
    orientation: orientation
  });

  return _objectSpread({}, baseProps, {}, disabledProps, {}, tabSizes[size], {}, _variantStyle && _variantStyle.tab, {}, _orientationStyle && _orientationStyle.tab, {}, isFitted && {
    flex: 1
  });
};
export var useTabListStyle = function useTabListStyle() {
  var theme = useTheme();

  var _useContext2 = useContext(TabContext),
      variant = _useContext2.variant,
      align = _useContext2.align,
      orientation = _useContext2.orientation;

  var _variantStyle = variantStyle({
    variant: variant,
    theme: theme
  });

  var _orientationStyle = orientationStyle({
    align: align,
    orientation: orientation
  });

  return _objectSpread({}, _variantStyle && _variantStyle.tabList, {}, _orientationStyle && _orientationStyle.tabList);
};