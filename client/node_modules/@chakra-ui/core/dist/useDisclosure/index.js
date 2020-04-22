"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

var useDisclosure = function useDisclosure(defaultIsOpen) {
  var _useState = (0, _react.useState)(Boolean(defaultIsOpen)),
      isOpen = _useState[0],
      setIsOpen = _useState[1];

  var onClose = (0, _react.useCallback)(function () {
    return setIsOpen(false);
  }, []);
  var onOpen = (0, _react.useCallback)(function () {
    return setIsOpen(true);
  }, []);
  var onToggle = (0, _react.useCallback)(function () {
    return setIsOpen(function (prevIsOpen) {
      return !prevIsOpen;
    });
  }, []);
  return {
    isOpen: isOpen,
    onOpen: onOpen,
    onClose: onClose,
    onToggle: onToggle
  };
};

var _default = useDisclosure;
exports["default"] = _default;