import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import Box from "../Box";
import { forwardRef } from "react";
var Divider = forwardRef(function (_ref, ref) {
  var orientation = _ref.orientation,
      props = _objectWithoutPropertiesLoose(_ref, ["orientation"]);

  var borderProps = orientation === "vertical" ? {
    borderLeft: "0.0625rem solid",
    height: "auto",
    mx: 2
  } : {
    borderBottom: "0.0625rem solid",
    width: "auto",
    my: 2
  };
  return jsx(Box, _extends({
    ref: ref,
    as: "hr",
    "aria-orientation": orientation,
    border: "0",
    opacity: "0.6"
  }, borderProps, {
    borderColor: "inherit"
  }, props));
});
export default Divider;