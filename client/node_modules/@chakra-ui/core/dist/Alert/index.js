"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.AlertIcon = exports.AlertDescription = exports.AlertTitle = exports.Alert = exports.statuses = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _styles = _interopRequireWildcard(require("./styles"));

/** @jsx jsx */
var statuses = {
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
exports.statuses = statuses;
var AlertContext = (0, _react.createContext)();

var useAlertContext = function useAlertContext() {
  var context = (0, _react.useContext)(AlertContext);

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
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["status", "variant"]);
  var alertStyleProps = (0, _styles["default"])({
    variant: variant,
    color: statuses[status] && statuses[status]["color"]
  });
  var context = {
    status: status,
    variant: variant
  };
  return (0, _core.jsx)(AlertContext.Provider, {
    value: context
  }, (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    role: "alert"
  }, alertStyleProps, rest)));
};

exports.Alert = Alert;

var AlertTitle = function AlertTitle(props) {
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    fontWeight: "bold",
    lineHeight: "normal"
  }, props));
};

exports.AlertTitle = AlertTitle;

var AlertDescription = function AlertDescription(props) {
  return (0, _core.jsx)(_Box["default"], props);
};

exports.AlertDescription = AlertDescription;

var AlertIcon = function AlertIcon(props) {
  var _useAlertContext = useAlertContext(),
      status = _useAlertContext.status,
      variant = _useAlertContext.variant;

  var iconStyleProps = (0, _styles.useAlertIconStyle)({
    variant: variant,
    color: statuses[status] && statuses[status]["color"]
  });
  return (0, _core.jsx)(_Icon["default"] // mt={1}
  , (0, _extends2["default"])({
    mr: 3,
    size: 5,
    name: statuses[status] && statuses[status]["icon"]
  }, iconStyleProps, props));
};

exports.AlertIcon = AlertIcon;