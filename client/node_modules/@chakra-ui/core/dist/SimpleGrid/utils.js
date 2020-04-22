"use strict";

exports.__esModule = true;
exports.countToColumns = exports.widthToColumns = void 0;

// These helper fns are modified versions of the amazing rebass library
// https://github.com/rebassjs/rebass/blob/master/packages/layout/src/index.js
var px = function px(n) {
  return typeof n === "number" ? n + "px" : n;
};

var widthToColumns = function widthToColumns(width) {
  if (Array.isArray(width)) {
    return width.map(widthToColumns);
  }

  if (width !== null && typeof width === "object" && Object.keys(width).length > 0) {
    var acc = {};

    for (var key in width) {
      acc[key] = "repeat(auto-fit, minmax(" + px(width[key]) + ", 1fr))";
    }

    return acc;
  }

  if (width != null) {
    return "repeat(auto-fit, minmax(" + px(width) + ", 1fr))";
  }

  return null;
};

exports.widthToColumns = widthToColumns;

var countToColumns = function countToColumns(count) {
  if (Array.isArray(count)) {
    return count.map(countToColumns);
  }

  if (count !== null && typeof count === "object" && Object.keys(count).length > 0) {
    var acc = {};

    for (var key in count) {
      acc[key] = "repeat(" + count[key] + ", 1fr)";
    }

    return acc;
  }

  if (count != null) {
    return "repeat(" + count + ", 1fr)";
  }

  return null;
};

exports.countToColumns = countToColumns;