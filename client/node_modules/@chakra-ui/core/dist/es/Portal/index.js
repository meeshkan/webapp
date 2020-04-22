/**
 * Portal Component
 *
 * The following code is a derivative of the amazing work done by the Material UI team.
 * Original source: https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Portal/Portal.js
 */
import React, { Children, cloneElement, useState, forwardRef } from "react";
import { findDOMNode, createPortal } from "react-dom";
import { useForkRef, setRef, useEnhancedEffect } from "../utils";

function getContainer(container) {
  container = typeof container === "function" ? container() : container;
  return findDOMNode(container);
}

var Portal = forwardRef(function (_ref, ref) {
  var children = _ref.children,
      container = _ref.container,
      _ref$isDisabled = _ref.isDisabled,
      isDisabled = _ref$isDisabled === void 0 ? false : _ref$isDisabled,
      onRendered = _ref.onRendered;

  var _useState = useState(null),
      mountNode = _useState[0],
      setMountNode = _useState[1];

  var handleRef = useForkRef(children.ref, ref);
  useEnhancedEffect(function () {
    if (!isDisabled) {
      setMountNode(getContainer(container) || document.body);
    }
  }, [container, isDisabled]);
  useEnhancedEffect(function () {
    if (mountNode && !isDisabled) {
      setRef(ref, mountNode);
      return function () {
        setRef(ref, null);
      };
    }

    return undefined;
  }, [ref, mountNode, isDisabled]);
  useEnhancedEffect(function () {
    if (onRendered && (mountNode || isDisabled)) {
      onRendered();
    }
  }, [onRendered, mountNode, isDisabled]);

  if (isDisabled) {
    Children.only(children);
    return cloneElement(children, {
      ref: handleRef
    });
  }

  return mountNode ? createPortal(children, mountNode) : mountNode;
});
Portal.displayName = "Portal";
export default Portal;