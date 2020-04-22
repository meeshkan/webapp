"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useClipboard = useClipboard;
exports["default"] = void 0;

var _react = require("react");

var _copyToClipboard = _interopRequireDefault(require("copy-to-clipboard"));

function useClipboard(value) {
  var _useState = (0, _react.useState)(false),
      hasCopied = _useState[0],
      setHasCopied = _useState[1];

  var onCopy = (0, _react.useCallback)(function () {
    var didCopy = (0, _copyToClipboard["default"])(value);
    setHasCopied(didCopy);
  }, [value]);
  (0, _react.useEffect)(function () {
    if (hasCopied) {
      var id = setTimeout(function () {
        setHasCopied(false);
      }, 1500);
      return function () {
        return clearTimeout(id);
      };
    }
  }, [hasCopied]);
  return {
    value: value,
    onCopy: onCopy,
    hasCopied: hasCopied
  };
}

var _default = useClipboard;
exports["default"] = _default;