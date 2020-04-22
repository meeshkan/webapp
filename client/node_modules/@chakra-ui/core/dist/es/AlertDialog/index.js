import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import { Modal, ModalContent, ModalFooter, ModalBody, ModalHeader, ModalOverlay, ModalCloseButton } from "../Modal";

var formatIds = function formatIds(id) {
  return {
    content: "alert-dialog-" + id,
    header: "alert-dialog-" + id + "-label",
    body: "alert-dialog-" + id + "-desc"
  };
};

var AlertDialog = function AlertDialog(_ref) {
  var leastDestructiveRef = _ref.leastDestructiveRef,
      props = _objectWithoutPropertiesLoose(_ref, ["leastDestructiveRef"]);

  return jsx(Modal, _extends({
    formatIds: formatIds,
    initialFocusRef: leastDestructiveRef
  }, props));
};

var AlertDialogContent = forwardRef(function (props, ref) {
  return jsx(ModalContent, _extends({
    ref: ref,
    role: "alertdialog"
  }, props));
});
AlertDialogContent.displayName = "AlertDialogContent";
export { AlertDialog, AlertDialogContent, ModalOverlay as AlertDialogOverlay, ModalBody as AlertDialogBody, ModalHeader as AlertDialogHeader, ModalFooter as AlertDialogFooter, ModalCloseButton as AlertDialogCloseButton };