import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Transition } from "react-spring/renderprops.cjs"; // Easing function from d3-ease: https://github.com/d3/d3-ease/blob/master/src/exp.js

function expOut(t) {
  return 1 - Math.pow(2, -10 * t);
} // function expInOut(t) {
//   return (
//     ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) /
//     2
//   );
// }
///////////////////////////////////////////////////////////////////////////


export var Slide = function Slide(_ref) {
  var inProp = _ref["in"],
      children = _ref.children,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 250 : _ref$duration,
      from = _ref.from,
      _ref$finalHeight = _ref.finalHeight,
      finalHeight = _ref$finalHeight === void 0 ? "auto" : _ref$finalHeight,
      finalWidth = _ref.finalWidth;
  var placements = {
    bottom: {
      maxWidth: "100vw",
      height: finalHeight,
      bottom: 0,
      left: 0,
      right: 0
    },
    top: {
      maxWidth: "100vw",
      height: finalHeight,
      top: 0,
      left: 0,
      right: 0
    },
    left: _objectSpread({}, finalWidth && {
      maxWidth: finalWidth
    }, {
      height: "100vh",
      left: 0,
      top: 0
    }),
    right: _objectSpread({}, finalWidth && {
      maxWidth: finalWidth
    }, {
      right: 0,
      top: 0,
      height: "100vh"
    })
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
  var _transitionOptions$fr = transitionOptions[from],
      transform = _transitionOptions$fr.transform,
      offset = _transitionOptions$fr.offset;
  return jsx(Transition, {
    items: inProp,
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
      duration: duration,
      easing: expOut
    }
  }, function (inProp) {
    return inProp && function (styles) {
      return children(_objectSpread({
        willChange: "opacity, transform",
        opacity: styles.opacity,
        transform: transform(styles.offset)
      }, placements[from]));
    };
  });
}; ///////////////////////////////////////////////////////////////////////////

export var Scale = function Scale(_ref2) {
  var inProp = _ref2["in"],
      _ref2$initialScale = _ref2.initialScale,
      initialScale = _ref2$initialScale === void 0 ? 0.97 : _ref2$initialScale,
      _ref2$duration = _ref2.duration,
      duration = _ref2$duration === void 0 ? 150 : _ref2$duration,
      children = _ref2.children,
      rest = _objectWithoutPropertiesLoose(_ref2, ["in", "initialScale", "duration", "children"]);

  return jsx(Transition, _extends({
    items: inProp,
    config: {
      duration: duration
    },
    from: {
      opacity: 0,
      transform: "scale(" + initialScale + ")"
    },
    enter: {
      opacity: 1,
      transform: "scale(1)"
    },
    leave: {
      opacity: 0,
      transform: "scale(" + initialScale + ")"
    }
  }, rest), function (inProp) {
    return inProp && function (styles) {
      return children(_objectSpread({
        willChange: "opacity, transform"
      }, styles));
    };
  });
};
export var SlideIn = function SlideIn(_ref3) {
  var inProp = _ref3["in"],
      _ref3$offset = _ref3.offset,
      offset = _ref3$offset === void 0 ? "10px" : _ref3$offset,
      _ref3$duration = _ref3.duration,
      duration = _ref3$duration === void 0 ? 150 : _ref3$duration,
      children = _ref3.children,
      rest = _objectWithoutPropertiesLoose(_ref3, ["in", "offset", "duration", "children"]);

  return jsx(Transition, _extends({
    items: inProp,
    config: {
      duration: duration
    },
    from: {
      opacity: 0,
      transform: "translate3d(0, " + offset + ", 0)"
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0, 0, 0)"
    },
    leave: {
      opacity: 0,
      transform: "translate3d(0, " + offset + ", 0)"
    }
  }, rest), function (inProp) {
    return inProp && function (styles) {
      return children(_objectSpread({
        willChange: "opacity, transform"
      }, styles));
    };
  });
};