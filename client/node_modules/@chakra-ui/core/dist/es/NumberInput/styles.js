import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var themedProps = {
  light: {
    borderColor: "inherit",
    _active: {
      bg: "gray.200"
    }
  },
  dark: {
    color: "whiteAlpha.800",
    borderColor: "whiteAlpha.300",
    _active: {
      bg: "whiteAlpha.300"
    }
  }
};

var styleProps = function styleProps(_ref) {
  var colorMode = _ref.colorMode,
      size = _ref.size;
  return _objectSpread({
    borderLeft: "1px",
    _first: {
      roundedTopRight: size === "sm" ? 1 : 3
    },
    _last: {
      roundedBottomRight: size === "sm" ? 1 : 3,
      mt: "-1px",
      borderTopWidth: 1
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed"
    }
  }, themedProps[colorMode]);
};

export default styleProps;