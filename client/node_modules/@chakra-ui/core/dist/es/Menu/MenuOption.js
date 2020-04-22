import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { cloneElement, forwardRef, useRef, useState } from "react";
import { MenuGroup, useMenuContext } from ".";
import Box from "../Box";
import Icon from "../Icon";
import PseudoBox from "../PseudoBox";
import { cleanChildren } from "../utils";
import { useMenuItemStyle } from "./styles";
export var MenuItemOption = forwardRef(function (_ref, ref) {
  var isDisabled = _ref.isDisabled,
      children = _ref.children,
      onClick = _ref.onClick,
      type = _ref.type,
      onMouseLeave = _ref.onMouseLeave,
      onMouseEnter = _ref.onMouseEnter,
      onKeyDown = _ref.onKeyDown,
      isChecked = _ref.isChecked,
      rest = _objectWithoutPropertiesLoose(_ref, ["isDisabled", "children", "onClick", "type", "onMouseLeave", "onMouseEnter", "onKeyDown", "isChecked"]);

  var _useMenuContext = useMenuContext(),
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

  var styleProps = useMenuItemStyle();
  return jsx(PseudoBox, _extends({
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
  }, styleProps, rest), jsx(Icon, {
    name: "check",
    opacity: isChecked ? 1 : 0,
    color: "currentColor",
    size: "1em",
    ml: "1rem",
    mr: "-4px",
    "aria-hidden": true,
    "data-menuitem-icon": ""
  }), jsx(Box, {
    textAlign: "left",
    as: "span",
    mx: "1rem",
    flex: "1"
  }, children));
});
MenuItemOption.displayName = "MenuItemOption";
export var MenuOptionGroup = function MenuOptionGroup(_ref2) {
  var children = _ref2.children,
      _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? "radio" : _ref2$type,
      name = _ref2.name,
      title = _ref2.title,
      valueProp = _ref2.value,
      defaultValue = _ref2.defaultValue,
      onChange = _ref2.onChange,
      rest = _objectWithoutPropertiesLoose(_ref2, ["children", "type", "name", "title", "value", "defaultValue", "onChange"]);

  var _useState = useState(defaultValue || ""),
      value = _useState[0],
      setValue = _useState[1];

  var _useRef = useRef(valueProp != null),
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

  var fallbackName = "radio-" + useId();
  var validChildren = cleanChildren(children);
  return jsx(MenuGroup, _extends({
    title: title
  }, rest), validChildren.map(function (child) {
    if (type === "radio") {
      return cloneElement(child, {
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
      return cloneElement(child, {
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