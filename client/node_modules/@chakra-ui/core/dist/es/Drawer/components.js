import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Transition } from "react-spring/renderprops.cjs";
import { ModalHeader, ModalFooter, ModalBody, ModalOverlay, ModalContent } from "../Modal";
import CloseButton from "../CloseButton";
import { useColorMode } from "../ColorModeProvider";
import { forwardRef } from "react";

var DrawerTransition = function DrawerTransition(_ref) {
  var isOpen = _ref.isOpen,
      children = _ref.children,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 200 : _ref$duration,
      placement = _ref.placement,
      isFullHeight = _ref.isFullHeight;
  var placements = {
    bottom: {
      maxWidth: "100%",
      height: isFullHeight ? "100vh" : "auto",
      bottom: 0,
      left: 0,
      right: 0
    },
    top: {
      maxWidth: "100%",
      height: isFullHeight ? "100vh" : "auto",
      top: 0,
      left: 0,
      right: 0
    },
    left: {
      height: "100vh",
      left: 0,
      top: 0
    },
    right: {
      right: 0,
      top: 0,
      height: "100vh"
    }
  };
  var transitionOptions = {
    bottom: {
      offset: "100%",
      transform: function transform(y) {
        return "translateY(" + y + ")";
      }
    },
    top: {
      offset: "-100%",
      transform: function transform(y) {
        return "translateY(" + y + ")";
      }
    },
    left: {
      offset: "-100%",
      transform: function transform(x) {
        return "translateX(" + x + ")";
      }
    },
    right: {
      offset: "100%",
      transform: function transform(x) {
        return "translateX(" + x + ")";
      }
    }
  };
  var _transitionOptions$pl = transitionOptions[placement],
      transform = _transitionOptions$pl.transform,
      offset = _transitionOptions$pl.offset;
  return jsx(Transition, {
    items: isOpen,
    from: {
      opacity: 0,
      offset: offset
    },
    enter: {
      opacity: 1,
      offset: "0%"
    },
    leave: {
      opacity: 0,
      offset: offset
    },
    config: {
      duration: duration
    }
  }, function (isOpen) {
    return isOpen && function (styles) {
      return children({
        reactSpringStyles: styles,
        transformStyle: transform(styles.offset),
        placementStyle: placements[placement]
      });
    };
  });
};

var DrawerCloseButton = forwardRef(function (_ref2, ref) {
  var onClick = _ref2.onClick,
      rest = _objectWithoutPropertiesLoose(_ref2, ["onClick"]);

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var hoverColor = {
    light: "blackAlpha.100",
    dark: "whiteAlpha.100"
  };
  var activeColor = {
    light: "blackAlpha.200",
    dark: "whiteAlpha.200"
  };
  return jsx(CloseButton, _extends({
    ref: ref,
    onClick: onClick,
    position: "fixed",
    zIndex: "1",
    top: "8px",
    right: "12px",
    _hover: {
      bg: hoverColor[colorMode]
    },
    _active: {
      bg: activeColor[colorMode]
    }
  }, rest));
});
export { DrawerTransition, DrawerCloseButton, ModalHeader as DrawerHeader, ModalFooter as DrawerFooter, ModalBody as DrawerBody, ModalOverlay as DrawerOverlay, ModalContent as DrawerContent };