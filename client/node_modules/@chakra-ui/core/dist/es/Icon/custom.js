import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import Box from "../Box";
import Icon from ".";

var EnhancedIcon = function EnhancedIcon(_ref) {
  var icon = _ref.icon,
      props = _objectWithoutPropertiesLoose(_ref, ["icon"]);

  if (typeof icon === "string") {
    return jsx(Icon, _extends({
      focusable: "false",
      name: icon,
      color: "currentColor"
    }, props));
  }

  return jsx(Box, _extends({
    as: icon,
    "data-custom-icon": true,
    focusable: "false",
    color: "currentColor"
  }, props));
};

export default EnhancedIcon;