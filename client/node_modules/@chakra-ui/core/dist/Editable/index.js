"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.EditableInput = exports.EditablePreview = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _Box = _interopRequireDefault(require("../Box"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EditableContext = (0, _react.createContext)();
var Editable = (0, _react.forwardRef)(function (_ref, ref) {
  var valueProp = _ref.value,
      defaultValue = _ref.defaultValue,
      isDisabled = _ref.isDisabled,
      onChange = _ref.onChange,
      startWithEditView = _ref.startWithEditView,
      onCancel = _ref.onCancel,
      onSubmit = _ref.onSubmit,
      _ref$selectAllOnFocus = _ref.selectAllOnFocus,
      selectAllOnFocus = _ref$selectAllOnFocus === void 0 ? true : _ref$selectAllOnFocus,
      _ref$submitOnBlur = _ref.submitOnBlur,
      submitOnBlur = _ref$submitOnBlur === void 0 ? true : _ref$submitOnBlur,
      _ref$isPreviewFocusab = _ref.isPreviewFocusable,
      isPreviewFocusable = _ref$isPreviewFocusab === void 0 ? true : _ref$isPreviewFocusab,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? "Click to edit..." : _ref$placeholder,
      children = _ref.children,
      onEdit = _ref.onEdit,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["value", "defaultValue", "isDisabled", "onChange", "startWithEditView", "onCancel", "onSubmit", "selectAllOnFocus", "submitOnBlur", "isPreviewFocusable", "placeholder", "children", "onEdit"]);

  var _useState = (0, _react.useState)(startWithEditView && !isDisabled),
      isEditing = _useState[0],
      setIsEditing = _useState[1];

  var _useRef = (0, _react.useRef)(valueProp != null),
      isControlled = _useRef.current;

  var _useState2 = (0, _react.useState)(defaultValue || ""),
      value = _useState2[0],
      setValue = _useState2[1];

  var _value = isControlled ? valueProp : value;

  var _useState3 = (0, _react.useState)(_value),
      previousValue = _useState3[0],
      setPreviousValue = _useState3[1];

  var inputRef = (0, _react.useRef)(null);

  var onRequestEdit = function onRequestEdit(event) {
    if (!isDisabled) {
      setIsEditing(true);
    }
  };

  (0, _react.useEffect)(function () {
    if (isEditing) {
      onEdit && onEdit();
    }
  }, [isEditing, onEdit]);
  (0, _react.useEffect)(function () {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      selectAllOnFocus && inputRef.current.select();
    }
  }, [isEditing, selectAllOnFocus]);

  var handleCancel = function handleCancel() {
    setIsEditing(false);
    setValue(previousValue);

    if (value !== previousValue) {
      onChange && onChange(previousValue);
    }

    onCancel && onCancel(previousValue);
  };

  var handleSubmit = function handleSubmit() {
    setIsEditing(false);
    setPreviousValue(value);
    onSubmit && onSubmit(value);
  };

  var handleChange = function handleChange(event) {
    var value = event.target.value;

    if (!isControlled) {
      setValue(value);
    }

    onChange && onChange(value);
  };

  var handleKeyDown = function handleKeyDown(event) {
    var key = event.key;

    if (key === "Escape") {
      handleCancel();
      return;
    }

    if (key === "Enter") {
      handleSubmit();
    }
  };

  var handleFocus = function handleFocus(event) {
    if (selectAllOnFocus) {
      inputRef.current.select();
    }
  };

  var childContext = {
    inputRef: inputRef,
    isEditing: isEditing,
    isDisabled: isDisabled,
    placeholder: placeholder,
    onRequestEdit: onRequestEdit,
    submitOnBlur: submitOnBlur,
    isPreviewFocusable: isPreviewFocusable,
    value: _value,
    onKeyDown: handleKeyDown,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onFocus: handleFocus
  };
  return (0, _core.jsx)(EditableContext.Provider, {
    value: childContext
  }, (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref
  }, rest), typeof children === "function" ? children({
    isEditing: isEditing,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onRequestEdit: onRequestEdit
  }) : children));
});
Editable.displayName = "Editable";
var sharedProps = {
  fontSize: "inherit",
  fontWeight: "inherit",
  textAlign: "inherit",
  bg: "transparent",
  transition: "all 0.2s",
  borderRadius: "md",
  px: "3px",
  mx: "-3px"
};

var EditablePreview = function EditablePreview(props) {
  var _useContext = (0, _react.useContext)(EditableContext),
      isEditing = _useContext.isEditing,
      isDisabled = _useContext.isDisabled,
      value = _useContext.value,
      onRequestEdit = _useContext.onRequestEdit,
      placeholder = _useContext.placeholder,
      isPreviewFocusable = _useContext.isPreviewFocusable;

  var hasValue = value != null && value !== "";

  var getTabIndex = function getTabIndex() {
    if ((!isEditing || !isDisabled) && isPreviewFocusable) {
      return 0;
    }

    return null;
  };

  var styleProps = _objectSpread({}, sharedProps, {
    cursor: "text",
    display: "inline-block",
    opacity: !hasValue ? 0.6 : undefined
  });

  if (isEditing) {
    return null;
  }

  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    as: "span",
    "aria-disabled": isDisabled,
    tabIndex: getTabIndex(),
    onFocus: onRequestEdit
  }, styleProps, props), hasValue ? value : placeholder);
};

exports.EditablePreview = EditablePreview;

var EditableInput = function EditableInput(props) {
  var _useContext2 = (0, _react.useContext)(EditableContext),
      inputRef = _useContext2.inputRef,
      isEditing = _useContext2.isEditing,
      onChange = _useContext2.onChange,
      onKeyDown = _useContext2.onKeyDown,
      value = _useContext2.value,
      onSubmit = _useContext2.onSubmit,
      onCancel = _useContext2.onCancel,
      submitOnBlur = _useContext2.submitOnBlur,
      placeholder = _useContext2.placeholder,
      isDisabled = _useContext2.isDisabled;

  if (!isEditing) {
    return null;
  }

  var styleProps = _objectSpread({}, sharedProps, {
    width: "full",
    _placeholder: {
      opacity: "0.6"
    }
  });

  var renderProps = {
    ref: inputRef,
    onBlur: function onBlur(event) {
      submitOnBlur ? onSubmit() : onCancel();

      if (props.onBlur) {
        props.onBlur(event);
      }
    },
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    onKeyDown: onKeyDown
  };
  return props.children ? props.children(renderProps) : (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    "aria-disabled": isDisabled,
    disabled: isDisabled,
    as: "input",
    outline: "none",
    _focus: {
      shadow: "outline"
    }
  }, renderProps, styleProps, props));
};

exports.EditableInput = EditableInput;
var _default = Editable;
exports["default"] = _default;