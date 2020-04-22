"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _toastedNotes = _interopRequireDefault(require("toasted-notes"));

var _react = require("react");

var _Alert = require("../Alert");

var _ThemeProvider = _interopRequireWildcard(require("../ThemeProvider"));

var _Box = _interopRequireDefault(require("../Box"));

var _CloseButton = _interopRequireDefault(require("../CloseButton"));

/** @jsx jsx */
var Toast = function Toast(_ref) {
  var status = _ref.status,
      variant = _ref.variant,
      id = _ref.id,
      title = _ref.title,
      isClosable = _ref.isClosable,
      onClose = _ref.onClose,
      description = _ref.description,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["status", "variant", "id", "title", "isClosable", "onClose", "description"]);
  return (0, _core.jsx)(_Alert.Alert, (0, _extends2["default"])({
    status: status,
    variant: variant,
    id: id,
    textAlign: "left",
    boxShadow: "lg",
    rounded: "md",
    alignItems: "start",
    m: 2,
    pr: 8
  }, props), (0, _core.jsx)(_Alert.AlertIcon, null), (0, _core.jsx)(_Box["default"], {
    flex: "1"
  }, title && (0, _core.jsx)(_Alert.AlertTitle, null, title), description && (0, _core.jsx)(_Alert.AlertDescription, null, description)), isClosable && (0, _core.jsx)(_CloseButton["default"], {
    size: "sm",
    onClick: onClose,
    position: "absolute",
    right: "4px",
    top: "4px"
  }));
};

function useToast() {
  var theme = (0, _ThemeProvider.useTheme)();
  var notify = (0, _react.useCallback)(function (_ref2) {
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
      return _toastedNotes["default"].notify(function (_ref3) {
        var onClose = _ref3.onClose,
            id = _ref3.id;
        return (0, _core.jsx)(_ThemeProvider["default"], {
          theme: theme
        }, render({
          onClose: onClose,
          id: id
        }));
      }, options);
    }

    _toastedNotes["default"].notify(function (_ref4) {
      var onClose = _ref4.onClose,
          id = _ref4.id;
      return (0, _core.jsx)(_ThemeProvider["default"], {
        theme: theme
      }, (0, _core.jsx)(Toast, {
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

var _default = useToast;
exports["default"] = _default;