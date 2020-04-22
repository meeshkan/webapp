import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import Icon from "../Icon";
import Spinner from "../Spinner";
import useButtonStyle from "./styles";
import PseudoBox from "../PseudoBox";
import Box from "../Box";
import { useVariantColorWarning } from "../utils";

var ButtonIcon = function ButtonIcon(_ref) {
  var icon = _ref.icon,
      props = _objectWithoutPropertiesLoose(_ref, ["icon"]);

  if (typeof icon === "string") {
    return jsx(Icon, _extends({
      focusable: "false",
      "aria-hidden": "true",
      name: icon,
      color: "currentColor"
    }, props));
  }

  return jsx(Box, _extends({
    as: icon,
    "data-custom-icon": true,
    focusable: "false",
    "aria-hidden": "true",
    color: "currentColor"
  }, props));
};

var Button = forwardRef(function (_ref2, ref) {
  var isDisabled = _ref2.isDisabled,
      isLoading = _ref2.isLoading,
      isActive = _ref2.isActive,
      isFullWidth = _ref2.isFullWidth,
      children = _ref2.children,
      _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "button" : _ref2$as,
      _ref2$variantColor = _ref2.variantColor,
      variantColor = _ref2$variantColor === void 0 ? "gray" : _ref2$variantColor,
      leftIcon = _ref2.leftIcon,
      rightIcon = _ref2.rightIcon,
      _ref2$variant = _ref2.variant,
      variant = _ref2$variant === void 0 ? "solid" : _ref2$variant,
      loadingText = _ref2.loadingText,
      _ref2$iconSpacing = _ref2.iconSpacing,
      iconSpacing = _ref2$iconSpacing === void 0 ? 2 : _ref2$iconSpacing,
      _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? "button" : _ref2$type,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? "md" : _ref2$size,
      colorMode = _ref2.colorMode,
      rest = _objectWithoutPropertiesLoose(_ref2, ["isDisabled", "isLoading", "isActive", "isFullWidth", "children", "as", "variantColor", "leftIcon", "rightIcon", "variant", "loadingText", "iconSpacing", "type", "size", "colorMode"]);

  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  useVariantColorWarning("Button", variantColor);
  var buttonStyleProps = useButtonStyle({
    color: variantColor,
    variant: variant,
    size: size,
    colorMode: colorMode
  });

  var _isDisabled = isDisabled || isLoading;

  return jsx(PseudoBox, _extends({
    disabled: _isDisabled,
    "aria-disabled": _isDisabled,
    ref: ref,
    as: Comp,
    type: type,
    borderRadius: "md",
    fontWeight: "semibold",
    width: isFullWidth ? "full" : undefined,
    "data-active": isActive ? "true" : undefined
  }, buttonStyleProps, rest), leftIcon && !isLoading && jsx(ButtonIcon, {
    ml: -1,
    mr: iconSpacing,
    icon: leftIcon
  }), isLoading && jsx(Spinner, {
    position: loadingText ? "relative" : "absolute",
    mr: loadingText ? iconSpacing : 0,
    color: "currentColor",
    size: "1em"
  }), isLoading ? loadingText || jsx(Box, {
    as: "span",
    opacity: "0"
  }, children) : children, rightIcon && !isLoading && jsx(ButtonIcon, {
    mr: -1,
    ml: iconSpacing,
    icon: rightIcon
  }));
});
Button.displayName = "Button";
export default Button;