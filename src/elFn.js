/* eslint-disable complexity, max-statements */
// 'use strict';

// Attribution: Adapted from https://github.com/mlmorg/react-hyperscript

import parseTag from './parseTag'

export default (fragment, createElement) => function el(componentOrTag, properties, children) {
  // if only one argument which is an array, wrap items with a fragment
  if (arguments.length === 1 && Array.isArray(componentOrTag)) {
      return el(fragment, null, componentOrTag);
  } else if (!children && isChildren(properties)) {
    // If a child array or text node are passed as the second argument, shift them
    children = properties;
    properties = {};
  } else if (arguments.length === 2) {
    // If no children were passed, we don't want to pass "undefined"
    // and potentially overwrite the `children` prop
    children = [];
  }

  properties = properties ? Object.assign({}, properties) : {};

  // Supported nested dataset attributes
  if (properties.dataset) {
    Object.keys(properties.dataset).forEach(function unnest(attrName) {
      var dashedAttr = attrName.replace(/([a-z])([A-Z])/, function dash(match) {
        return match[0] + '-' + match[1].toLowerCase();
      });
      properties['data-' + dashedAttr] = properties.dataset[attrName];
    });

    properties.dataset = undefined;
  }

  // Support nested attributes
  if (properties.attributes) {
    Object.keys(properties.attributes).forEach(function unnest(attrName) {
      properties[attrName] = properties.attributes[attrName];
    });

    properties.attributes = undefined;
  }

  // When a selector, parse the tag name and fill out the properties object
  if (typeof componentOrTag === 'string') {
    componentOrTag = parseTag(componentOrTag, properties);
  }

  // Create the element
  // var args = [componentOrTag, properties].concat(children);
  return createElement.apply(null, [componentOrTag, properties, children]);
}

function isChildren(x) {
  return typeof x === 'string' || typeof x === 'number' || Array.isArray(x);
}
