"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _styles = require("../Avatar/styles");

var _ColorModeProvider = require("../ColorModeProvider");

var _Flex = _interopRequireDefault(require("../Flex"));

var _ThemeProvider = require("../ThemeProvider");

var _utils = require("../utils");

/** @jsx jsx */
var MoreAvatarLabel = function MoreAvatarLabel(_ref) {
  var size = _ref.size,
      label = _ref.label,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["size", "label"]);
  var borderColor = {
    light: "#fff",
    dark: "gray.800"
  };
  var bg = {
    light: "gray.200",
    dark: "whiteAlpha.400"
  };
  var theme = (0, _ThemeProvider.useTheme)();
  var sizeKey = _styles.avatarSizes[size];
  var _size = theme.sizes[sizeKey];
  var fontSize = "calc(" + _size + " / 2.75)";

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  return (0, _core.jsx)(_Flex["default"], (0, _extends2["default"])({
    bg: bg[colorMode],
    color: "inherit",
    rounded: "full",
    alignItems: "center",
    justifyContent: "center",
    border: "2px",
    borderColor: borderColor[colorMode],
    size: _styles.avatarSizes[size],
    fontSize: fontSize
  }, props), label);
};

var AvatarGroup = function AvatarGroup(_ref2) {
  var size = _ref2.size,
      children = _ref2.children,
      borderColor = _ref2.borderColor,
      max = _ref2.max,
      _ref2$spacing = _ref2.spacing,
      spacing = _ref2$spacing === void 0 ? -3 : _ref2$spacing,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["size", "children", "borderColor", "max", "spacing"]);
  var validChildren = (0, _utils.cleanChildren)(children);
  var count = validChildren.length;
  var clones = validChildren.map(function (child, index) {
    if (max && index > max) {
      return null;
    }

    if (max == null || max && index < max) {
      var isFirstAvatar = index === 0;
      return (0, _react.cloneElement)(child, {
        ml: isFirstAvatar ? 0 : spacing,
        size: size,
        borderColor: borderColor || child.props.borderColor,
        showBorder: true,
        zIndex: count - index
      });
    }

    if (max && index === max) {
      return (0, _core.jsx)(MoreAvatarLabel, {
        key: index,
        size: size,
        ml: spacing,
        label: "+" + (count - max)
      });
    }
  });
  return (0, _core.jsx)(_Flex["default"], (0, _extends2["default"])({
    alignItems: "center"
  }, rest), clones);
};

var _default = AvatarGroup;
exports["default"] = _default;