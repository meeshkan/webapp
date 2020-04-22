"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.MenuOptionGroup = exports.MenuItemOption = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _autoId = require("@reach/auto-id");

var _react = require("react");

var _ = require(".");

var _Box = _interopRequireDefault(require("../Box"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _utils = require("../utils");

var _styles = require("./styles");

/** @jsx jsx */
var MenuItemOption = (0, _react.forwardRef)(function (_ref, ref) {
  var isDisabled = _ref.isDisabled,
      children = _ref.children,
      onClick = _ref.onClick,
      type = _ref.type,
      onMouseLeave = _ref.onMouseLeave,
      onMouseEnter = _ref.onMouseEnter,
      onKeyDown = _ref.onKeyDown,
      isChecked = _ref.isChecked,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["isDisabled", "children", "onClick", "type", "onMouseLeave", "onMouseEnter", "onKeyDown", "isChecked"]);

  var _useMenuContext = (0, _.useMenuContext)(),
      focusableItems = _useMenuContext.focusableItems,
      focusAtIndex = _useMenuContext.focusAtIndex,
      closeMenu = _useMenuContext.closeMenu,
      closeOnSelect = _useMenuContext.closeOnSelect;

  var role = "menuitem" + type;

  var handleSelect = function handleSelect() {
    onClick && onClick();
    closeOnSelect && closeMenu();
  };

  var handleClick = function handleClick(event) {
    if (isDisabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    handleSelect();
  };

  var handleKeyDown = function handleKeyDown(event) {
    if (isDisabled) return;

    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      handleSelect();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  var handleMouseEnter = function handleMouseEnter(event) {
    if (isDisabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    var nextIndex = focusableItems.current.indexOf(event.currentTarget);
    focusAtIndex(nextIndex);

    if (onMouseEnter) {
      onMouseEnter(event);
    }
  };

  var handleMouseLeave = function handleMouseLeave(event) {
    focusAtIndex(-1);

    if (onMouseLeave) {
      onMouseLeave(event);
    }
  };

  var styleProps = (0, _styles.useMenuItemStyle)();
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    ref: ref,
    as: "button",
    display: "flex",
    minHeight: "32px",
    alignItems: "center",
    onClick: handleClick,
    role: role,
    tabIndex: -1,
    "aria-checked": isChecked,
    disabled: isDisabled,
    "aria-disabled": isDisabled ? "" : undefined,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onKeyDown: handleKeyDown
  }, styleProps, rest), (0, _core.jsx)(_Icon["default"], {
    name: "check",
    opacity: isChecked ? 1 : 0,
    color: "currentColor",
    size: "1em",
    ml: "1rem",
    mr: "-4px",
    "aria-hidden": true,
    "data-menuitem-icon": ""
  }), (0, _core.jsx)(_Box["default"], {
    textAlign: "left",
    as: "span",
    mx: "1rem",
    flex: "1"
  }, children));
});
exports.MenuItemOption = MenuItemOption;
MenuItemOption.displayName = "MenuItemOption";

var MenuOptionGroup = function MenuOptionGroup(_ref2) {
  var children = _ref2.children,
      _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? "radio" : _ref2$type,
      name = _ref2.name,
      title = _ref2.title,
      valueProp = _ref2.value,
      defaultValue = _ref2.defaultValue,
      onChange = _ref2.onChange,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["children", "type", "name", "title", "value", "defaultValue", "onChange"]);

  var _useState = (0, _react.useState)(defaultValue || ""),
      value = _useState[0],
      setValue = _useState[1];

  var _useRef = (0, _react.useRef)(valueProp != null),
      isControlled = _useRef.current;

  var derivedValue = isControlled ? valueProp : value;

  var handleChange = function handleChange(_value) {
    if (type === "radio") {
      !isControlled && setValue(_value);
      onChange && onChange(_value);
    }

    if (type === "checkbox") {
      var newValue = derivedValue.includes(_value) ? derivedValue.filter(function (itemValue) {
        return itemValue !== _value;
      }) : [].concat(derivedValue, [_value]);
      !isControlled && setValue(newValue);
      onChange && onChange(newValue);
    }
  };

  var fallbackName = "radio-" + (0, _autoId.useId)();
  var validChildren = (0, _utils.cleanChildren)(children);
  return (0, _core.jsx)(_.MenuGroup, (0, _extends2["default"])({
    title: title
  }, rest), validChildren.map(function (child) {
    if (type === "radio") {
      return (0, _react.cloneElement)(child, {
        type: type,
        key: child.props.value,
        onClick: function onClick(event) {
          handleChange(child.props.value);

          if (child.props.onClick) {
            child.props.onClick(event);
          }
        },
        name: name || fallbackName,
        isChecked: child.props.value === derivedValue
      });
    }

    if (type === "checkbox") {
      return (0, _react.cloneElement)(child, {
        type: type,
        key: child.props.value,
        onClick: function onClick(event) {
          handleChange(child.props.value);

          if (child.props.onClick) {
            child.props.onClick(event);
          }
        },
        isChecked: derivedValue.includes(child.props.value)
      });
    }
  }));
};

exports.MenuOptionGroup = MenuOptionGroup;