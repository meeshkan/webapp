import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createContext, useContext, forwardRef } from "react";
import Box from "../Box";
export var useFormControl = function useFormControl(props) {
  var context = useFormControlContext();

  if (!context) {
    return props;
  }

  var keys = Object.keys(context);
  return keys.reduce(function (acc, prop) {
    /** Giving precedence to `props` over `context` */
    acc[prop] = props[prop];

    if (context) {
      if (props[prop] == null) {
        acc[prop] = context[prop];
      }
    }

    return acc;
  }, {});
};
var FormControlContext = createContext();
export var useFormControlContext = function useFormControlContext() {
  return useContext(FormControlContext);
};
var FormControl = forwardRef(function (_ref, ref) {
  var isInvalid = _ref.isInvalid,
      isRequired = _ref.isRequired,
      isDisabled = _ref.isDisabled,
      isReadOnly = _ref.isReadOnly,
      rest = _objectWithoutPropertiesLoose(_ref, ["isInvalid", "isRequired", "isDisabled", "isReadOnly"]);

  var context = {
    isRequired: isRequired,
    isDisabled: isDisabled,
    isInvalid: isInvalid,
    isReadOnly: isReadOnly
  };
  return jsx(FormControlContext.Provider, {
    value: context
  }, jsx(Box, _extends({
    role: "group",
    ref: ref
  }, rest)));
});
FormControl.displayName = "FormControl";
export default FormControl;