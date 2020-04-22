import { useState, useEffect, useCallback } from "react";
import copy from "copy-to-clipboard";
export function useClipboard(value) {
  var _useState = useState(false),
      hasCopied = _useState[0],
      setHasCopied = _useState[1];

  var onCopy = useCallback(function () {
    var didCopy = copy(value);
    setHasCopied(didCopy);
  }, [value]);
  useEffect(function () {
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
export default useClipboard;