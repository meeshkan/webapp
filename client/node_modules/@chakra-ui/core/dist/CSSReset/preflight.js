"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _core = require("@emotion/core");

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  html {\n    line-height: 1.15;\n    -webkit-text-size-adjust: 100%;\n  }\n\n  body {\n    margin: 0;\n  }\n\n  main {\n    display: block;\n  }\n\n  h1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n  }\n\n  hr {\n    box-sizing: content-box;\n    height: 0;\n    overflow: visible;\n  }\n\n  pre {\n    font-family: monospace, monospace;\n    font-size: 1em;\n  }\n\n  a {\n    background-color: transparent;\n  }\n\n  abbr[title] {\n    border-bottom: none;\n    text-decoration: underline;\n    -webkit-text-decoration: underline dotted;\n    text-decoration: underline dotted;\n  }\n\n  b,\n  strong {\n    font-weight: bolder;\n  }\n\n  code,\n  kbd,\n  samp {\n    font-family: monospace, monospace;\n    font-size: 1em;\n  }\n\n  small {\n    font-size: 80%;\n  }\n\n  sub,\n  sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n  }\n\n  sub {\n    bottom: -0.25em;\n  }\n\n  sup {\n    top: -0.5em;\n  }\n\n  img {\n    border-style: none;\n  }\n\n  button,\n  input,\n  optgroup,\n  select,\n  textarea {\n    font-family: inherit;\n    font-size: 100%;\n    line-height: 1.15;\n    margin: 0;\n  }\n\n  button,\n  input {\n    overflow: visible;\n  }\n\n  button,\n  select {\n    text-transform: none;\n  }\n\n  button::-moz-focus-inner,\n  [type=\"button\"]::-moz-focus-inner,\n  [type=\"reset\"]::-moz-focus-inner,\n  [type=\"submit\"]::-moz-focus-inner {\n    border-style: none;\n    padding: 0;\n  }\n\n  fieldset {\n    padding: 0.35em 0.75em 0.625em;\n  }\n\n  legend {\n    box-sizing: border-box;\n    color: inherit;\n    display: table;\n    max-width: 100%;\n    padding: 0;\n    white-space: normal;\n  }\n\n  progress {\n    vertical-align: baseline;\n  }\n\n  textarea {\n    overflow: auto;\n  }\n\n  [type=\"checkbox\"],\n  [type=\"radio\"] {\n    box-sizing: border-box;\n    padding: 0;\n  }\n\n  [type=\"number\"]::-webkit-inner-spin-button,\n  [type=\"number\"]::-webkit-outer-spin-button {\n    -webkit-appearance: none !important;\n  }\n\n  input[type=\"number\"] {\n    -moz-appearance: textfield;\n  }\n\n  [type=\"search\"] {\n    -webkit-appearance: textfield;\n    outline-offset: -2px;\n  }\n\n  [type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none !important;\n  }\n\n  ::-webkit-file-upload-button {\n    -webkit-appearance: button;\n    font: inherit;\n  }\n\n  details {\n    display: block;\n  }\n\n  summary {\n    display: list-item;\n  }\n\n  template {\n    display: none;\n  }\n\n  [hidden] {\n    display: none !important;\n  }\n\n  html {\n    box-sizing: border-box;\n    font-family: sans-serif;\n  }\n\n  *,\n  *::before,\n  *::after {\n    box-sizing: border-box;\n  }\n\n  blockquote,\n  dl,\n  dd,\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6,\n  hr,\n  figure,\n  p,\n  pre {\n    margin: 0;\n  }\n\n  button {\n    background: transparent;\n    padding: 0;\n  }\n\n  fieldset {\n    margin: 0;\n    padding: 0;\n  }\n\n  ol,\n  ul {\n    margin: 0;\n    padding: 0;\n  }\n\n  html {\n    font-family: ", ";\n    line-height: 1.5;\n    -webkit-font-smoothing: antialiased;\n    -webkit-text-size-adjust: 100%;\n    text-rendering: optimizelegibility;\n  }\n\n  hr {\n    border-top-width: 1px;\n  }\n\n  img {\n    border-style: solid;\n  }\n\n  textarea {\n    resize: vertical;\n  }\n\n  button,\n  [role=\"button\"] {\n    cursor: pointer;\n  }\n\n  button::-moz-focus-inner {\n    border: 0 !important;\n  }\n\n  table {\n    border-collapse: collapse;\n  }\n\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    font-size: inherit;\n    font-weight: inherit;\n  }\n\n  a {\n    color: inherit;\n    text-decoration: inherit;\n  }\n\n  button,\n  input,\n  optgroup,\n  select,\n  textarea {\n    padding: 0;\n    line-height: inherit;\n    color: inherit;\n  }\n\n  pre,\n  code,\n  kbd,\n  samp {\n    font-family: ", ";\n  }\n\n  img,\n  svg,\n  video,\n  canvas,\n  audio,\n  iframe,\n  embed,\n  object {\n    display: block;\n    vertical-align: middle;\n  }\n\n  img,\n  video {\n    max-width: 100%;\n    height: auto;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var tailwindPreflight = function tailwindPreflight(theme) {
  return (0, _core.css)(_templateObject(), theme.fonts.body, theme.fonts.mono);
};

var _default = tailwindPreflight;
exports["default"] = _default;