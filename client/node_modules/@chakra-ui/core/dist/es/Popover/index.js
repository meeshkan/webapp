import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { Children, cloneElement, createContext, useContext, useEffect, useRef, useState } from "react";
import Box from "../Box";
import CloseButton from "../CloseButton";
import { useColorMode } from "../ColorModeProvider";
import Popper, { PopperArrow } from "../Popper";
import usePrevious from "../usePrevious";
import { wrapEvent } from "../utils";
/**
 * Hook based idea:
 * const {referenceProps, popoverProps, arrowProps, state, actions} = usePopover(props).
 *
 * The popover must meet the AA Success Criterion
 * https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html
 * https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR39
 */

var PopoverContext = createContext();

var usePopoverContext = function usePopoverContext() {
  var context = useContext(PopoverContext);

  if (context == null) {
    throw Error("usePopoverContext must be used within <Popover/>");
  }

  return context;
}; /////////////////////////////////////////////////////////////////////


var PopoverTrigger = function PopoverTrigger(_ref) {
  var children = _ref.children;

  var _usePopoverContext = usePopoverContext(),
      referenceRef = _usePopoverContext.referenceRef,
      popoverId = _usePopoverContext.popoverId,
      onToggle = _usePopoverContext.onToggle,
      trigger = _usePopoverContext.trigger,
      onOpen = _usePopoverContext.onOpen,
      isOpen = _usePopoverContext.isOpen,
      onClose = _usePopoverContext.onClose,
      isHoveringRef = _usePopoverContext.isHoveringRef;

  var child = Children.only(children);
  var eventHandlers = {};

  if (trigger === "click") {
    eventHandlers = {
      onClick: wrapEvent(child.props.onClick, onToggle)
    };
  }

  var openTimeout = useRef(null);

  if (trigger === "hover") {
    eventHandlers = {
      onFocus: wrapEvent(child.props.onFocus, onOpen),
      onKeyDown: wrapEvent(child.props.onKeyDown, function (event) {
        if (event.key === "Escape") {
          setTimeout(onClose, 300);
        }
      }),
      onBlur: wrapEvent(child.props.onBlur, onClose),
      onMouseEnter: wrapEvent(child.props.onMouseEnter, function () {
        isHoveringRef.current = true;
        openTimeout.current = setTimeout(onOpen, 300);
      }),
      onMouseLeave: wrapEvent(child.props.onMouseLeave, function () {
        isHoveringRef.current = false;

        if (openTimeout.current) {
          clearTimeout(openTimeout.current);
          openTimeout.current = null;
        }

        setTimeout(function () {
          if (isHoveringRef.current === false) {
            onClose();
          }
        }, 300);
      })
    };
  }

  return cloneElement(child, _objectSpread({
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": popoverId,
    ref: referenceRef
  }, eventHandlers));
}; /////////////////////////////////////////////////////////////////////


var PopoverContent = function PopoverContent(_ref2) {
  var onKeyDown = _ref2.onKeyDown,
      onBlurProp = _ref2.onBlur,
      onMouseLeave = _ref2.onMouseLeave,
      onMouseEnter = _ref2.onMouseEnter,
      onFocus = _ref2.onFocus,
      _ref2$gutter = _ref2.gutter,
      gutter = _ref2$gutter === void 0 ? 4 : _ref2$gutter,
      ariaLabel = _ref2["aria-label"],
      props = _objectWithoutPropertiesLoose(_ref2, ["onKeyDown", "onBlur", "onMouseLeave", "onMouseEnter", "onFocus", "gutter", "aria-label"]);

  var _usePopoverContext2 = usePopoverContext(),
      popoverRef = _usePopoverContext2.popoverRef,
      referenceRef = _usePopoverContext2.referenceRef,
      placement = _usePopoverContext2.placement,
      popoverId = _usePopoverContext2.popoverId,
      isOpen = _usePopoverContext2.isOpen,
      onBlur = _usePopoverContext2.onBlur,
      closeOnEsc = _usePopoverContext2.closeOnEsc,
      onClose = _usePopoverContext2.onClose,
      isHoveringRef = _usePopoverContext2.isHoveringRef,
      trigger = _usePopoverContext2.trigger,
      headerId = _usePopoverContext2.headerId,
      bodyId = _usePopoverContext2.bodyId,
      usePortal = _usePopoverContext2.usePortal;

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var bg = colorMode === "light" ? "white" : "gray.700";
  var eventHandlers = {};
  var roleProps = {};

  if (trigger === "click") {
    eventHandlers = {
      onBlur: wrapEvent(onBlurProp, onBlur)
    };
    roleProps = {
      role: "dialog",
      "aria-modal": "false"
    };
  }

  if (trigger === "hover") {
    eventHandlers = {
      onMouseEnter: wrapEvent(onMouseEnter, function () {
        isHoveringRef.current = true;
      }),
      onMouseLeave: wrapEvent(onMouseLeave, function () {
        isHoveringRef.current = false;
        setTimeout(onClose, 300);
      })
    };
    roleProps = {
      role: "tooltip"
    };
  }

  eventHandlers = _objectSpread({}, eventHandlers, {
    onKeyDown: wrapEvent(onKeyDown, function (event) {
      if (event.key === "Escape" && closeOnEsc) {
        onClose && onClose();
      }
    })
  });
  return jsx(Popper, _extends({
    as: "section",
    usePortal: usePortal,
    isOpen: isOpen,
    placement: placement,
    "aria-label": ariaLabel,
    anchorEl: referenceRef.current,
    ref: popoverRef,
    bg: bg,
    id: popoverId,
    "aria-hidden": !isOpen,
    tabIndex: "-1",
    borderWidth: "1px",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    rounded: "md",
    shadow: "sm",
    maxWidth: "xs",
    modifiers: {
      offset: {
        enabled: true,
        offset: "0, " + gutter
      }
    },
    _focus: {
      outline: 0,
      shadow: "outline"
    },
    "aria-labelledby": headerId,
    "aria-describedby": bodyId
  }, roleProps, eventHandlers, props));
}; /////////////////////////////////////////////////////////////////////


var Popover = function Popover(_ref3) {
  var id = _ref3.id,
      isOpenProp = _ref3.isOpen,
      initialFocusRef = _ref3.initialFocusRef,
      defaultIsOpen = _ref3.defaultIsOpen,
      _ref3$usePortal = _ref3.usePortal,
      usePortal = _ref3$usePortal === void 0 ? false : _ref3$usePortal,
      _ref3$returnFocusOnCl = _ref3.returnFocusOnClose,
      returnFocusOnClose = _ref3$returnFocusOnCl === void 0 ? true : _ref3$returnFocusOnCl,
      _ref3$trigger = _ref3.trigger,
      trigger = _ref3$trigger === void 0 ? "click" : _ref3$trigger,
      placement = _ref3.placement,
      children = _ref3.children,
      _ref3$closeOnBlur = _ref3.closeOnBlur,
      closeOnBlur = _ref3$closeOnBlur === void 0 ? true : _ref3$closeOnBlur,
      _ref3$closeOnEsc = _ref3.closeOnEsc,
      closeOnEsc = _ref3$closeOnEsc === void 0 ? true : _ref3$closeOnEsc,
      onOpenProp = _ref3.onOpen,
      onCloseProp = _ref3.onClose;

  var _useState = useState(defaultIsOpen || false),
      isOpen = _useState[0],
      setIsOpen = _useState[1];

  var _useRef = useRef(isOpenProp != null),
      isControlled = _useRef.current;

  var isHoveringRef = useRef();
  var referenceRef = useRef();
  var popoverRef = useRef();

  var _isOpen = isControlled ? isOpenProp : isOpen;

  var onToggle = function onToggle() {
    if (!isControlled) {
      setIsOpen(!_isOpen);
    }

    if (!_isOpen === true) {
      onOpenProp && onOpenProp();
    } else {
      onCloseProp && onCloseProp();
    }
  };

  var onOpen = function onOpen() {
    if (!isControlled) {
      setIsOpen(true);
    }

    if (onOpenProp) {
      onOpenProp();
    }
  };

  var onClose = function onClose() {
    if (!isControlled) {
      setIsOpen(false);
    }

    if (onCloseProp) {
      onCloseProp();
    }
  };

  var handleBlur = function handleBlur(event) {
    if (_isOpen && closeOnBlur && popoverRef.current && referenceRef.current && !popoverRef.current.contains(event.relatedTarget) && !referenceRef.current.contains(event.relatedTarget)) {
      onClose();
    }
  }; // A unique fallback id in case the id prop wasn't passed


  var fallbackId = "popover-" + useId();
  var popoverId = id || fallbackId;
  var headerId = popoverId + "-header";
  var bodyId = popoverId + "-body";
  var prevIsOpen = usePrevious(_isOpen);
  useEffect(function () {
    if (_isOpen && trigger === "click") {
      requestAnimationFrame(function () {
        if (initialFocusRef && initialFocusRef.current) {
          initialFocusRef.current.focus();
        } else {
          if (popoverRef.current) {
            popoverRef.current.focus();
          }
        }
      });
    }

    if (!_isOpen && prevIsOpen && trigger === "click" && returnFocusOnClose) {
      if (referenceRef.current) {
        referenceRef.current.focus();
      }
    }
  }, [_isOpen, popoverRef, initialFocusRef, trigger, referenceRef, prevIsOpen, returnFocusOnClose]);
  var context = {
    popoverRef: popoverRef,
    placement: placement,
    referenceRef: referenceRef,
    headerId: headerId,
    bodyId: bodyId,
    popoverId: popoverId,
    onOpen: onOpen,
    onClose: onClose,
    onToggle: onToggle,
    trigger: trigger,
    isOpen: _isOpen,
    onBlur: handleBlur,
    closeOnEsc: closeOnEsc,
    initialFocusRef: initialFocusRef,
    isHoveringRef: isHoveringRef,
    usePortal: usePortal
  };
  return jsx(PopoverContext.Provider, {
    value: context
  }, typeof children === "function" ? children({
    isOpen: _isOpen,
    onClose: onClose
  }) : children);
}; /////////////////////////////////////////////////////////////////////


var PopoverHeader = function PopoverHeader(props) {
  var _usePopoverContext3 = usePopoverContext(),
      headerId = _usePopoverContext3.headerId;

  return jsx(Box, _extends({
    as: "header",
    id: headerId,
    px: 3,
    py: 2,
    borderBottomWidth: "1px"
  }, props));
}; /////////////////////////////////////////////////////////////////////


var PopoverFooter = function PopoverFooter(props) {
  return jsx(Box, _extends({
    as: "footer",
    px: 3,
    py: 2,
    borderTopWidth: "1px"
  }, props));
}; /////////////////////////////////////////////////////////////////////


var PopoverBody = function PopoverBody(props) {
  var _usePopoverContext4 = usePopoverContext(),
      bodyId = _usePopoverContext4.bodyId;

  return jsx(Box, _extends({
    id: bodyId,
    flex: "1",
    px: 3,
    py: 2
  }, props));
}; /////////////////////////////////////////////////////////////////////


var PopoverArrow = function PopoverArrow(props) {
  return jsx(PopperArrow, props);
}; /////////////////////////////////////////////////////////////////////


var PopoverCloseButton = function PopoverCloseButton(_ref4) {
  var onClick = _ref4.onClick,
      props = _objectWithoutPropertiesLoose(_ref4, ["onClick"]);

  var _usePopoverContext5 = usePopoverContext(),
      onClose = _usePopoverContext5.onClose;

  return jsx(CloseButton, _extends({
    size: "sm",
    onClick: wrapEvent(onClick, onClose),
    "aria-label": "Close",
    pos: "absolute",
    rounded: "md",
    top: 1,
    right: 2,
    p: 2
  }, props));
}; /////////////////////////////////////////////////////////////////////


export { PopoverHeader, PopoverFooter, PopoverBody, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton };