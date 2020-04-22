import { useState, useCallback } from "react";

var useDisclosure = function useDisclosure(defaultIsOpen) {
  var _useState = useState(Boolean(defaultIsOpen)),
      isOpen = _useState[0],
      setIsOpen = _useState[1];

  var onClose = useCallback(function () {
    return setIsOpen(false);
  }, []);
  var onOpen = useCallback(function () {
    return setIsOpen(true);
  }, []);
  var onToggle = useCallback(function () {
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

export default useDisclosure;