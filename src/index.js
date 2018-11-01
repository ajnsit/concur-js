import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import {Concur, el, forever, displayView, renderWidget} from './core';

//////////////////
// HELLO CONCUR //
//////////////////

// Generic Button component
let button = async function* (label) {
  let resolve;
  let p = new Promise(function(resolveFn) {resolve = resolveFn;});
  yield [<button onClick={() => resolve()}>{label}</button>];
  return await p;
};

// Create a new widget
const HelloWorld =
  el("div",
    [ displayView(<h1>Concur JS Hello World</h1>)
    , forever(async function* () {
        yield* button("Click me");
        yield* el("div",
          [ displayView("Hello Concur!")
          , button("Restart?")
          ]);
      })
  ]);

// You can directly render a widget using `renderWidget`.
renderWidget(HelloWorld)('root');

// Or you can also convert a widget to a React element by wrapping it in <Concur></Concur> tags
// (It needs to be wrapped inside a function due to technical limitations).
ReactDOM.render(<Concur>{() => HelloWorld}</Concur>, document.getElementById('root'));
