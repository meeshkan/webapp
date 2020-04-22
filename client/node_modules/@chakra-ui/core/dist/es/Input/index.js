import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import { useFormControl } from "../FormControl";
import PseudoBox from "../PseudoBox";
import useInputStyle from "./styles";
var Input = forwardRef(function (props, ref) {
  var size = props.size,
      variant = props.variant,
      as = props.as,
      ariaLabel = props["aria-label"],
      ariaDescribedby = props["aria-describedby"],
      isReadOnly = props.isReadOnly,
      isFullWidth = props.isFullWidth,
      isDisabled = props.isDisabled,
      isInvalid = props.isInvalid,
      isRequired = props.isRequired,
      focusBorderColor = props.focusBorderColor,
      errorBorderColor = props.errorBorderColor,
      rest = _objectWithoutPropertiesLoose(props, ["size", "variant", "as", "aria-label", "aria-describedby", "isReadOnly", "isFullWidth", "isDisabled", "isInvalid", "isRequired", "focusBorderColor", "errorBorderColor"]);

  var inputStyleProps = useInputStyle(props);
  var formControl = useFormControl(props);
  return jsx(PseudoBox, _extends({
    ref: ref,
    as: as,
    readOnly: formControl.isReadOnly,
    "aria-readonly": isReadOnly,
    disabled: formControl.isDisabled,
    "aria-label": ariaLabel,
    "aria-invalid": formControl.isInvalid,
    required: formControl.isRequired,
    "aria-required": formControl.isRequired,
    "aria-disabled": formControl.isDisabled,
    "aria-describedby": ariaDescribedby
  }, inputStyleProps, rest));
});
Input.displayName = "Input";
Input.defaultProps = {
  size: "md",
  as: "input",
  variant: "outline",
  isFullWidth: true,
  focusBorderColor: "blue.500",
  errorBorderColor: "red.500"
};
export default Input;