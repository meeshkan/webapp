import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { cloneElement, useRef, useState } from "react";
import Box from "../Box";
import { cleanChildren } from "../utils";

var CheckboxGroup = function CheckboxGroup(_ref) {
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

  var _useState = useState(defaultValue || []),
      values = _useState[0],
      setValues = _useState[1];

  var _useRef = useRef(valueProp != null),
      isControlled = _useRef.current;

  var _values = isControlled ? valueProp : values;

  var _onChange = function _onChange(event) {
    var _event$target = event.target,
        checked = _event$target.checked,
        value = _event$target.value;
    var newValues;

    if (checked) {
      newValues = [].concat(_values, [value]);
    } else {
      newValues = _values.filter(function (val) {
        return val !== value;
      });
    }

    !isControlled && setValues(newValues);
    onChange && onChange(newValues);
  }; // If no name is passed, we'll generate a random, unique name


  var fallbackName = "checkbox-" + useId();

  var _name = name || fallbackName;

  var validChildren = cleanChildren(children);
  var clones = validChildren.map(function (child, index) {
    var isLastCheckbox = validChildren.length === index + 1;
    var spacingProps = isInline ? {
      mr: spacing
    } : {
      mb: spacing
    };
    return jsx(Box, _extends({
      key: index,
      display: isInline ? "inline-block" : "block"
    }, !isLastCheckbox && spacingProps), cloneElement(child, {
      size: size,
      variantColor: variantColor,
      name: _name + "-" + index,
      onChange: _onChange,
      isChecked: _values.includes(child.props.value)
    }));
  });
  return jsx(Box, _extends({
    role: "group"
  }, rest), clones);
};

export default CheckboxGroup;