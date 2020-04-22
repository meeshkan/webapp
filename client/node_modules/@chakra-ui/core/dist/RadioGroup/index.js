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
var RadioGroup = (0, _react.forwardRef)(function (_ref, ref) {
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

  var _useRef = (0, _react.useRef)(valueProp != null),
      isControlled = _useRef.current;

  var _useState = (0, _react.useState)(defaultValue || null),
      value = _useState[0],
      setValue = _useState[1];

  var _value = isControlled ? valueProp : value;

  var rootRef = (0, _react.useRef)();

  var _onChange = function _onChange(event) {
    if (!isControlled) {
      setValue(event.target.value);
    }

    if (onChange) {
      onChange(event, event.target.value);
    }
  }; // If no name is passed, we'll generate a random, unique name


  var fallbackName = "radio-" + (0, _autoId.useId)();

  var _name = name || fallbackName;

  var validChildren = (0, _utils.cleanChildren)(children);
  var clones = validChildren.map(function (child, index) {
    var isLastRadio = validChildren.length === index + 1;
    var spacingProps = isInline ? {
      mr: spacing
    } : {
      mb: spacing
    };
    return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
      key: index,
      display: isInline ? "inline-block" : "block"
    }, !isLastRadio && spacingProps), (0, _react.cloneElement)(child, {
      size: child.props.size || size,
      variantColor: child.props.variantColor || variantColor,
      name: _name,
      onChange: _onChange,
      isChecked: child.props.value === _value
    }));
  }); // Calling focus() on the radiogroup should focus on the selected option or first enabled option

  (0, _react.useImperativeHandle)(ref, function () {
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
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: rootRef,
    role: "radiogroup"
  }, rest), clones);
});
RadioGroup.displayName = "RadioGroup";
var _default = RadioGroup;
exports["default"] = _default;