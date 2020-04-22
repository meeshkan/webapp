import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { forwardRef } from "react";
import { Transition } from "react-spring/renderprops.cjs";
import { useTheme } from "../ThemeProvider";
import { useColorMode } from "../ColorModeProvider";
import Box from "../Box";
import Flex from "../Flex";
import styled from "@emotion/styled-base";
import { systemProps } from "../Box";
import extraConfig from "../Box/config";
import { animated } from "react-spring";

var ModalHeader = function ModalHeader(props) {
  return jsx(Box, _extends({
    px: 6,
    py: 4,
    as: "header",
    position: "relative",
    fontSize: "xl",
    fontWeight: "semibold"
  }, props));
};

var ModalFooter = function ModalFooter(props) {
  return jsx(Flex, _extends({
    px: 6,
    py: 4,
    as: "footer",
    justifyContent: "flex-end"
  }, props));
};

var ModalBody = function ModalBody(props) {
  return jsx(Box, _extends({
    px: 6,
    py: 2,
    flex: "1"
  }, props));
};

var StyledDialogOverlay = styled(DialogOverlay)(systemProps, extraConfig);
var ModalOverlay = forwardRef(function (_ref, ref) {
  var _ref$bg = _ref.bg,
      bg = _ref$bg === void 0 ? "rgba(16,22,26,0.7)" : _ref$bg,
      zIndex = _ref.zIndex,
      props = _objectWithoutPropertiesLoose(_ref, ["bg", "zIndex"]);

  return jsx(StyledDialogOverlay, _extends({
    ref: ref,
    position: "fixed",
    zIndex: zIndex,
    bottom: "0",
    top: "0",
    left: "0",
    right: "0",
    overflowY: "auto",
    bg: bg
  }, props));
});
export var modalContentStyle = function modalContentStyle(_ref2) {
  var colorMode = _ref2.colorMode;
  var style = {
    light: {
      bg: "#fff",
      boxShadow: "0 7px 14px 0 rgba(0,0,0, 0.1), 0 3px 6px 0 rgba(0, 0, 0, .07)"
    },
    dark: {
      bg: "gray.700",
      boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px"
    }
  };
  return style[colorMode];
};
animated.Box = animated(Box);
var ModalContent = forwardRef(function (props, ref) {
  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var theme = useTheme();
  var styleProps = modalContentStyle({
    colorMode: colorMode,
    theme: theme
  });
  return jsx(animated.Box, _extends({
    as: DialogContent,
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    ref: ref
  }, styleProps, props));
});

var ModalTransition = function ModalTransition(_ref3) {
  var isOpen = _ref3.isOpen,
      _ref3$duration = _ref3.duration,
      duration = _ref3$duration === void 0 ? 150 : _ref3$duration,
      children = _ref3.children;
  return jsx(Transition, {
    items: isOpen,
    from: {
      opacity: 0,
      y: 10
    },
    enter: {
      opacity: 1,
      y: 0
    },
    leave: {
      opacity: 0,
      y: -10
    },
    config: {
      duration: duration
    }
  }, function (isOpen) {
    return isOpen && function (styles) {
      return children(styles);
    };
  });
};

export { ModalHeader, ModalTransition, ModalFooter, ModalBody, ModalOverlay, ModalContent };