import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import useBadgeStyle from "../Badge/styles";
import Icon from "../Icon";
import Box from "../Box";
import PseudoBox from "../PseudoBox";
import { useVariantColorWarning } from "../utils";
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
export var TagCloseButton = function TagCloseButton(_ref) {
  var isDisabled = _ref.isDisabled,
      props = _objectWithoutPropertiesLoose(_ref, ["isDisabled"]);

  return jsx(PseudoBox, _extends({
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
  }, props), jsx(Icon, {
    size: "18px",
    name: "small-close",
    focusable: "false"
  }));
};
export var TagIcon = function TagIcon(_ref2) {
  var icon = _ref2.icon,
      props = _objectWithoutPropertiesLoose(_ref2, ["icon"]);

  if (typeof icon === "string") {
    return jsx(Icon, _extends({
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

  return jsx(Box, _extends({
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
export var TagLabel = function TagLabel(props) {
  return jsx(Box, _extends({
    isTruncated: true,
    lineHeight: "1.2",
    as: "span"
  }, props));
};

var Tag = function Tag(_ref3) {
  var _ref3$variant = _ref3.variant,
      variant = _ref3$variant === void 0 ? "subtle" : _ref3$variant,
      _ref3$size = _ref3.size,
      size = _ref3$size === void 0 ? "lg" : _ref3$size,
      _ref3$variantColor = _ref3.variantColor,
      variantColor = _ref3$variantColor === void 0 ? "gray" : _ref3$variantColor,
      rest = _objectWithoutPropertiesLoose(_ref3, ["variant", "size", "variantColor"]);

  useVariantColorWarning("Tag", variantColor);
  var styleProps = useBadgeStyle({
    color: variantColor,
    variant: variant
  });
  var sizeProps = tagSizes[size];
  return jsx(PseudoBox, _extends({
    display: "inline-flex",
    alignItems: "center",
    minH: 6,
    maxW: "100%",
    rounded: "md",
    fontWeight: "medium"
  }, sizeProps, styleProps, rest));
};

export default Tag;