import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import useBadgeStyle from "../Badge/styles";
import Box from "../Box";
import { useVariantColorWarning } from "../utils";

var Code = function Code(_ref) {
  var _ref$variantColor = _ref.variantColor,
      variantColor = _ref$variantColor === void 0 ? "gray" : _ref$variantColor,
      props = _objectWithoutPropertiesLoose(_ref, ["variantColor"]);

  useVariantColorWarning("Code", variantColor);
  var badgeStyle = useBadgeStyle({
    variant: "subtle",
    color: variantColor
  });
  return jsx(Box, _extends({
    as: "code",
    display: "inline-block",
    fontFamily: "mono",
    fontSize: "sm",
    px: "0.2em",
    rounded: "sm"
  }, badgeStyle, props));
};

export default Code;