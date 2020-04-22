import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import { useFormControl } from "../FormControl";
import { useColorMode } from "../ColorModeProvider";
import Text from "../Text";
export var FormHelperText = forwardRef(function (props, ref) {
  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var formControl = useFormControl(props);
  var color = {
    light: "gray.500",
    dark: "whiteAlpha.600"
  };
  return jsx(Text, _extends({
    mt: 2,
    ref: ref,
    id: formControl.id ? formControl.id + "-help-text" : null,
    color: color[colorMode],
    lineHeight: "normal",
    fontSize: "sm"
  }, props));
});
FormHelperText.displayName = "FormHelperText";
export default FormHelperText;