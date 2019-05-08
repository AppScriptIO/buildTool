"use strict";

// how moduels from config data was loaded:
if (item.data.module) {
  // load as import module
  func = require(item.data.path)[item.data.module];
} else {
  // load as default export
  func = require(item.data.path);
  if (func.default) func = func.default;
}