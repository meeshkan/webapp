"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.transformAliasProps = exports["default"] = exports.config = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _styledSystem = require("styled-system");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var isNumber = function isNumber(n) {
  return typeof n === "number" && !isNaN(n);
};

var getWidth = function getWidth(n, scale) {
  return (0, _styledSystem.get)(scale, n, !isNumber(n) || n > 1 ? n : n * 100 + "%");
};

var config = {
  roundedTop: {
    properties: ["borderTopLeftRadius", "borderTopRightRadius"],
    scale: "radii"
  },
  roundedBottom: {
    properties: ["borderBottomLeftRadius", "borderBottomRightRadius"],
    scale: "radii"
  },
  roundedLeft: {
    properties: ["borderTopLeftRadius", "borderBottomLeftRadius"],
    scale: "radii"
  },
  roundedRight: {
    properties: ["borderTopRightRadius", "borderBottomRightRadius"],
    scale: "radii"
  },
  roundedTopRight: {
    property: "borderTopRightRadius",
    scale: "radii"
  },
  roundedTopLeft: {
    property: "borderTopLeftRadius",
    scale: "radii"
  },
  roundedBottomRight: {
    property: "borderBottomRightRadius",
    scale: "radii"
  },
  roundedBottomLeft: {
    property: "borderBottomLeftRadius",
    scale: "radii"
  },
  rounded: {
    property: "borderRadius",
    scale: "radii"
  },
  d: {
    property: "display"
  },
  w: {
    property: "width",
    scale: "sizes",
    transform: getWidth
  },
  minW: {
    property: "minWidth",
    scale: "sizes"
  },
  maxW: {
    property: "maxWidth",
    scale: "sizes"
  },
  h: {
    property: "height",
    scale: "sizes"
  },
  minH: {
    property: "minHeight",
    scale: "sizes"
  },
  maxH: {
    property: "maxHeight",
    scale: "sizes"
  },
  bgImg: {
    property: "backgroundImage"
  },
  bgImage: {
    property: "backgroundImage"
  },
  bgSize: {
    property: "backgroundSize"
  },
  bgPos: {
    property: "backgroundPosition"
  },
  bgRepeat: {
    property: "backgroundRepeat"
  },
  pos: {
    property: "position"
  },
  flexDir: {
    property: "flexDirection"
  },
  shadow: {
    property: "boxShadow",
    scale: "shadows"
  },
  textDecoration: {
    property: "textDecoration"
  },
  overflowX: true,
  overflowY: true,
  textTransform: true,
  animation: true,
  appearance: true,
  transform: true,
  transformOrigin: true,
  visibility: true,
  whiteSpace: true,
  userSelect: true,
  pointerEvents: true,
  wordBreak: true,
  overflowWrap: true,
  textOverflow: true,
  boxSizing: true,
  cursor: true,
  resize: true,
  transition: true,
  listStyleType: true,
  listStylePosition: true,
  listStyleImage: true,
  fill: {
    property: "fill",
    scale: "colors"
  },
  stroke: {
    property: "stroke",
    scale: "colors"
  },
  objectFit: true,
  objectPosition: true,
  backgroundAttachment: {
    property: "backgroundAttachment"
  },
  outline: true,
  "float": true,
  willChange: true
};
exports.config = config;
config.bgAttachment = config.backgroundAttachment;
config.textDecor = config.textDecoration;
config.listStylePos = config.listStylePosition;
config.listStyleImg = config.listStyleImage;
var extraConfig = (0, _styledSystem.system)(config);
var _default = extraConfig; // Create an issue on @styled-system/css to allow custom alias to be passed to the `css` function
// Transform the custom alias to a format that styled-system CSS supports

exports["default"] = _default;

var transformAlias = function transformAlias(prop, propValue) {
  var configKeys = Object.keys(config);
  var result = {};

  if (configKeys.includes(prop)) {
    var _config$prop = config[prop],
        properties = _config$prop.properties,
        property = _config$prop.property;

    if (properties) {
      properties.forEach(function (_cssProp) {
        return result[_cssProp] = propValue;
      });
    }

    if (property) {
      result[property] = propValue;
    }

    if (config[prop] === true) {
      result[prop] = propValue;
    }
  } else {
    result[prop] = propValue;
  }

  return result;
};

var transformAliasProps = function transformAliasProps(props) {
  var result = {};

  for (var prop in props) {
    if (typeof props[prop] === "object" && !Array.isArray(props[prop])) {
      var _objectSpread2;

      result = _objectSpread({}, result, (_objectSpread2 = {}, _objectSpread2[prop] = transformAliasProps(props[prop]), _objectSpread2));
    } else {
      result = _objectSpread({}, result, {}, transformAlias(prop, props[prop]));
    }
  }

  return result;
};

exports.transformAliasProps = transformAliasProps;