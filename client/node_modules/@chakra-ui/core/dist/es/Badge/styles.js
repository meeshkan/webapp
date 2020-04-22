import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { addOpacity, generateAlphaColors, get } from "../theme/colors-utils";
import { useTheme } from "../ThemeProvider";
import { useColorMode } from "../ColorModeProvider";

var solidStyle = function solidStyle(_ref) {
  var colors = _ref.theme.colors,
      color = _ref.color;

  var _color = colors[color] && colors[color][500];

  var darkModeBg = addOpacity(_color, 0.6);
  return {
    light: {
      bg: get(color, 500),
      color: "white"
    },
    dark: {
      bg: darkModeBg,
      color: "whiteAlpha.800"
    }
  };
};

var subtleStyle = function subtleStyle(_ref2) {
  var colors = _ref2.theme.colors,
      color = _ref2.color;

  var _color = colors[color] && colors[color][200];

  var alphaColors = generateAlphaColors(_color);
  var darkModeBg = alphaColors[300];
  return {
    light: {
      bg: get(color, 100),
      color: get(color, 800)
    },
    dark: {
      bg: darkModeBg,
      color: get(color, 200)
    }
  };
};

var outlineStyle = function outlineStyle(_ref3) {
  var colors = _ref3.theme.colors,
      color = _ref3.color;

  var _color = colors[color] && colors[color][200];

  var darkModeColor = addOpacity(_color, 0.8);
  var boxShadowColor = colors[color] && colors[color][500];
  return {
    light: {
      boxShadow: "inset 0 0 0px 1px " + boxShadowColor,
      color: get(color, 500)
    },
    dark: {
      boxShadow: "inset 0 0 0px 1px " + darkModeColor,
      color: darkModeColor
    }
  };
};

var variantProps = function variantProps(props) {
  var variant = props.variant,
      colorMode = props.colorMode;

  switch (variant) {
    case "solid":
      return solidStyle(props)[colorMode];

    case "subtle":
      return subtleStyle(props)[colorMode];

    case "outline":
      return outlineStyle(props)[colorMode];

    default:
      return {};
  }
};

var useBadgeStyle = function useBadgeStyle(props) {
  var theme = useTheme();

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var _props = _objectSpread({}, props, {
    theme: theme,
    colorMode: colorMode
  });

  return variantProps(_props);
};

export default useBadgeStyle;