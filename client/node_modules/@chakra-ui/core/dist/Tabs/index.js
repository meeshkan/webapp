"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TabPanels = exports.TabPanel = exports.Tab = exports.TabList = exports["default"] = exports.TabContext = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _autoId = require("@reach/auto-id");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _Flex = _interopRequireDefault(require("../Flex"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _utils = require("../utils");

var _styles = require("./styles");

/** @jsx jsx */
var Tab = (0, _react.forwardRef)(function (props, ref) {
  var isSelected = props.isSelected,
      isDisabled = props.isDisabled,
      id = props.id,
      size = props.size,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(props, ["isSelected", "isDisabled", "id", "size"]);
  var tabStyleProps = (0, _styles.useTabStyle)();
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
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
exports.Tab = Tab;
Tab.displayName = "Tab"; ////////////////////////////////////////////////////////////////////////

var TabList = (0, _react.forwardRef)(function (props, ref) {
  var children = props.children,
      onKeyDown = props.onKeyDown,
      onClick = props.onClick,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(props, ["children", "onKeyDown", "onClick"]);

  var _useContext = (0, _react.useContext)(TabContext),
      id = _useContext.id,
      selectedIndex = _useContext.index,
      manualIndex = _useContext.manualIndex,
      onManualTabChange = _useContext.onManualTabChange,
      isManual = _useContext.isManual,
      onChangeTab = _useContext.onChangeTab,
      onFocusPanel = _useContext.onFocusPanel,
      orientation = _useContext.orientation;

  var tabListStyleProps = (0, _styles.useTabListStyle)();
  var allNodes = (0, _react.useRef)([]);
  var validChildren = (0, _utils.cleanChildren)(children);
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

    return (0, _react.cloneElement)(child, {
      ref: function ref(node) {
        return allNodes.current[index] = node;
      },
      isSelected: isSelected,
      onClick: handleClick,
      id: id + "-" + index
    });
  });
  return (0, _core.jsx)(_Flex["default"], (0, _extends2["default"])({
    onKeyDown: handleKeyDown,
    ref: ref,
    role: "tablist",
    "aria-orientation": orientation
  }, tabListStyleProps, rest), clones);
});
exports.TabList = TabList;
TabList.displayName = "TabList"; ////////////////////////////////////////////////////////////////////////

var TabPanel = (0, _react.forwardRef)(function (_ref, _ref2) {
  var children = _ref.children,
      isSelected = _ref.isSelected,
      selectedPanelRef = _ref.selectedPanelRef,
      id = _ref.id,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["children", "isSelected", "selectedPanelRef", "id"]);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: function ref(node) {
      if (isSelected) {
        (0, _utils.assignRef)(selectedPanelRef, node);
      }

      (0, _utils.assignRef)(_ref2, node);
    },
    role: "tabpanel",
    tabIndex: -1,
    "aria-labelledby": "tab:" + id,
    hidden: !isSelected,
    id: "panel:" + id,
    outline: 0
  }, rest), children);
});
exports.TabPanel = TabPanel;
TabPanel.displayName = "TabPanel"; ////////////////////////////////////////////////////////////////////////

var TabPanels = (0, _react.forwardRef)(function (_ref3, ref) {
  var children = _ref3.children,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["children"]);

  var _useContext2 = (0, _react.useContext)(TabContext),
      selectedIndex = _useContext2.index,
      selectedPanelRef = _useContext2.selectedPanelRef,
      id = _useContext2.id,
      isManual = _useContext2.isManual,
      manualIndex = _useContext2.manualIndex;

  var validChildren = (0, _utils.cleanChildren)(children);
  var clones = validChildren.map(function (child, index) {
    return (0, _react.cloneElement)(child, {
      isSelected: isManual ? index === manualIndex : index === selectedIndex,
      selectedPanelRef: selectedPanelRef,
      id: id + "-" + index
    });
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    tabIndex: "-1",
    ref: ref
  }, rest), clones);
});
exports.TabPanels = TabPanels;
TabPanels.displayName = "TabPanels"; ////////////////////////////////////////////////////////////////////////

var TabContext = (0, _react.createContext)();
exports.TabContext = TabContext;
var Tabs = (0, _react.forwardRef)(function (_ref4, ref) {
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
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref4, ["children", "onChange", "index", "defaultIndex", "isManual", "variant", "variantColor", "align", "size", "orientation", "isFitted"]);
  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  (0, _utils.useVariantColorWarning)("Tabs", variantColor);

  var _useRef = (0, _react.useRef)(controlledIndex != null),
      isControlled = _useRef.current;

  var selectedPanelRef = (0, _react.useRef)();

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

  var _useState = (0, _react.useState)(getInitialIndex),
      selectedIndex = _useState[0],
      setSelectedIndex = _useState[1];

  var _useState2 = (0, _react.useState)(controlledIndex || defaultIndex || 0),
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

  var id = (0, _autoId.useId)();
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
  return (0, _core.jsx)(TabContext.Provider, {
    value: context
  }, (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref
  }, props), children));
});
Tabs.displayName = "Tabs";
var _default = Tabs;
exports["default"] = _default;