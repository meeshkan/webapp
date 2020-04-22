"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.AccordionPanel = exports.AccordionHeader = exports.AccordionIcon = exports.AccordionItem = exports.Accordion = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _autoId = require("@reach/auto-id");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _Collapse = _interopRequireDefault(require("../Collapse"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _utils = require("../utils");

/** @jsx jsx */
var Accordion = function Accordion(_ref) {
  var allowMultiple = _ref.allowMultiple,
      allowToggle = _ref.allowToggle,
      index = _ref.index,
      defaultIndex = _ref.defaultIndex,
      _onChange = _ref.onChange,
      children = _ref.children,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["allowMultiple", "allowToggle", "index", "defaultIndex", "onChange", "children"]);

  var initializeState = function initializeState() {
    if (allowMultiple) {
      return defaultIndex || [];
    } else {
      return defaultIndex || 0;
    }
  };

  var getExpandCondition = function getExpandCondition(index, itemIndex) {
    if (Array.isArray(index)) {
      return index.includes(itemIndex);
    }

    return index === itemIndex;
  };

  var _useState = (0, _react.useState)(initializeState),
      expandedIndex = _useState[0],
      setExpandedIndex = _useState[1];

  var _useRef = (0, _react.useRef)(index != null),
      isControlled = _useRef.current;

  var _index = isControlled ? index : expandedIndex;

  var validChildren = (0, _utils.cleanChildren)(children);
  var clones = validChildren.map(function (child, childIndex) {
    return (0, _react.cloneElement)(child, {
      isOpen: getExpandCondition(_index, childIndex),
      onChange: function onChange(isExpanded) {
        if (allowMultiple) {
          if (isExpanded) {
            var newIndexes = [].concat(_index, [childIndex]);
            !isControlled && setExpandedIndex(newIndexes);
            _onChange && _onChange(newIndexes);
          } else {
            var _newIndexes = _index.filter(function (itemIndex) {
              return itemIndex !== childIndex;
            });

            !isControlled && setExpandedIndex(_newIndexes);
            _onChange && _onChange(_newIndexes);
          }
        } else {
          if (isExpanded) {
            !isControlled && setExpandedIndex(childIndex);
            _onChange && _onChange(childIndex);
          } else {
            if (allowToggle) {
              !isControlled && setExpandedIndex(null);
              _onChange && _onChange(null);
            }
          }
        }
      }
    });
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    "data-accordion": ""
  }, rest), clones);
};

exports.Accordion = Accordion;
var AccordionItemContext = (0, _react.createContext)();

var useAccordionItemContext = function useAccordionItemContext() {
  return (0, _react.useContext)(AccordionItemContext);
};

var AccordionItem = (0, _react.forwardRef)(function (_ref2, ref) {
  var isOpen = _ref2.isOpen,
      defaultIsOpen = _ref2.defaultIsOpen,
      id = _ref2.id,
      isDisabled = _ref2.isDisabled,
      onChange = _ref2.onChange,
      children = _ref2.children,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["isOpen", "defaultIsOpen", "id", "isDisabled", "onChange", "children"]);

  var _useState2 = (0, _react.useState)(defaultIsOpen || false),
      isExpanded = _useState2[0],
      setIsExpanded = _useState2[1];

  var _useRef2 = (0, _react.useRef)(isOpen != null),
      isControlled = _useRef2.current;

  var _isExpanded = isControlled ? isOpen : isExpanded;

  var onToggle = function onToggle() {
    onChange && onChange(!_isExpanded);
    !isControlled && setIsExpanded(!isExpanded);
  };

  var uuid = (0, _autoId.useId)();
  var uniqueId = id || uuid;
  var headerId = "accordion-header-" + uniqueId;
  var panelId = "accordion-panel-" + uniqueId;
  return (0, _core.jsx)(AccordionItemContext.Provider, {
    value: {
      isExpanded: _isExpanded,
      isDisabled: isDisabled,
      headerId: headerId,
      panelId: panelId,
      onToggle: onToggle
    }
  }, (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    borderTopWidth: "1px",
    _last: {
      borderBottomWidth: "1px"
    },
    "data-accordion-item": "",
    ref: ref
  }, rest), typeof children === "function" ? children({
    isExpanded: _isExpanded,
    isDisabled: isDisabled
  }) : children));
});
exports.AccordionItem = AccordionItem;
AccordionItem.displayName = "AccordionItem"; /////////////////////////////////////////////////////////////

var AccordionHeader = (0, _react.forwardRef)(function (_ref3, ref) {
  var _onClick = _ref3.onClick,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["onClick"]);

  var _useAccordionItemCont = useAccordionItemContext(),
      isExpanded = _useAccordionItemCont.isExpanded,
      panelId = _useAccordionItemCont.panelId,
      headerId = _useAccordionItemCont.headerId,
      isDisabled = _useAccordionItemCont.isDisabled,
      onToggle = _useAccordionItemCont.onToggle;

  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    ref: ref,
    display: "flex",
    alignItems: "center",
    width: "100%",
    transition: "all 0.2s",
    _focus: {
      boxShadow: "outline"
    },
    _hover: {
      bg: "blackAlpha.50"
    },
    _disabled: {
      opacity: "0.4",
      cursor: "not-allowed"
    },
    as: "button",
    type: "button",
    outline: "0",
    disabled: isDisabled,
    "aria-disabled": isDisabled,
    "aria-expanded": isExpanded,
    onClick: function onClick(event) {
      onToggle();

      if (_onClick) {
        _onClick(event);
      }
    },
    id: headerId,
    "aria-controls": panelId,
    px: 4,
    py: 2
  }, props));
});
exports.AccordionHeader = AccordionHeader;
AccordionHeader.displayName = "AccordionHeader"; /////////////////////////////////////////////////////////////

var AccordionPanel = (0, _react.forwardRef)(function (props, ref) {
  var _useAccordionItemCont2 = useAccordionItemContext(),
      isExpanded = _useAccordionItemCont2.isExpanded,
      panelId = _useAccordionItemCont2.panelId,
      headerId = _useAccordionItemCont2.headerId;

  return (0, _core.jsx)(_Collapse["default"], (0, _extends2["default"])({
    ref: ref,
    "data-accordion-panel": "",
    role: "region",
    id: panelId,
    "aria-labelledby": headerId,
    "aria-hidden": !isExpanded,
    isOpen: isExpanded,
    pt: 2,
    px: 4,
    pb: 5
  }, props));
});
exports.AccordionPanel = AccordionPanel;
AccordionPanel.displayName = "AccordionPanel"; /////////////////////////////////////////////////////////////

var AccordionIcon = function AccordionIcon(props) {
  var _useAccordionItemCont3 = useAccordionItemContext(),
      isExpanded = _useAccordionItemCont3.isExpanded,
      isDisabled = _useAccordionItemCont3.isDisabled;

  return (0, _core.jsx)(_Icon["default"], (0, _extends2["default"])({
    "aria-hidden": true,
    focusable: "false",
    size: "1.25em",
    name: "chevron-down",
    opacity: isDisabled ? 0.4 : 1,
    transform: isExpanded ? "rotate(-180deg)" : null,
    transition: "transform 0.2s",
    transformOrigin: "center"
  }, props));
};

exports.AccordionIcon = AccordionIcon;