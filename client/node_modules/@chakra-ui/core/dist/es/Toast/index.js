import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import toaster from "toasted-notes";
import { useCallback } from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "../Alert";
import ThemeProvider, { useTheme } from "../ThemeProvider";
import Box from "../Box";
import CloseButton from "../CloseButton";

var Toast = function Toast(_ref) {
  var status = _ref.status,
      variant = _ref.variant,
      id = _ref.id,
      title = _ref.title,
      isClosable = _ref.isClosable,
      onClose = _ref.onClose,
      description = _ref.description,
      props = _objectWithoutPropertiesLoose(_ref, ["status", "variant", "id", "title", "isClosable", "onClose", "description"]);

  return jsx(Alert, _extends({
    status: status,
    variant: variant,
    id: id,
    textAlign: "left",
    boxShadow: "lg",
    rounded: "md",
    alignItems: "start",
    m: 2,
    pr: 8
  }, props), jsx(AlertIcon, null), jsx(Box, {
    flex: "1"
  }, title && jsx(AlertTitle, null, title), description && jsx(AlertDescription, null, description)), isClosable && jsx(CloseButton, {
    size: "sm",
    onClick: onClose,
    position: "absolute",
    right: "4px",
    top: "4px"
  }));
};

function useToast() {
  var theme = useTheme();
  var notify = useCallback(function (_ref2) {
    var _ref2$position = _ref2.position,
        position = _ref2$position === void 0 ? "bottom" : _ref2$position,
        _ref2$duration = _ref2.duration,
        duration = _ref2$duration === void 0 ? 5000 : _ref2$duration,
        render = _ref2.render,
        title = _ref2.title,
        description = _ref2.description,
        status = _ref2.status,
        _ref2$variant = _ref2.variant,
        variant = _ref2$variant === void 0 ? "solid" : _ref2$variant,
        isClosable = _ref2.isClosable;
    var options = {
      position: position,
      duration: duration
    };

    if (render) {
      return toaster.notify(function (_ref3) {
        var onClose = _ref3.onClose,
            id = _ref3.id;
        return jsx(ThemeProvider, {
          theme: theme
        }, render({
          onClose: onClose,
          id: id
        }));
      }, options);
    }

    toaster.notify(function (_ref4) {
      var onClose = _ref4.onClose,
          id = _ref4.id;
      return jsx(ThemeProvider, {
        theme: theme
      }, jsx(Toast, {
        onClose: onClose,
        id: id,
        title: title,
        description: description,
        status: status,
        variant: variant,
        isClosable: isClosable
      }));
    }, options);
  }, [theme]);
  return notify;
}

export default useToast;