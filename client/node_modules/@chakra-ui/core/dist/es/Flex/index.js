import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import React, { forwardRef } from "react";
import Box from "../Box";
var Flex = forwardRef(function (_ref, ref) {
  var align = _ref.align,
      justify = _ref.justify,
      wrap = _ref.wrap,
      direction = _ref.direction,
      rest = _objectWithoutPropertiesLoose(_ref, ["align", "justify", "wrap", "direction"]);

  return React.createElement(Box, _extends({
    ref: ref,
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap
  }, rest));
});
Flex.displayName = "Flex";
export default Flex;