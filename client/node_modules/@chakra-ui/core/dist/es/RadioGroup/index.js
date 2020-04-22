import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { cloneElement, forwardRef, useImperativeHandle, useRef, useState } from "react";
import Box from "../Box";
import { cleanChildren } from "../utils";
var RadioGroup = forwardRef(function (_ref, ref) {
  var onChange = _ref.onChange,
      name = _ref.name,
      variantColor = _ref.variantColor,
      size = _ref.size,
      defaultValue = _ref.defaultValue,
      isInline = _ref.isInline,
      valueProp = _ref.value,
      _ref$spacing = _ref.spacing,
      spacing = _ref$spacing === void 0 ? 2 : _ref$spacing,
      children = _ref.children,
      rest = _objectWithoutPropertiesLoose(_ref, ["onChange", "name", "variantColor", "size", "defaultValue", "isInline", "value", "spacing", "children"]);

  var _useRef = useRef(valueProp != null),
      isControlled = _useRef.current;

  var _useState = useState(defaultValue || null),
      value = _useState[0],
      setValue = _useState[1];

  var _value = isControlled ? valueProp : value;

  var rootRef = useRef();

  var _onChange = function _onChange(event) {
    if (!isControlled) {
      setValue(event.target.value);
    }

    if (onChange) {
      onChange(event, event.target.value);
    }
  }; // If no name is passed, we'll generate a random, unique name


  var fallbackName = "radio-" + useId();

  var _name = name || fallbackName;

  var validChildren = cleanChildren(children);
  var clones = validChildren.map(function (child, index) {
    var isLastRadio = validChildren.length === index + 1;
    var spacingProps = isInline ? {
      mr: spacing
    } : {
      mb: spacing
    };
    return jsx(Box, _extends({
      key: index,
      display: isInline ? "inline-block" : "block"
    }, !isLastRadio && spacingProps), cloneElement(child, {
      size: child.props.size || size,
      variantColor: child.props.variantColor || variantColor,
      name: _name,
      onChange: _onChange,
      isChecked: child.props.value === _value
    }));
  }); // Calling focus() on the radiogroup should focus on the selected option or first enabled option

  useImperativeHandle(ref, function () {
    return {
      focus: function focus() {
        var input = rootRef.current.querySelector("input:not(:disabled):checked");

        if (!input) {
          input = rootRef.current.querySelector("input:not(:disabled)");
        }

        if (input) {
          input.focus();
        }
      }
    };
  }, []);
  return jsx(Box, _extends({
    ref: rootRef,
    role: "radiogroup"
  }, rest), clones);
});
RadioGroup.displayName = "RadioGroup";
export default RadioGroup;