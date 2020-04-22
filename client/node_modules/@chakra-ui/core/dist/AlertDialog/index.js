"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.AlertDialogContent = exports.AlertDialog = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Modal = require("../Modal");

exports.AlertDialogFooter = _Modal.ModalFooter;
exports.AlertDialogBody = _Modal.ModalBody;
exports.AlertDialogHeader = _Modal.ModalHeader;
exports.AlertDialogOverlay = _Modal.ModalOverlay;
exports.AlertDialogCloseButton = _Modal.ModalCloseButton;

/** @jsx jsx */
var formatIds = function formatIds(id) {
  return {
    content: "alert-dialog-" + id,
    header: "alert-dialog-" + id + "-label",
    body: "alert-dialog-" + id + "-desc"
  };
};

var AlertDialog = function AlertDialog(_ref) {
  var leastDestructiveRef = _ref.leastDestructiveRef,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["leastDestructiveRef"]);
  return (0, _core.jsx)(_Modal.Modal, (0, _extends2["default"])({
    formatIds: formatIds,
    initialFocusRef: leastDestructiveRef
  }, props));
};

exports.AlertDialog = AlertDialog;
var AlertDialogContent = (0, _react.forwardRef)(function (props, ref) {
  return (0, _core.jsx)(_Modal.ModalContent, (0, _extends2["default"])({
    ref: ref,
    role: "alertdialog"
  }, props));
});
exports.AlertDialogContent = AlertDialogContent;
AlertDialogContent.displayName = "AlertDialogContent";