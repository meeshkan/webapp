import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @jsx jsx */
import { jsx } from "@emotion/core";
import Box from "../Box";
import useInputStyle from "../Input/styles";
import { useColorMode } from "../ColorModeProvider";

var InputAddon = function InputAddon(_ref) {
  var _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? "left" : _ref$placement,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? "md" : _ref$size,
      props = _objectWithoutPropertiesLoose(_ref, ["placement", "size"]);

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var bg = {
    dark: "whiteAlpha.300",
    light: "gray.100"
  };
  var _placement = {
    left: {
      mr: "-1px",
      roundedRight: 0,
      borderRightColor: "transparent"
    },
    right: {
      order: 1,
      roundedLeft: 0,
      borderLeftColor: "transparent"
    }
  };

  var styleProps = _objectSpread({}, useInputStyle({
    size: size,
    variant: "outline"
  }), {
    flex: "0 0 auto",
    whiteSpace: "nowrap",
    bg: bg[colorMode]
  }, _placement[placement]);

  return jsx(Box, _extends({}, styleProps, props));
};

var InputLeftAddon = function InputLeftAddon(props) {
  return jsx(InputAddon, _extends({
    placement: "left"
  }, props));
};

var InputRightAddon = function InputRightAddon(props) {
  return jsx(InputAddon, _extends({
    placement: "right"
  }, props));
};

export { InputLeftAddon, InputRightAddon };
export default InputAddon;