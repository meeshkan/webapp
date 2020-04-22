"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _autoId = require("@reach/auto-id");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _utils = require("../utils");

/** @jsx jsx */
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
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["onChange", "name", "variantColor", "size", "defaultValue", "isInline", "value", "spacing", "children"]);

  var _useState = (0, _react.useState)(defaultValue || []),
      values = _useState[0],
      setValues = _useState[1];

  var _useRef = (0, _react.useRef)(valueProp != null),
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


  var fallbackName = "checkbox-" + (0, _autoId.useId)();

  var _name = name || fallbackName;

  var validChildren = (0, _utils.cleanChildren)(children);
  var clones = validChildren.map(function (child, index) {
    var isLastCheckbox = validChildren.length === index + 1;
    var spacingProps = isInline ? {
      mr: spacing
    } : {
      mb: spacing
    };
    return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
      key: index,
      display: isInline ? "inline-block" : "block"
    }, !isLastCheckbox && spacingProps), (0, _react.cloneElement)(child, {
      size: size,
      variantColor: variantColor,
      name: _name + "-" + index,
      onChange: _onChange,
      isChecked: _values.includes(child.props.value)
    }));
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    role: "group"
  }, rest), clones);
};

var _default = CheckboxGroup;
exports["default"] = _default;