import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { cloneElement, createContext, forwardRef, useContext, useRef, useState } from "react";
import Box from "../Box";
import Flex from "../Flex";
import PseudoBox from "../PseudoBox";
import { assignRef, cleanChildren, useVariantColorWarning } from "../utils";
import { useTabListStyle, useTabStyle } from "./styles";
var Tab = forwardRef(function (props, ref) {
  var isSelected = props.isSelected,
      isDisabled = props.isDisabled,
      id = props.id,
      size = props.size,
      rest = _objectWithoutPropertiesLoose(props, ["isSelected", "isDisabled", "id", "size"]);

  var tabStyleProps = useTabStyle();
  return jsx(PseudoBox, _extends({
    ref: ref,
    role: "tab",
    tabIndex: isSelected ? 0 : -1,
    id: "tab:" + id,
    outline: "none",
    as: "button",
    type: "button",
    disabled: isDisabled,
    "aria-selected": isSelected,
    "aria-disabled": isDisabled,
    "aria-controls": "panel:" + id
  }, tabStyleProps, rest));
});
Tab.displayName = "Tab"; ////////////////////////////////////////////////////////////////////////

var TabList = forwardRef(function (props, ref) {
  var children = props.children,
      onKeyDown = props.onKeyDown,
      onClick = props.onClick,
      rest = _objectWithoutPropertiesLoose(props, ["children", "onKeyDown", "onClick"]);

  var _useContext = useContext(TabContext),
      id = _useContext.id,
      selectedIndex = _useContext.index,
      manualIndex = _useContext.manualIndex,
      onManualTabChange = _useContext.onManualTabChange,
      isManual = _useContext.isManual,
      onChangeTab = _useContext.onChangeTab,
      onFocusPanel = _useContext.onFocusPanel,
      orientation = _useContext.orientation;

  var tabListStyleProps = useTabListStyle();
  var allNodes = useRef([]);
  var validChildren = cleanChildren(children);
  var focusableIndexes = validChildren.map(function (child, index) {
    return child.props.isDisabled === true ? null : index;
  }).filter(function (index) {
    return index != null;
  });
  var enabledSelectedIndex = focusableIndexes.indexOf(selectedIndex);
  var count = focusableIndexes.length;

  var updateIndex = function updateIndex(index) {
    var childIndex = focusableIndexes[index];
    allNodes.current[childIndex].focus();
    onChangeTab && onChangeTab(childIndex);
  };

  var handleKeyDown = function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      var nextIndex = (enabledSelectedIndex + 1) % count;
      updateIndex(nextIndex);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();

      var _nextIndex = (enabledSelectedIndex - 1 + count) % count;

      updateIndex(_nextIndex);
    }

    if (event.key === "Home") {
      event.preventDefault();
      updateIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      updateIndex(count - 1);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      onFocusPanel && onFocusPanel();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  var clones = validChildren.map(function (child, index) {
    var isSelected = isManual ? index === manualIndex : index === selectedIndex;

    var handleClick = function handleClick(event) {
      // Hack for Safari. Buttons don't receive focus on click on Safari
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
      allNodes.current[index].focus();
      onManualTabChange(index);
      onChangeTab(index);

      if (child.props.onClick) {
        child.props.onClick(event);
      }
    };

    return cloneElement(child, {
      ref: function ref(node) {
        return allNodes.current[index] = node;
      },
      isSelected: isSelected,
      onClick: handleClick,
      id: id + "-" + index
    });
  });
  return jsx(Flex, _extends({
    onKeyDown: handleKeyDown,
    ref: ref,
    role: "tablist",
    "aria-orientation": orientation
  }, tabListStyleProps, rest), clones);
});
TabList.displayName = "TabList"; ////////////////////////////////////////////////////////////////////////

var TabPanel = forwardRef(function (_ref, _ref2) {
  var children = _ref.children,
      isSelected = _ref.isSelected,
      selectedPanelRef = _ref.selectedPanelRef,
      id = _ref.id,
      rest = _objectWithoutPropertiesLoose(_ref, ["children", "isSelected", "selectedPanelRef", "id"]);

  return jsx(Box, _extends({
    ref: function ref(node) {
      if (isSelected) {
        assignRef(selectedPanelRef, node);
      }

      assignRef(_ref2, node);
    },
    role: "tabpanel",
    tabIndex: -1,
    "aria-labelledby": "tab:" + id,
    hidden: !isSelected,
    id: "panel:" + id,
    outline: 0
  }, rest), children);
});
TabPanel.displayName = "TabPanel"; ////////////////////////////////////////////////////////////////////////

var TabPanels = forwardRef(function (_ref3, ref) {
  var children = _ref3.children,
      rest = _objectWithoutPropertiesLoose(_ref3, ["children"]);

  var _useContext2 = useContext(TabContext),
      selectedIndex = _useContext2.index,
      selectedPanelRef = _useContext2.selectedPanelRef,
      id = _useContext2.id,
      isManual = _useContext2.isManual,
      manualIndex = _useContext2.manualIndex;

  var validChildren = cleanChildren(children);
  var clones = validChildren.map(function (child, index) {
    return cloneElement(child, {
      isSelected: isManual ? index === manualIndex : index === selectedIndex,
      selectedPanelRef: selectedPanelRef,
      id: id + "-" + index
    });
  });
  return jsx(Box, _extends({
    tabIndex: "-1",
    ref: ref
  }, rest), clones);
});
TabPanels.displayName = "TabPanels"; ////////////////////////////////////////////////////////////////////////

export var TabContext = createContext();
var Tabs = forwardRef(function (_ref4, ref) {
  var children = _ref4.children,
      onChange = _ref4.onChange,
      controlledIndex = _ref4.index,
      defaultIndex = _ref4.defaultIndex,
      isManual = _ref4.isManual,
      _ref4$variant = _ref4.variant,
      variant = _ref4$variant === void 0 ? "line" : _ref4$variant,
      _ref4$variantColor = _ref4.variantColor,
      variantColor = _ref4$variantColor === void 0 ? "blue" : _ref4$variantColor,
      _ref4$align = _ref4.align,
      align = _ref4$align === void 0 ? "start" : _ref4$align,
      _ref4$size = _ref4.size,
      size = _ref4$size === void 0 ? "md" : _ref4$size,
      _ref4$orientation = _ref4.orientation,
      orientation = _ref4$orientation === void 0 ? "horizontal" : _ref4$orientation,
      isFitted = _ref4.isFitted,
      props = _objectWithoutPropertiesLoose(_ref4, ["children", "onChange", "index", "defaultIndex", "isManual", "variant", "variantColor", "align", "size", "orientation", "isFitted"]);

  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  useVariantColorWarning("Tabs", variantColor);

  var _useRef = useRef(controlledIndex != null),
      isControlled = _useRef.current;

  var selectedPanelRef = useRef();

  var getInitialIndex = function getInitialIndex() {
    if (!isManual) {
      return defaultIndex || 0;
    } else {
      return controlledIndex || defaultIndex || 0;
    }
  };

  var getActualIdx = function getActualIdx() {
    if (isManual) {
      return selectedIndex;
    } else {
      return isControlled ? controlledIndex : selectedIndex;
    }
  };

  var _useState = useState(getInitialIndex),
      selectedIndex = _useState[0],
      setSelectedIndex = _useState[1];

  var _useState2 = useState(controlledIndex || defaultIndex || 0),
      manualIndex = _useState2[0],
      setManualIndex = _useState2[1];

  var actualIdx = getActualIdx();
  var manualIdx = isControlled ? controlledIndex : manualIndex;

  var onChangeTab = function onChangeTab(index) {
    if (!isControlled) {
      setSelectedIndex(index);
    }

    if (isControlled && isManual) {
      setSelectedIndex(index);
    }

    if (!isManual) {
      onChange && onChange(index);
    }
  };

  var onManualTabChange = function onManualTabChange(index) {
    if (!isControlled) {
      setManualIndex(index);
    }

    if (isManual) {
      onChange && onChange(index);
    }
  };

  var onFocusPanel = function onFocusPanel() {
    if (selectedPanelRef.current) {
      selectedPanelRef.current.focus();
    }
  };

  var id = useId();
  var context = {
    id: id,
    index: actualIdx,
    manualIndex: manualIdx,
    onManualTabChange: onManualTabChange,
    isManual: isManual,
    onChangeTab: onChangeTab,
    selectedPanelRef: selectedPanelRef,
    onFocusPanel: onFocusPanel,
    color: variantColor,
    size: size,
    align: align,
    variant: variant,
    isFitted: isFitted,
    orientation: orientation
  };
  return jsx(TabContext.Provider, {
    value: context
  }, jsx(Box, _extends({
    ref: ref
  }, props), children));
});
Tabs.displayName = "Tabs";
export default Tabs;
export { TabList, Tab, TabPanel, TabPanels };