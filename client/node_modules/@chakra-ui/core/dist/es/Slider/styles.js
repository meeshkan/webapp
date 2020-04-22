import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @jsx jsx */
import { useTheme } from "../ThemeProvider";
import { useColorMode } from "../ColorModeProvider";
var centeredProps = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)"
};

var thumbStyle = function thumbStyle(_ref) {
  var thumbSize = _ref.thumbSize,
      trackPercent = _ref.trackPercent,
      theme = _ref.theme;
  return _objectSpread({}, centeredProps, {
    zIndex: 1,
    size: thumbSize,
    rounded: "full",
    bg: "#fff",
    boxShadow: "sm",
    left: "calc(" + trackPercent + "% - " + thumbSize + " / 2)",
    border: "1px",
    borderColor: "transparent",
    transition: "transform 0.2s",
    _focus: {
      boxShadow: "outline"
    },
    _disabled: {
      backgroundColor: "gray.300"
    },
    _active: {
      transform: "translateY(-50%) scale(1.15)"
    }
  });
};

var filledTrackStyle = function filledTrackStyle(_ref2) {
  var trackHeight = _ref2.trackHeight,
      trackPercent = _ref2.trackPercent,
      color = _ref2.color,
      colorMode = _ref2.colorMode;
  return _objectSpread({}, centeredProps, {
    height: trackHeight,
    bg: colorMode === "light" ? color + ".500" : color + ".200",
    width: trackPercent + "%",
    rounded: "sm"
  });
};

var themedTrackStyle = {
  light: {
    bg: "gray.200",
    _disabled: {
      bg: "gray.300"
    }
  },
  dark: {
    bg: "whiteAlpha.200",
    _disabled: {
      bg: "whiteAlpha.300"
    }
  }
};

var trackStyle = function trackStyle(_ref3) {
  var trackHeight = _ref3.trackHeight,
      theme = _ref3.theme,
      colorMode = _ref3.colorMode;
  return _objectSpread({
    height: trackHeight,
    borderRadius: "sm",
    width: "100%"
  }, centeredProps, {}, themedTrackStyle[colorMode]);
};

var rootStyle = {
  width: "full",
  display: "inline-block",
  position: "relative",
  cursor: "pointer",
  _disabled: {
    opacity: 0.6,
    cursor: "default",
    pointerEvents: "none"
  }
};
var sizes = {
  lg: {
    thumb: "16px",
    trackHeight: "4px"
  },
  md: {
    thumb: "14px",
    trackHeight: "4px"
  },
  sm: {
    thumb: "10px",
    trackHeight: "2px"
  }
};

var useSliderStyle = function useSliderStyle(props) {
  var theme = useTheme();

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var trackPercent = props.trackPercent,
      size = props.size,
      color = props.color;
  var _sizes$size = sizes[size],
      trackHeight = _sizes$size.trackHeight,
      thumbSize = _sizes$size.thumb;
  var _props = {
    trackHeight: trackHeight,
    thumbSize: thumbSize,
    theme: theme,
    trackPercent: trackPercent,
    color: color,
    colorMode: colorMode
  };
  return {
    rootStyle: rootStyle,
    trackStyle: trackStyle(_props),
    filledTrackStyle: filledTrackStyle(_props),
    thumbStyle: thumbStyle(_props)
  };
};

export default useSliderStyle;