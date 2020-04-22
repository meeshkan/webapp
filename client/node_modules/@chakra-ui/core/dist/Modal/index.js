"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ModalCloseButton = exports.ModalBody = exports.ModalFooter = exports.ModalHeader = exports.ModalContent = exports.ModalOverlay = exports.Modal = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _bodyScrollLock = require("body-scroll-lock");

var _cjs = _interopRequireDefault(require("react-focus-lock/dist/cjs"));

var _utils = require("../utils");

var _Box = _interopRequireDefault(require("../Box"));

var _Portal = _interopRequireDefault(require("../Portal"));

var _CloseButton = _interopRequireDefault(require("../CloseButton"));

var _ariaHidden = require("aria-hidden");

var _autoId = require("@reach/auto-id");

var _ColorModeProvider = require("../ColorModeProvider");

var _exenv = _interopRequireDefault(require("exenv"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

////////////////////////////////////////////////////////////////////////
var canUseDOM = _exenv["default"].canUseDOM;
var ModalContext = (0, _react.createContext)({});

var useModalContext = function useModalContext() {
  return (0, _react.useContext)(ModalContext);
}; ////////////////////////////////////////////////////////////////////////


function useAriaHider(_ref) {
  var isOpen = _ref.isOpen,
      id = _ref.id,
      enableInert = _ref.enableInert,
      _ref$container = _ref.container,
      container = _ref$container === void 0 ? canUseDOM ? document.body : null : _ref$container;
  var mountRef = (0, _react.useRef)(canUseDOM ? document.getElementById(id) || document.createElement("div") : null);
  (0, _react.useEffect)(function () {
    var undoAriaHidden = null;
    var mountNode = mountRef.current;

    if (isOpen && canUseDOM) {
      mountRef.current.id = id;
      container.appendChild(mountRef.current);

      if (enableInert) {
        undoAriaHidden = (0, _ariaHidden.hideOthers)(mountNode);
      }
    }

    return function () {
      if (enableInert && undoAriaHidden != null) {
        undoAriaHidden();
      }

      if (mountNode.parentElement) {
        mountNode.parentElement.removeChild(mountNode);
      }
    };
  }, [isOpen, id, enableInert, container]);
  return mountRef;
} ////////////////////////////////////////////////////////////////////////


var Modal = function Modal(_ref2) {
  var isOpen = _ref2.isOpen,
      initialFocusRef = _ref2.initialFocusRef,
      finalFocusRef = _ref2.finalFocusRef,
      onClose = _ref2.onClose,
      _ref2$blockScrollOnMo = _ref2.blockScrollOnMount,
      blockScrollOnMount = _ref2$blockScrollOnMo === void 0 ? true : _ref2$blockScrollOnMo,
      _ref2$closeOnEsc = _ref2.closeOnEsc,
      closeOnEsc = _ref2$closeOnEsc === void 0 ? true : _ref2$closeOnEsc,
      _ref2$closeOnOverlayC = _ref2.closeOnOverlayClick,
      closeOnOverlayClick = _ref2$closeOnOverlayC === void 0 ? true : _ref2$closeOnOverlayC,
      _ref2$useInert = _ref2.useInert,
      useInert = _ref2$useInert === void 0 ? true : _ref2$useInert,
      _ref2$scrollBehavior = _ref2.scrollBehavior,
      scrollBehavior = _ref2$scrollBehavior === void 0 ? "outside" : _ref2$scrollBehavior,
      isCentered = _ref2.isCentered,
      _ref2$addAriaLabels = _ref2.addAriaLabels,
      addAriaLabels = _ref2$addAriaLabels === void 0 ? true : _ref2$addAriaLabels,
      preserveScrollBarGap = _ref2.preserveScrollBarGap,
      _ref2$formatIds = _ref2.formatIds,
      formatIds = _ref2$formatIds === void 0 ? function (id) {
    return {
      content: "modal-" + id,
      header: "modal-" + id + "-header",
      body: "modal-" + id + "-body"
    };
  } : _ref2$formatIds,
      container = _ref2.container,
      _ref2$returnFocusOnCl = _ref2.returnFocusOnClose,
      returnFocusOnClose = _ref2$returnFocusOnCl === void 0 ? true : _ref2$returnFocusOnCl,
      children = _ref2.children,
      id = _ref2.id,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? "md" : _ref2$size;
  var contentRef = (0, _react.useRef)(null);
  var uuid = (0, _autoId.useId)();

  var _id = id || uuid;

  var contentId = formatIds(_id)["content"];
  var headerId = formatIds(_id)["header"];
  var bodyId = formatIds(_id)["body"];
  var portalId = "chakra-portal-" + _id;
  var addAriaLabelledby = false;
  var addAriaDescribedby = false;

  if (typeof addAriaLabels === "object") {
    addAriaLabelledby = addAriaLabels["header"];
    addAriaDescribedby = addAriaLabels["body"];
  }

  if (typeof addAriaLabels === "boolean") {
    addAriaLabelledby = addAriaLabels;
    addAriaDescribedby = addAriaLabels;
  }

  (0, _react.useEffect)(function () {
    var dialogNode = contentRef.current;

    if (isOpen && blockScrollOnMount) {
      (0, _bodyScrollLock.disableBodyScroll)(dialogNode, {
        reserveScrollBarGap: preserveScrollBarGap
      });
    }

    return function () {
      return (0, _bodyScrollLock.enableBodyScroll)(dialogNode);
    };
  }, [isOpen, blockScrollOnMount, preserveScrollBarGap]);
  (0, _react.useEffect)(function () {
    var func = function func(event) {
      if (event.key === "Escape" && closeOnEsc) {
        onClose(event, "pressedEscape");
      }
    };

    if (isOpen && !closeOnOverlayClick) {
      canUseDOM && document.addEventListener("keydown", func);
    }

    return function () {
      canUseDOM && document.removeEventListener("keydown", func);
    };
  }, [isOpen, onClose, closeOnOverlayClick, closeOnEsc]);
  var mountRef = useAriaHider({
    isOpen: isOpen,
    id: portalId,
    enableInert: useInert,
    container: container
  });
  var context = {
    isOpen: isOpen,
    initialFocusRef: initialFocusRef,
    onClose: onClose,
    blockScrollOnMount: blockScrollOnMount,
    closeOnEsc: closeOnEsc,
    closeOnOverlayClick: closeOnOverlayClick,
    returnFocusOnClose: returnFocusOnClose,
    contentRef: contentRef,
    scrollBehavior: scrollBehavior,
    isCentered: isCentered,
    headerId: headerId,
    bodyId: bodyId,
    contentId: contentId,
    size: size,
    addAriaLabelledby: addAriaLabelledby,
    addAriaDescribedby: addAriaDescribedby
  };
  var activateFocusLock = (0, _react.useCallback)(function () {
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus();
    } else {
      if (contentRef.current) {
        var focusables = (0, _utils.getFocusables)(contentRef.current);

        if (focusables.length === 0) {
          contentRef.current.focus();
        }
      }
    }
  }, [initialFocusRef]);
  var deactivateFocusLock = (0, _react.useCallback)(function () {
    if (finalFocusRef && finalFocusRef.current) {
      finalFocusRef.current.focus();
    }
  }, [finalFocusRef]);
  if (!isOpen) return null;
  return _react["default"].createElement(ModalContext.Provider, {
    value: context
  }, _react["default"].createElement(_Portal["default"], {
    container: mountRef.current
  }, _react["default"].createElement(_cjs["default"], {
    returnFocus: returnFocusOnClose && !finalFocusRef,
    onActivation: activateFocusLock,
    onDeactivation: deactivateFocusLock
  }, children)));
}; ////////////////////////////////////////////////////////////////////////


exports.Modal = Modal;

var ModalOverlay = _react["default"].forwardRef(function (props, ref) {
  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    pos: "fixed",
    bg: "rgba(0,0,0,0.4)",
    left: "0",
    top: "0",
    w: "100vw",
    h: "100vh",
    ref: ref,
    zIndex: "overlay",
    onClick: (0, _utils.wrapEvent)(props.onClick, function (event) {
      event.stopPropagation();
    })
  }, props));
});

exports.ModalOverlay = ModalOverlay;
ModalOverlay.displayName = "ModalOverlay"; ////////////////////////////////////////////////////////////////////////

var ModalContent = _react["default"].forwardRef(function (_ref3, ref) {
  var onClick = _ref3.onClick,
      children = _ref3.children,
      _ref3$zIndex = _ref3.zIndex,
      zIndex = _ref3$zIndex === void 0 ? "modal" : _ref3$zIndex,
      noStyles = _ref3.noStyles,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["onClick", "children", "zIndex", "noStyles"]);

  var _useModalContext = useModalContext(),
      contentRef = _useModalContext.contentRef,
      onClose = _useModalContext.onClose,
      isCentered = _useModalContext.isCentered,
      bodyId = _useModalContext.bodyId,
      headerId = _useModalContext.headerId,
      contentId = _useModalContext.contentId,
      size = _useModalContext.size,
      closeOnEsc = _useModalContext.closeOnEsc,
      addAriaLabelledby = _useModalContext.addAriaLabelledby,
      addAriaDescribedby = _useModalContext.addAriaDescribedby,
      scrollBehavior = _useModalContext.scrollBehavior,
      closeOnOverlayClick = _useModalContext.closeOnOverlayClick;

  var _contentRef = (0, _utils.useForkRef)(ref, contentRef);

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var colorModeStyles = {
    light: {
      bg: "white",
      shadow: "0 7px 14px 0 rgba(0,0,0, 0.1), 0 3px 6px 0 rgba(0, 0, 0, .07)"
    },
    dark: {
      bg: "gray.700",
      shadow: "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px"
    }
  };
  var boxStyleProps = colorModeStyles[colorMode];
  var wrapperStyle = {};
  var contentStyle = {};

  if (isCentered) {
    wrapperStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
  } else {
    contentStyle = {
      top: "3.75rem",
      mx: "auto"
    };
  }

  if (scrollBehavior === "inside") {
    wrapperStyle = _objectSpread({}, wrapperStyle, {
      maxHeight: "calc(100vh - 7.5rem)",
      overflow: "hidden",
      top: "3.75rem"
    });
    contentStyle = _objectSpread({}, contentStyle, {
      height: "100%",
      top: 0
    });
  }

  if (scrollBehavior === "outside") {
    wrapperStyle = _objectSpread({}, wrapperStyle, {
      overflowY: "auto",
      overflowX: "hidden"
    });
    contentStyle = _objectSpread({}, contentStyle, {
      my: "3.75rem",
      top: 0
    });
  }

  if (noStyles) {
    wrapperStyle = {};
    contentStyle = {};
  }

  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    pos: "fixed",
    left: "0",
    top: "0",
    w: "100%",
    h: "100%",
    zIndex: zIndex,
    onClick: function onClick(event) {
      event.stopPropagation();

      if (closeOnOverlayClick) {
        onClose(event, "clickedOverlay");
      }
    },
    onKeyDown: function onKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();

        if (closeOnEsc) {
          onClose(event, "pressedEscape");
        }
      }
    }
  }, wrapperStyle), _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    ref: _contentRef,
    as: "section",
    role: "dialog",
    "aria-modal": "true",
    tabIndex: -1,
    outline: 0,
    maxWidth: size,
    w: "100%",
    id: contentId
  }, addAriaDescribedby && {
    "aria-describedby": bodyId
  }, addAriaLabelledby && {
    "aria-labelledby": headerId
  }, {
    pos: "relative",
    d: "flex",
    flexDir: "column",
    zIndex: zIndex,
    onClick: (0, _utils.wrapEvent)(onClick, function (event) {
      return event.stopPropagation();
    })
  }, boxStyleProps, contentStyle, props), children));
});

exports.ModalContent = ModalContent;
ModalContent.displayName = "ModalContent"; ////////////////////////////////////////////////////////////////////////

var ModalHeader = (0, _react.forwardRef)(function (props, ref) {
  var _useModalContext2 = useModalContext(),
      headerId = _useModalContext2.headerId;

  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    px: 6,
    py: 4,
    id: headerId,
    as: "header",
    position: "relative",
    fontSize: "xl",
    fontWeight: "semibold"
  }, props));
});
exports.ModalHeader = ModalHeader;
ModalHeader.displayName = "ModalHeader"; ////////////////////////////////////////////////////////////////////////

var ModalFooter = (0, _react.forwardRef)(function (props, ref) {
  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    display: "flex",
    justifyContent: "flex-end",
    ref: ref,
    px: 6,
    py: 4,
    as: "footer"
  }, props));
});
exports.ModalFooter = ModalFooter;
ModalFooter.displayName = "ModalFooter"; ////////////////////////////////////////////////////////////////////////

var ModalBody = (0, _react.forwardRef)(function (props, ref) {
  var _useModalContext3 = useModalContext(),
      bodyId = _useModalContext3.bodyId,
      scrollBehavior = _useModalContext3.scrollBehavior;

  var style = {};

  if (scrollBehavior === "inside") {
    style = {
      overflowY: "auto"
    };
  }

  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    id: bodyId,
    px: 6,
    py: 2,
    flex: "1"
  }, style, props));
});
exports.ModalBody = ModalBody;
ModalBody.displayName = "ModalBody"; ////////////////////////////////////////////////////////////////////////

var ModalCloseButton = (0, _react.forwardRef)(function (props, ref) {
  var _useModalContext4 = useModalContext(),
      onClose = _useModalContext4.onClose;

  return _react["default"].createElement(_CloseButton["default"], (0, _extends2["default"])({
    ref: ref,
    onClick: onClose,
    position: "absolute",
    top: "8px",
    right: "12px"
  }, props));
});
exports.ModalCloseButton = ModalCloseButton;
ModalCloseButton.displayName = "ModalCloseButton"; ////////////////////////////////////////////////////////////////////////