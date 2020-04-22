import { useMemo, useLayoutEffect, useEffect, Children, isValidElement } from "react";
import { useTheme } from "../ThemeProvider";
export var assignRef = function assignRef(ref, value) {
  if (ref == null) return;

  if (typeof ref === "function") {
    ref(value);
  } else {
    try {
      ref.current = value;
    } catch (error) {
      throw new Error("Cannot assign value \"" + value + "\" to ref \"" + ref + "\"");
    }
  }
};
var focusableElList = ["a[href]", "area[href]", "button:not([disabled])", "embed", "iframe", "input:not([disabled])", "object", "select:not([disabled])", "textarea:not([disabled])", "*[tabindex]:not([aria-disabled])", "*[contenteditable]"];
var focusableElSelector = focusableElList.join();
export function getFocusables(element, keyboardOnly) {
  if (keyboardOnly === void 0) {
    keyboardOnly = false;
  }

  var focusableEls = Array.from(element.querySelectorAll(focusableElSelector)); // filter out elements with display: none

  focusableEls = focusableEls.filter(function (focusableEl) {
    return window.getComputedStyle(focusableEl).display !== "none";
  });

  if (keyboardOnly === true) {
    focusableEls = focusableEls.filter(function (focusableEl) {
      return focusableEl.getAttribute("tabindex") !== "-1";
    });
  }

  return focusableEls;
}
export function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
export function useForkRef(refA, refB) {
  return useMemo(function () {
    if (refA == null && refB == null) {
      return null;
    }

    return function (refValue) {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
export function createChainedFunction() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return funcs.reduce(function (acc, func) {
    if (func == null) {
      return acc;
    }

    return function chainedFunction() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      acc.apply(this, args);
      func.apply(this, args);
    };
  }, function () {});
}
export var useEnhancedEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export var wrapEvent = function wrapEvent(theirHandler, ourHandler) {
  return function (event) {
    if (theirHandler) {
      theirHandler(event);
    }

    if (!event.defaultPrevented) {
      return ourHandler(event);
    }
  };
};
export var isReducedMotion = function isReducedMotion() {
  var _window$matchMedia = window.matchMedia("(prefers-reduced-motion: reduce)"),
      matches = _window$matchMedia.matches;

  return matches;
};
export var prefersReducedMotion = function prefersReducedMotion() {
  return {
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      transition: "none"
    }
  };
};
export var isObject = function isObject(input) {
  return input != null && typeof input === "object" && Object.keys(input).length > 0;
};
export var inputProps = ["name", "type", "autoFocus", "size", "form", "pattern", "placeholder", "onBlur", "onChange", "onKeyDown", "onKeyUp", "onKeyPress", "onFocus", "id", "autoFocus", "aria-label", "aria-describedby", "aria-labelledby", "min", "max", "maxLength", "minLength", "step", "defaultValue", "value", "isReadOnly", "isFullWidth", "isDisabled", "isInvalid", "isRequired"];
export function useVariantColorWarning(label, variantColor) {
  var theme = useTheme();

  if (process.env.NODE_ENV !== "production") {
    var variantColorIsDefined = variantColor != null;

    if (variantColorIsDefined) {
      var variantColorExists = variantColor in theme.colors; // If variant color exists in theme object

      if (!variantColorExists) {
        console.warn("You passed an invalid variantColor to the " + label + " Component. Variant color values must be a color key in the theme object that has '100' - '900' color values. Check http://chakra-ui.com/theme#colors to see possible values");
      } // if variant color exists and is an object
      // TODO: Check for the 100 - 900 keys


      if (variantColorExists) {
        var colorObj = theme.colors[variantColor];
        var variantColorIsObject = typeof colorObj === "object" && Object.keys(colorObj).length > 0;

        if (!variantColorIsObject) {
          console.warn(label + ": The variantColor passed exists in the theme object but is not valid. For a color to be a valid variantColor, it must be an object that has '100' - '900' color values. Use a tool like: \n        https://smart-swatch.netlify.com/ to generate color values quickly");
        }
      }
    }
  }
}
export function cleanChildren(children) {
  return Children.toArray(children).filter(function (child) {
    return isValidElement(child);
  });
}