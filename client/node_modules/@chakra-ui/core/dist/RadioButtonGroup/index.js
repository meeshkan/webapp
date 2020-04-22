"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _autoId = require("@reach/auto-id");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var RadioButtonGroup = function RadioButtonGroup(_ref) {
  var name = _ref.name,
      children = _ref.children,
      defaultValue = _ref.defaultValue,
      controlledValue = _ref.value,
      onChange = _ref.onChange,
      _ref$spacing = _ref.spacing,
      spacing = _ref$spacing === void 0 ? "12px" : _ref$spacing,
      isInline = _ref.isInline,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["name", "children", "defaultValue", "value", "onChange", "spacing", "isInline"]);
  var isControlled = controlledValue != null;

  var _useState = (0, _react.useState)(defaultValue || null),
      value = _useState[0],
      setValue = _useState[1];

  var _value = isControlled ? controlledValue : value;

  var allNodes = (0, _react.useRef)([]);
  var validChildren = (0, _utils.cleanChildren)(children);
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

  var fallbackName = "radio-" + (0, _autoId.useId)();

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

    return (0, _react.cloneElement)(child, _objectSpread({
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
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    role: "radiogroup",
    onKeyDown: handleKeyDown
  }, rest), clones);
};

RadioButtonGroup.displayName = "RadioButtonGroup";
var _default = RadioButtonGroup;
exports["default"] = _default;