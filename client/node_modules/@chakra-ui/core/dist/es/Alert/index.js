import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createContext, useContext } from "react";
import Box from "../Box";
import Icon from "../Icon";
import useAlertStyle, { useAlertIconStyle } from "./styles";
export var statuses = {
  info: {
    icon: "info",
    color: "blue"
  },
  warning: {
    icon: "warning-2",
    color: "orange"
  },
  success: {
    icon: "check-circle",
    color: "green"
  },
  error: {
    icon: "warning",
    color: "red"
  }
};
var AlertContext = createContext();

var useAlertContext = function useAlertContext() {
  var context = useContext(AlertContext);

  if (context === undefined) {
    throw new Error("useAlertContext must be used within a AlertContextProvider");
  }

  return context;
};

var Alert = function Alert(_ref) {
  var _ref$status = _ref.status,
      status = _ref$status === void 0 ? "info" : _ref$status,
      _ref$variant = _ref.variant,
      variant = _ref$variant === void 0 ? "subtle" : _ref$variant,
      rest = _objectWithoutPropertiesLoose(_ref, ["status", "variant"]);

  var alertStyleProps = useAlertStyle({
    variant: variant,
    color: statuses[status] && statuses[status]["color"]
  });
  var context = {
    status: status,
    variant: variant
  };
  return jsx(AlertContext.Provider, {
    value: context
  }, jsx(Box, _extends({
    role: "alert"
  }, alertStyleProps, rest)));
};

var AlertTitle = function AlertTitle(props) {
  return jsx(Box, _extends({
    fontWeight: "bold",
    lineHeight: "normal"
  }, props));
};

var AlertDescription = function AlertDescription(props) {
  return jsx(Box, props);
};

var AlertIcon = function AlertIcon(props) {
  var _useAlertContext = useAlertContext(),
      status = _useAlertContext.status,
      variant = _useAlertContext.variant;

  var iconStyleProps = useAlertIconStyle({
    variant: variant,
    color: statuses[status] && statuses[status]["color"]
  });
  return jsx(Icon // mt={1}
  , _extends({
    mr: 3,
    size: 5,
    name: statuses[status] && statuses[status]["icon"]
  }, iconStyleProps, props));
};

export { Alert, AlertTitle, AlertDescription, AlertIcon };