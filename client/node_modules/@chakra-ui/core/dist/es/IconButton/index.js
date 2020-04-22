import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import Icon from "../Icon";
import Button from "../Button";
import Box from "../Box";
var IconButton = forwardRef(function (_ref, ref) {
  var icon = _ref.icon,
      isRound = _ref.isRound,
      ariaLabel = _ref["aria-label"],
      rest = _objectWithoutPropertiesLoose(_ref, ["icon", "isRound", "aria-label"]);

  // Remove some props before passing it to IconButton
  var isFullWidth = rest.isFullWidth,
      leftIcon = rest.leftIcon,
      rightIcon = rest.rightIcon,
      loadingText = rest.loadingText,
      props = _objectWithoutPropertiesLoose(rest, ["isFullWidth", "leftIcon", "rightIcon", "loadingText"]);

  return jsx(Button, _extends({
    p: "0",
    borderRadius: isRound ? "full" : "md",
    ref: ref,
    "aria-label": ariaLabel
  }, props), typeof icon === "string" ? jsx(Icon, {
    name: icon,
    focusable: "false",
    color: "currentColor",
    "aria-hidden": true
  }) : jsx(Box, {
    as: icon,
    "aria-hidden": true,
    focusable: "false",
    color: "currentColor"
  }));
});
IconButton.displayName = "IconButton";
IconButton.defaultProps = Button.defaultProps;
export default IconButton;