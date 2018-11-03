import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import {mkProps} from './props'

////////////
// CONCUR //
////////////

// Concur
// React async components

//   async function* () {
//     ...
//     let p = new Promise((resolve) => {
//       yield [jsx that resolves p]
//     };
//     let ret = await p
//     ...
//     return (ret + 1);
//   }

// HACKY. There must be a better way.
// An internal promise that never resolves.
// Can be used for never ending async functions.
const __internal_never_ending_promise__ = new Promise(function() {});

// Display only view
export const displayView = async function*(view) {
  yield view;
  return (await __internal_never_ending_promise__);
};

export const emptyView = displayView([]);
// Maps a function over all values yielded by an Async Generator
export const mapView = (f) => async function* (gen) {
  let val = await gen.next()
  while(!val.done) {
    yield(f(val.value))
    val = await gen.next()
  }
  return val.value;
};

// Maps a function over the return value of an Async Generator
export const mapRes = (f) => async function* (gen) {
  return f(yield* gen);
};

// Internal utility
function isPrimitiveChild(x) {
  return typeof x === 'string' || typeof x === 'number';
}

export const orr = async function* (children) {

  // Special case for some non-array children
  if(typeof children === 'string' || typeof children === 'number') {
    return (yield* displayView(children));
  }

  // Type checking on the view
  if(!Array.isArray(children)) {
    return (yield* emptyView);
  }
    
  // Convert primitive children to display views
  children = children.map(x => {
    if(isPrimitiveChild(x)) {
      return displayView(x);
    }
    return x;
  });

  // If only 0 or 1 child, then no need to merge
  if(!children.length) {
    return (yield* emptyView);
  }
  if(children.length === 1) {
    return (yield* children[0]);
  }

  // Need to get the initial views from all the children
  let nextChildViewPromises = children.map(view => view.next());
  let nextChildViews = await Promise.all(nextChildViewPromises)
  let dones = nextChildViews.filter(x => x.done);
  if(dones.length) {
    return dones[0].value;
  }
  nextChildViewPromises = children.map((view, idx) => view.next().then(v => [idx,v]));

  // Step loop
  while(true) {
    yield nextChildViews.reduce((x,y) => x.concat(y.value), []);
    let [idx, v] = await Promise.race(nextChildViewPromises);
    if(v.done) {
      return v.value;
    }
    nextChildViews[idx] = v;
    nextChildViewPromises[idx] = children[idx].next().then(v => [idx,v])
  }
};

const dischargeView = (handleView, view) => {
  if(view && view.next && typeof view.next === 'function') {
    return view.next().then(newView => {
      if(newView.done) {
        return newView.value;
      }
      handleView(newView.value);
      return dischargeView(handleView, view);
    });
  }
  return __internal_never_ending_promise__;
}

///////////
// REACT //
///////////

const reactCreateElement = (t, p) => (c) => React.createElement.apply(React, [t, p].concat(c));

export const el = function(componentOrTag, properties, ...children) {
  const [p,props] = mkProps(properties);
  if(children.length) {
    // Sometimes you can get arbitrarily nested children
    children = Array.concat.apply([], children.map(child => {
      if(Array.isArray(child)) {
        return child;
      } else {
        return [child];
      }
    }));
  }
  const child = orr(children);
  const ret = orr([p,mapView(reactCreateElement(componentOrTag, props))(child)]);
  return ret;
};

export class Concur extends Component {
  constructor(props) {
    super(props);
    this.widget = props.children();
    this.state = {view: <div>LOADING...</div>};
  }
  componentDidMount() {
    const dv = dischargeView(v => this.setState({view: v}), this.widget);
    dv.then(v => { console.log("App exited with value " + v) });
  }
  render() {
    return this.state.view;
  }
}

export const renderWidget = (w) => (root) => {
  ReactDOM.render(<Concur>{function() {return w;}}</Concur>, document.getElementById(root));
}

//////////////////
// CONTROL FLOW //
//////////////////

export const forever = async function*(w) {
  yield* w();
  yield* forever(w);
};

export const range = (start, stop) => Array.from({ length: stop - start }, (_, i) => start + i);

