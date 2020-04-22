import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { canUseDOM } from "exenv";
import { useRef, useState, useEffect, useCallback } from "react";
import { calculatePrecision, preventNonNumberKey, roundToPrecision } from "./utils";

function useLongPress(callback, speed) {
  var _ref;

  if (callback === void 0) {
    callback = function callback() {};
  }

  if (speed === void 0) {
    speed = 200;
  }

  var _useState = useState(false),
      isPressed = _useState[0],
      setIsPressed = _useState[1];

  useEffect(function () {
    var timerId;

    if (isPressed) {
      timerId = setTimeout(callback, speed);
    } else {
      clearTimeout(timerId);
    }

    return function () {
      clearTimeout(timerId);
    };
  }, [isPressed, callback, speed]);
  var start = useCallback(function () {
    callback();
    setIsPressed(true);
  }, [callback]);
  var stop = useCallback(function () {
    setIsPressed(false);
  }, []);
  var clickEvent = canUseDOM && !!document.documentElement.ontouchstart ? "onTouchStart" : "onMouseDown";
  return _ref = {}, _ref[clickEvent] = start, _ref.onMouseUp = stop, _ref.onMouseLeave = stop, _ref.onTouchEnd = stop, _ref;
}

function useNumberInput(_ref2) {
  var valueProp = _ref2.value,
      onChange = _ref2.onChange,
      defaultValue = _ref2.defaultValue,
      _ref2$focusInputOnCha = _ref2.focusInputOnChange,
      focusInputOnChange = _ref2$focusInputOnCha === void 0 ? true : _ref2$focusInputOnCha,
      _ref2$clampValueOnBlu = _ref2.clampValueOnBlur,
      clampValueOnBlur = _ref2$clampValueOnBlu === void 0 ? true : _ref2$clampValueOnBlu,
      _ref2$keepWithinRange = _ref2.keepWithinRange,
      keepWithinRange = _ref2$keepWithinRange === void 0 ? true : _ref2$keepWithinRange,
      _ref2$min = _ref2.min,
      min = _ref2$min === void 0 ? -Infinity : _ref2$min,
      _ref2$max = _ref2.max,
      max = _ref2$max === void 0 ? Infinity : _ref2$max,
      _ref2$step = _ref2.step,
      stepProp = _ref2$step === void 0 ? 1 : _ref2$step,
      precisionProp = _ref2.precision,
      getAriaValueText = _ref2.getAriaValueText,
      isReadOnly = _ref2.isReadOnly,
      isInvalid = _ref2.isInvalid,
      isDisabled = _ref2.isDisabled;

  var _useRef = useRef(valueProp != null),
      isControlled = _useRef.current;

  var defaultPrecision = Math.max(calculatePrecision(stepProp), 0);
  var precision = precisionProp || defaultPrecision;

  var _useState2 = useState(function () {
    if (defaultValue != null) {
      var nextValue = defaultValue;

      if (keepWithinRange) {
        nextValue = Math.max(Math.min(nextValue, max), min);
      }

      nextValue = roundToPrecision(nextValue, precision);
      return nextValue;
    }

    return "";
  }),
      valueState = _useState2[0],
      setValue = _useState2[1];

  var _useState3 = useState(false),
      isFocused = _useState3[0],
      setIsFocused = _useState3[1];

  var value = isControlled ? valueProp : valueState;
  var isInteractive = !(isReadOnly || isDisabled);
  var inputRef = useRef();
  var prevNextValue = useRef(null);

  var shouldConvertToNumber = function shouldConvertToNumber(value) {
    var hasDot = value.indexOf(".") > -1;
    var hasTrailingZero = value.substr(value.length - 1) === "0";
    var hasTrailingDot = value.substr(value.length - 1) === ".";
    if (hasDot && hasTrailingZero) return false;
    if (hasDot && hasTrailingDot) return false;
    return true;
  };

  var updateValue = function updateValue(nextValue) {
    //eslint-disable-next-line
    if (prevNextValue.current == nextValue) return;
    var shouldConvert = shouldConvertToNumber(nextValue);
    var converted = shouldConvert ? +nextValue : nextValue;
    if (!isControlled) setValue(converted);
    if (onChange) onChange(converted);
    prevNextValue.current = nextValue;
  };

  var handleIncrement = function handleIncrement(step) {
    if (step === void 0) {
      step = stepProp;
    }

    if (!isInteractive) return;
    var nextValue = Number(value) + Number(step);

    if (keepWithinRange) {
      nextValue = Math.min(nextValue, max);
    }

    nextValue = roundToPrecision(nextValue, precision);
    updateValue(nextValue);
    focusInput();
  };

  var handleDecrement = function handleDecrement(step) {
    if (step === void 0) {
      step = stepProp;
    }

    if (!isInteractive) return;
    var nextValue = Number(value) - Number(step);

    if (keepWithinRange) {
      nextValue = Math.max(nextValue, min);
    }

    nextValue = roundToPrecision(nextValue, precision);
    updateValue(nextValue);
    focusInput();
  };

  var focusInput = function focusInput() {
    if (focusInputOnChange && inputRef.current && canUseDOM) {
      requestAnimationFrame(function () {
        inputRef.current.focus();
      });
    }
  };

  var incrementStepperProps = useLongPress(handleIncrement);
  var decrementStepperProps = useLongPress(handleDecrement);

  var handleChange = function handleChange(event) {
    updateValue(event.target.value);
  };

  var handleKeyDown = function handleKeyDown(event) {
    preventNonNumberKey(event);
    if (!isInteractive) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      var ratio = getIncrementFactor(event);
      handleIncrement(ratio * stepProp);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      var _ratio = getIncrementFactor(event);

      handleDecrement(_ratio * stepProp);
    }

    if (event.key === "Home") {
      event.preventDefault();

      if (min != null) {
        updateValue(max);
      }
    }

    if (event.key === "End") {
      event.preventDefault();

      if (max != null) {
        updateValue(min);
      }
    }
  };

  var getIncrementFactor = function getIncrementFactor(event) {
    var ratio = 1;

    if (event.metaKey || event.ctrlKey) {
      ratio = 0.1;
    }

    if (event.shiftKey) {
      ratio = 10;
    }

    return ratio;
  };

  var validateAndClamp = function validateAndClamp() {
    var maxExists = max != null;
    var minExists = min != null;

    if (maxExists && value > max) {
      updateValue(max);
    }

    if (minExists && value < min) {
      updateValue(min);
    }
  };

  var isOutOfRange = value > max || value < min;
  var ariaValueText = getAriaValueText ? getAriaValueText(value) : null;
  return {
    value: value,
    isFocused: isFocused,
    isDisabled: isDisabled,
    isReadOnly: isReadOnly,
    incrementStepper: incrementStepperProps,
    decrementStepper: decrementStepperProps,
    incrementButton: _objectSpread({
      onClick: function onClick() {
        return handleIncrement();
      },
      "aria-label": "add"
    }, keepWithinRange && {
      disabled: value === max,
      "aria-disabled": value === max
    }),
    decrementButton: _objectSpread({
      onClick: function onClick() {
        return handleDecrement();
      },
      "aria-label": "subtract"
    }, keepWithinRange && {
      disabled: value === min,
      "aria-disabled": value === min
    }),
    input: _objectSpread({
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      ref: inputRef,
      value: value,
      role: "spinbutton",
      type: "text",
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-disabled": isDisabled,
      "aria-valuenow": value,
      "aria-invalid": isInvalid || isOutOfRange
    }, getAriaValueText && {
      "aria-valuetext": ariaValueText
    }, {
      readOnly: isReadOnly,
      disabled: isDisabled,
      autoComplete: "off",
      onFocus: function onFocus() {
        setIsFocused(true);
      },
      onBlur: function onBlur() {
        setIsFocused(false);

        if (clampValueOnBlur) {
          validateAndClamp();
        }
      }
    }),
    hiddenLabel: {
      "aria-live": "polite",
      children: getAriaValueText ? ariaValueText : value,
      style: {
        position: "absolute",
        clip: "rect(0px, 0px, 0px, 0px)",
        height: 1,
        width: 1,
        margin: -1,
        whiteSpace: "nowrap",
        border: 0,
        overflow: "hidden",
        padding: 0
      }
    }
  };
}

export default useNumberInput;