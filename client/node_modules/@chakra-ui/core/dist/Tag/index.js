"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.TagLabel = exports.TagIcon = exports.TagCloseButton = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _styles = _interopRequireDefault(require("../Badge/styles"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _Box = _interopRequireDefault(require("../Box"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _utils = require("../utils");

/** @jsx jsx */
var tagSizes = {
  sm: {
    minH: 6,
    minW: 6,
    fontSize: "sm",
    px: 2
  },
  md: {
    minH: "1.75rem",
    minW: "1.75rem",
    fontSize: "sm",
    px: 2
  },
  lg: {
    minH: 8,
    minW: 8,
    px: 3
  }
};

var TagCloseButton = function TagCloseButton(_ref) {
  var isDisabled = _ref.isDisabled,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["isDisabled"]);
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    as: "button",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    rounded: "full",
    size: "1.25rem",
    outline: "none",
    mr: -1,
    opacity: "0.5",
    disabled: isDisabled,
    _disabled: {
      opacity: "40%",
      cursor: "not-allowed",
      boxShadow: "none"
    },
    _focus: {
      boxShadow: "outline",
      bg: "rgba(0, 0, 0, 0.14)"
    },
    _hover: {
      opacity: "0.8"
    },
    _active: {
      opacity: "1"
    }
  }, props), (0, _core.jsx)(_Icon["default"], {
    size: "18px",
    name: "small-close",
    focusable: "false"
  }));
};

exports.TagCloseButton = TagCloseButton;

var TagIcon = function TagIcon(_ref2) {
  var icon = _ref2.icon,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["icon"]);

  if (typeof icon === "string") {
    return (0, _core.jsx)(_Icon["default"], (0, _extends2["default"])({
      name: icon,
      mx: "0.5rem",
      css: {
        "&:first-child": {
          marginLeft: 0
        },
        "&:last-child": {
          marginRight: 0
        }
      }
    }, props));
  }

  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: icon,
    focusable: "false",
    color: "currentColor",
    mx: "0.5rem",
    css: {
      "&:first-child": {
        marginLeft: 0
      },
      "&:last-child": {
        marginRight: 0
      }
    }
  }, props));
};

exports.TagIcon = TagIcon;

var TagLabel = function TagLabel(props) {
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    isTruncated: true,
    lineHeight: "1.2",
    as: "span"
  }, props));
};

exports.TagLabel = TagLabel;

var Tag = function Tag(_ref3) {
  var _ref3$variant = _ref3.variant,
      variant = _ref3$variant === void 0 ? "subtle" : _ref3$variant,
      _ref3$size = _ref3.size,
      size = _ref3$size === void 0 ? "lg" : _ref3$size,
      _ref3$variantColor = _ref3.variantColor,
      variantColor = _ref3$variantColor === void 0 ? "gray" : _ref3$variantColor,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["variant", "size", "variantColor"]);
  (0, _utils.useVariantColorWarning)("Tag", variantColor);
  var styleProps = (0, _styles["default"])({
    color: variantColor,
    variant: variant
  });
  var sizeProps = tagSizes[size];
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    display: "inline-flex",
    alignItems: "center",
    minH: 6,
    maxW: "100%",
    rounded: "md",
    fontWeight: "medium"
  }, sizeProps, styleProps, rest));
};

var _default = Tag;
exports["default"] = _default;