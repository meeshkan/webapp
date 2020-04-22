import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { createContext, forwardRef, useContext } from "react";
import { useColorMode } from "../ColorModeProvider";
import Flex from "../Flex";
import Icon from "../Icon";
import Input from "../Input";
import PseudoBox from "../PseudoBox";
import useNumberInput from "../useNumberInput";
import { useForkRef, wrapEvent } from "../utils";
import styleProps from "./styles";
var NumberInputContext = createContext({});

var useNumberInputContext = function useNumberInputContext() {
  var context = useContext(NumberInputContext);

  if (context == null) {
    throw new Error("This component must be used within the `NumberInput` ");
  }

  return context;
};

var NumberInput = forwardRef(function (_ref2, ref) {
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
      rest = _objectWithoutPropertiesLoose(_ref2, ["value", "onChange", "defaultValue", "focusInputOnChange", "clampValueOnBlur", "keepWithinRange", "min", "max", "step", "precision", "getAriaValueText", "isReadOnly", "isInvalid", "isDisabled", "isFullWidth", "size", "children"]);

  var context = useNumberInput({
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

  var _children = children || React.createElement(React.Fragment, null, React.createElement(NumberInputField, null), React.createElement(NumberInputStepper, null, React.createElement(NumberIncrementStepper, null), React.createElement(NumberDecrementStepper, null)));

  return React.createElement(NumberInputContext.Provider, {
    value: _objectSpread({}, context, {
      size: size
    })
  }, React.createElement(Flex, _extends({
    ref: ref,
    align: "stretch",
    w: isFullWidth ? "full" : null,
    pos: "relative"
  }, rest), _children));
});
NumberInput.displayName = "NumberInput";
var NumberInputField = forwardRef(function (_ref3, ref) {
  var onBlur = _ref3.onBlur,
      onFocus = _ref3.onFocus,
      onKeyDown = _ref3.onKeyDown,
      onChange = _ref3.onChange,
      props = _objectWithoutPropertiesLoose(_ref3, ["onBlur", "onFocus", "onKeyDown", "onChange"]);

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
      otherInputProps = _objectWithoutPropertiesLoose(_useNumberInputContex2, ["ref", "onBlur", "onFocus", "onChange", "onKeyDown", "disabled", "readOnly"]);

  var inputRef = useForkRef(_ref, ref);
  var handleBlur = wrapEvent(onBlur, _onBlur);
  var handleFocus = wrapEvent(onFocus, _onFocus);
  var handleKeyDown = wrapEvent(onKeyDown, _onKeyDown);
  var handleChange = wrapEvent(onChange, _onChange);
  return React.createElement(Input, _extends({
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
NumberInputField.displayName = "NumberInputField";
var NumberInputStepper = forwardRef(function (props, ref) {
  return React.createElement(Flex, _extends({
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
var StepperButton = forwardRef(function (props, ref) {
  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var _useNumberInputContex3 = useNumberInputContext(),
      isDisabled = _useNumberInputContex3.isDisabled,
      size = _useNumberInputContex3.size;

  return React.createElement(PseudoBox, _extends({
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
  }, styleProps({
    colorMode: colorMode,
    size: size
  }), props));
});
NumberInputStepper.displayName = "NumberInputStepper";
var NumberIncrementStepper = forwardRef(function (props, ref) {
  var _useNumberInputContex4 = useNumberInputContext(),
      incrementStepper = _useNumberInputContex4.incrementStepper,
      size = _useNumberInputContex4.size;

  var iconSize = size === "sm" ? "11px" : "15px";
  var children = props.children || React.createElement(Icon, {
    name: "triangle-up",
    size: "0.6em"
  });
  return React.createElement(StepperButton, _extends({
    fontSize: iconSize,
    ref: ref
  }, props, incrementStepper), children);
});
NumberIncrementStepper.displayName = "NumberIncrementStepper";
var NumberDecrementStepper = forwardRef(function (props, ref) {
  var _useNumberInputContex5 = useNumberInputContext(),
      decrementStepper = _useNumberInputContex5.decrementStepper,
      size = _useNumberInputContex5.size;

  var iconSize = size === "sm" ? "11px" : "15px";
  var children = props.children || React.createElement(Icon, {
    name: "triangle-down",
    size: "0.6em"
  });
  return React.createElement(StepperButton, _extends({
    fontSize: iconSize,
    ref: ref
  }, props, decrementStepper), children);
});
NumberDecrementStepper.displayName = "NumberDecrementStepper";
export { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper };