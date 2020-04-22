"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _utils = require("../utils");

/**
 * Portal Component
 *
 * The following code is a derivative of the amazing work done by the Material UI team.
 * Original source: https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Portal/Portal.js
 */
function getContainer(container) {
  container = typeof container === "function" ? container() : container;
  return (0, _reactDom.findDOMNode)(container);
}

var Portal = (0, _react.forwardRef)(function (_ref, ref) {
  var children = _ref.children,
      container = _ref.container,
      _ref$isDisabled = _ref.isDisabled,
      isDisabled = _ref$isDisabled === void 0 ? false : _ref$isDisabled,
      onRendered = _ref.onRendered;

  var _useState = (0, _react.useState)(null),
      mountNode = _useState[0],
      setMountNode = _useState[1];

  var handleRef = (0, _utils.useForkRef)(children.ref, ref);
  (0, _utils.useEnhancedEffect)(function () {
    if (!isDisabled) {
      setMountNode(getContainer(container) || document.body);
    }
  }, [container, isDisabled]);
  (0, _utils.useEnhancedEffect)(function () {
    if (mountNode && !isDisabled) {
      (0, _utils.setRef)(ref, mountNode);
      return function () {
        (0, _utils.setRef)(ref, null);
      };
    }

    return undefined;
  }, [ref, mountNode, isDisabled]);
  (0, _utils.useEnhancedEffect)(function () {
    if (onRendered && (mountNode || isDisabled)) {
      onRendered();
    }
  }, [onRendered, mountNode, isDisabled]);

  if (isDisabled) {
    _react.Children.only(children);

    return (0, _react.cloneElement)(children, {
      ref: handleRef
    });
  }

  return mountNode ? (0, _reactDom.createPortal)(children, mountNode) : mountNode;
});
Portal.displayName = "Portal";
var _default = Portal;
exports["default"] = _default;