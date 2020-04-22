import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import useBadgeStyle from "./styles";
import Box from "../Box";
import { forwardRef } from "react";
import { useVariantColorWarning } from "../utils";
var Badge = forwardRef(function (_ref, ref) {
  var _ref$variantColor = _ref.variantColor,
      variantColor = _ref$variantColor === void 0 ? "gray" : _ref$variantColor,
      _ref$variant = _ref.variant,
      variant = _ref$variant === void 0 ? "subtle" : _ref$variant,
      props = _objectWithoutPropertiesLoose(_ref, ["variantColor", "variant"]);

  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  useVariantColorWarning("Badge", variantColor);
  var badgeStyleProps = useBadgeStyle({
    color: variantColor,
    variant: variant
  });
  return jsx(Box, _extends({
    ref: ref,
    display: "inline-block",
    px: 1,
    textTransform: "uppercase",
    fontSize: "xs",
    borderRadius: "sm",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    verticalAlign: "middle"
  }, badgeStyleProps, props));
});
Badge.displayName = "Badge";
export default Badge;