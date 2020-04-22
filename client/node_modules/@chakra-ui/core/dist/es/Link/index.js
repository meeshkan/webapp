import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import PseudoBox from "../PseudoBox";
import { forwardRef } from "react";
var baseStyleProps = {
  transition: "all 0.15s ease-out",
  cursor: "pointer",
  textDecoration: "none",
  outline: "none",
  _focus: {
    boxShadow: "outline"
  },
  _disabled: {
    opacity: "0.4",
    cursor: "not-allowed",
    textDecoration: "none"
  }
};
var Link = forwardRef(function (_ref, ref) {
  var isDisabled = _ref.isDisabled,
      isExternal = _ref.isExternal,
      onClick = _ref.onClick,
      rest = _objectWithoutPropertiesLoose(_ref, ["isDisabled", "isExternal", "onClick"]);

  var externalProps = isExternal ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : null;
  return jsx(PseudoBox, _extends({
    as: "a",
    ref: ref,
    tabIndex: isDisabled ? -1 : undefined,
    "aria-disabled": isDisabled,
    onClick: isDisabled ? function (event) {
      return event.preventDefault();
    } : onClick,
    _hover: {
      textDecoration: "underline"
    }
  }, externalProps, baseStyleProps, rest));
});
Link.displayName = "Link";
export default Link;