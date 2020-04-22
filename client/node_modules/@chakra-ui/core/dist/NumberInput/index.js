"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.NumberDecrementStepper = exports.NumberIncrementStepper = exports.NumberInputStepper = exports.NumberInputField = exports.NumberInput = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireWildcard(require("react"));

var _ColorModeProvider = require("../ColorModeProvider");

var _Flex = _interopRequireDefault(require("../Flex"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _Input = _interopRequireDefault(require("../Input"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _useNumberInput = _interopRequireDefault(require("../useNumberInput"));

var _utils = require("../utils");

var _styles = _interopRequireDefault(require("./styles"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var NumberInputContext = (0, _react.createContext)({});

var useNumberInputContext = function useNumberInputContext() {
  var context = (0, _react.useContext)(NumberInputContext);

  if (context == null) {
    throw new Error("This component must be used within the `NumberInput` ");
  }

  return context;
};

var NumberInput = (0, _react.forwardRef)(function (_ref2, ref) {
  var value = _ref2.value,
      onChange = _ref2.onChange,
      defaultValue = _ref2.defaultValue,
      focusInputOnChange = _ref2.focusInputOnChange,
      clampValueOnBlur = _ref2.clampValueOnBlur,
      keepWithinRange = _ref2.keepWithinRange,
      min = _ref2.min,
      max = _ref2.max,
      step = _ref2.step,
      precision = _ref2.precision,
      getAriaValueText = _ref2.getAriaValueText,
      isReadOnly = _ref2.isReadOnly,
      isInvalid = _ref2.isInvalid,
      isDisabled = _ref2.isDisabled,
      isFullWidth = _ref2.isFullWidth,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? "md" : _ref2$size,
      children = _ref2.children,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["value", "onChange", "defaultValue", "focusInputOnChange", "clampValueOnBlur", "keepWithinRange", "min", "max", "step", "precision", "getAriaValueText", "isReadOnly", "isInvalid", "isDisabled", "isFullWidth", "size", "children"]);
  var context = (0, _useNumberInput["default"])({
    value: value,
    onChange: onChange,
    defaultValue: defaultValue,
    focusInputOnChange: focusInputOnChange,
    clampValueOnBlur: clampValueOnBlur,
    keepWithinRange: keepWithinRange,
    min: min,
    max: max,
    step: step,
    precision: precision,
    getAriaValueText: getAriaValueText,
    isReadOnly: isReadOnly,
    isInvalid: isInvalid,
    isDisabled: isDisabled
  });

  var _children = children || _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(NumberInputField, null), _react["default"].createElement(NumberInputStepper, null, _react["default"].createElement(NumberIncrementStepper, null), _react["default"].createElement(NumberDecrementStepper, null)));

  return _react["default"].createElement(NumberInputContext.Provider, {
    value: _objectSpread({}, context, {
      size: size
    })
  }, _react["default"].createElement(_Flex["default"], (0, _extends2["default"])({
    ref: ref,
    align: "stretch",
    w: isFullWidth ? "full" : null,
    pos: "relative"
  }, rest), _children));
});
exports.NumberInput = NumberInput;
NumberInput.displayName = "NumberInput";
var NumberInputField = (0, _react.forwardRef)(function (_ref3, ref) {
  var onBlur = _ref3.onBlur,
      onFocus = _ref3.onFocus,
      onKeyDown = _ref3.onKeyDown,
      onChange = _ref3.onChange,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["onBlur", "onFocus", "onKeyDown", "onChange"]);

  var _useNumberInputContex = useNumberInputContext(),
      size = _useNumberInputContex.size,
      _useNumberInputContex2 = _useNumberInputContex.input,
      _ref = _useNumberInputContex2.ref,
      _onBlur = _useNumberInputContex2.onBlur,
      _onFocus = _useNumberInputContex2.onFocus,
      _onChange = _useNumberInputContex2.onChange,
      _onKeyDown = _useNumberInputContex2.onKeyDown,
      isDisabled = _useNumberInputContex2.disabled,
      isReadOnly = _useNumberInputContex2.readOnly,
      otherInputProps = (0, _objectWithoutPropertiesLoose2["default"])(_useNumberInputContex2, ["ref", "onBlur", "onFocus", "onChange", "onKeyDown", "disabled", "readOnly"]);

  var inputRef = (0, _utils.useForkRef)(_ref, ref);
  var handleBlur = (0, _utils.wrapEvent)(onBlur, _onBlur);
  var handleFocus = (0, _utils.wrapEvent)(onFocus, _onFocus);
  var handleKeyDown = (0, _utils.wrapEvent)(onKeyDown, _onKeyDown);
  var handleChange = (0, _utils.wrapEvent)(onChange, _onChange);
  return _react["default"].createElement(_Input["default"], (0, _extends2["default"])({
    ref: inputRef,
    isReadOnly: isReadOnly,
    isDisabled: isDisabled,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onChange: handleChange,
    size: size
  }, otherInputProps, props));
});
exports.NumberInputField = NumberInputField;
NumberInputField.displayName = "NumberInputField";
var NumberInputStepper = (0, _react.forwardRef)(function (props, ref) {
  return _react["default"].createElement(_Flex["default"], (0, _extends2["default"])({
    ref: ref,
    direction: "column",
    "aria-hidden": true,
    width: "24px",
    margin: "1px",
    position: "absolute",
    right: "0px",
    zIndex: "1",
    height: "calc(100% - 2px)"
  }, props));
});
exports.NumberInputStepper = NumberInputStepper;
var StepperButton = (0, _react.forwardRef)(function (props, ref) {
  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var _useNumberInputContex3 = useNumberInputContext(),
      isDisabled = _useNumberInputContex3.isDisabled,
      size = _useNumberInputContex3.size;

  return _react["default"].createElement(_PseudoBox["default"], (0, _extends2["default"])({
    ref: ref,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: "1",
    transition: "all 0.3s",
    role: "button",
    tabindex: "-1",
    userSelect: "none",
    "aria-disabled": isDisabled,
    pointerEvents: isDisabled ? "none" : undefined,
    cursor: "pointer",
    lineHeight: "normal"
  }, (0, _styles["default"])({
    colorMode: colorMode,
    size: size
  }), props));
});
NumberInputStepper.displayName = "NumberInputStepper";
var NumberIncrementStepper = (0, _react.forwardRef)(function (props, ref) {
  var _useNumberInputContex4 = useNumberInputContext(),
      incrementStepper = _useNumberInputContex4.incrementStepper,
      size = _useNumberInputContex4.size;

  var iconSize = size === "sm" ? "11px" : "15px";

  var children = props.children || _react["default"].createElement(_Icon["default"], {
    name: "triangle-up",
    size: "0.6em"
  });

  return _react["default"].createElement(StepperButton, (0, _extends2["default"])({
    fontSize: iconSize,
    ref: ref
  }, props, incrementStepper), children);
});
exports.NumberIncrementStepper = NumberIncrementStepper;
NumberIncrementStepper.displayName = "NumberIncrementStepper";
var NumberDecrementStepper = (0, _react.forwardRef)(function (props, ref) {
  var _useNumberInputContex5 = useNumberInputContext(),
      decrementStepper = _useNumberInputContex5.decrementStepper,
      size = _useNumberInputContex5.size;

  var iconSize = size === "sm" ? "11px" : "15px";

  var children = props.children || _react["default"].createElement(_Icon["default"], {
    name: "triangle-down",
    size: "0.6em"
  });

  return _react["default"].createElement(StepperButton, (0, _extends2["default"])({
    fontSize: iconSize,
    ref: ref
  }, props, decrementStepper), children);
});
exports.NumberDecrementStepper = NumberDecrementStepper;
NumberDecrementStepper.displayName = "NumberDecrementStepper";