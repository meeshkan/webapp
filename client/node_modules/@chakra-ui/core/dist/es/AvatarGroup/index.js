import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { cloneElement } from "react";
import { avatarSizes } from "../Avatar/styles";
import { useColorMode } from "../ColorModeProvider";
import Flex from "../Flex";
import { useTheme } from "../ThemeProvider";
import { cleanChildren } from "../utils";

var MoreAvatarLabel = function MoreAvatarLabel(_ref) {
  var size = _ref.size,
      label = _ref.label,
      props = _objectWithoutPropertiesLoose(_ref, ["size", "label"]);

  var borderColor = {
    light: "#fff",
    dark: "gray.800"
  };
  var bg = {
    light: "gray.200",
    dark: "whiteAlpha.400"
  };
  var theme = useTheme();
  var sizeKey = avatarSizes[size];
  var _size = theme.sizes[sizeKey];
  var fontSize = "calc(" + _size + " / 2.75)";

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  return jsx(Flex, _extends({
    bg: bg[colorMode],
    color: "inherit",
    rounded: "full",
    alignItems: "center",
    justifyContent: "center",
    border: "2px",
    borderColor: borderColor[colorMode],
    size: avatarSizes[size],
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
      rest = _objectWithoutPropertiesLoose(_ref2, ["size", "children", "borderColor", "max", "spacing"]);

  var validChildren = cleanChildren(children);
  var count = validChildren.length;
  var clones = validChildren.map(function (child, index) {
    if (max && index > max) {
      return null;
    }

    if (max == null || max && index < max) {
      var isFirstAvatar = index === 0;
      return cloneElement(child, {
        ml: isFirstAvatar ? 0 : spacing,
        size: size,
        borderColor: borderColor || child.props.borderColor,
        showBorder: true,
        zIndex: count - index
      });
    }

    if (max && index === max) {
      return jsx(MoreAvatarLabel, {
        key: index,
        size: size,
        ml: spacing,
        label: "+" + (count - max)
      });
    }
  });
  return jsx(Flex, _extends({
    alignItems: "center"
  }, rest), clones);
};

export default AvatarGroup;