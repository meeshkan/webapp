import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { cloneElement, useRef, useState } from "react";
import Box from "../Box";
import { cleanChildren } from "../utils";

var RadioButtonGroup = function RadioButtonGroup(_ref) {
  var name = _ref.name,
      children = _ref.children,
      defaultValue = _ref.defaultValue,
      controlledValue = _ref.value,
      onChange = _ref.onChange,
      _ref$spacing = _ref.spacing,
      spacing = _ref$spacing === void 0 ? "12px" : _ref$spacing,
      isInline = _ref.isInline,
      rest = _objectWithoutPropertiesLoose(_ref, ["name", "children", "defaultValue", "value", "onChange", "spacing", "isInline"]);

  var isControlled = controlledValue != null;

  var _useState = useState(defaultValue || null),
      value = _useState[0],
      setValue = _useState[1];

  var _value = isControlled ? controlledValue : value;

  var allNodes = useRef([]);
  var validChildren = cleanChildren(children);
  var focusableValues = validChildren.map(function (child) {
    return child.props.isDisabled === true ? null : child.props.value;
  }).filter(function (val) {
    return val != null;
  });
  var allValues = validChildren.map(function (child) {
    return child.props.value;
  });

  var updateIndex = function updateIndex(index) {
    var childValue = focusableValues[index];

    var _index = allValues.indexOf(childValue);

    allNodes.current[_index].focus();

    !isControlled && setValue(childValue);
    onChange && onChange(childValue);
  };

  var handleKeyDown = function handleKeyDown(event) {
    if (event.key === "Tab") {
      return;
    } // Disable page scrolling while navigating with keys


    event.preventDefault();
    var count = focusableValues.length;
    var enabledCheckedIndex = focusableValues.indexOf(_value);

    if (enabledCheckedIndex === -1) {
      enabledCheckedIndex = 0;
    }

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        {
          var nextIndex = (enabledCheckedIndex + 1) % count;
          updateIndex(nextIndex);
          break;
        }

      case "ArrowLeft":
      case "ArrowUp":
        {
          var _nextIndex = (enabledCheckedIndex - 1 + count) % count;

          updateIndex(_nextIndex);
          break;
        }

      default:
        break;
    }
  };

  var fallbackName = "radio-" + useId();

  var _name = name || fallbackName;

  var clones = validChildren.map(function (child, index) {
    var isLastChild = validChildren.length === index + 1;
    var isFirstChild = index === 0;
    var spacingProps = isInline ? {
      mr: spacing
    } : {
      mb: spacing
    };
    var isChecked = child.props.value === _value;

    var handleClick = function handleClick() {
      !isControlled && setValue(child.props.value);
      onChange && onChange(child.props.value);
    };

    var getTabIndex = function getTabIndex() {
      // If a RadioGroup has no radio selected the first enabled radio should be focusable
      if (_value == null) {
        return isFirstChild ? 0 : -1;
      } else {
        return isChecked ? 0 : -1;
      }
    };

    return cloneElement(child, _objectSpread({
      key: index,
      ref: function ref(node) {
        return allNodes.current[index] = node;
      },
      name: _name,
      onClick: handleClick,
      tabIndex: getTabIndex(),
      isChecked: isChecked
    }, !isLastChild && spacingProps));
  });
  return jsx(Box, _extends({
    role: "radiogroup",
    onKeyDown: handleKeyDown
  }, rest), clones);
};

RadioButtonGroup.displayName = "RadioButtonGroup";
export default RadioButtonGroup;