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

export class MappedGen {
  constructor(genFunc, mapView, mapRes) {
    this.gen = genFunc();
    this.mapViewArr = mapView? [mapView] : [];
    this.mapResArr = mapRes? [mapRes] : [];
    // if(!this.gen.next) {
    //   this.res = this.mapViewArr.reduce((v,f) => f(v), this.gen)
    // }
  }
  mapView(f) {
    this.mapViewArr.push(f);
  }
  mapRes(f) {
    this.mapResArr.push(f);
  }
  async next(v) {
    // if(this.res) {
    //   return {value: this.res, done: false};
    // }
    const val = await this.gen.next()
    const mapper = val.done? this.mapResArr : this.mapViewArr;
    val.value = mapper.reduce((v,f) => f(v), val.value)
    return val;
  }
  [Symbol.iterator]() {
    return this
  }
}

// Shorthand
export function w(gen, mapView, mapRes) {
  return new MappedGen(gen, mapView, mapRes);
}

// HACKY. There must be a better way.
// An internal promise that never resolves.
// Can be used for never ending async functions.
const __internal_never_ending_promise__ = new Promise(function() {});

// Display only view
// AJ: TODO: Why can't I wrap this in MappedGen?
export const displayView = (view) => (async function*() {
  yield view;
  return (await __internal_never_ending_promise__);
})();

export const emptyView = () => displayView([]);

// Maps a function over all values yielded by an Async Generator
export const mapView = (f) => (gen) => {
  if(gen instanceof MappedGen) {
    return gen.mapView(f);
  }
  if(isPrimitiveReact(gen)) {
    return f(gen);
  }
  return w(async function* () {
    let val = await gen.next()
    while(!val.done) {
      yield(f(val.value))
      val = await gen.next()
    }
    return val.value;
  });
}

// Maps a function over the return value of an Async Generator
export const mapRes = (f) => async function* (gen) {
  return f(yield* gen);
};

// Internal utility
function isPrimitiveChild(x) {
  return typeof x === 'string' || typeof x === 'number';
}

export function isPrimitiveReact(x) {
  return isPrimitiveChild(x) || React.isValidElement(x);
}

export const orr = (children) => {
  // Special case for some non-array children
  if(isPrimitiveReact(children)) {
    return children;
  }

  // Type checking the view
  if(!Array.isArray(children)) {
    return emptyView();
  }

  // Are all children primitives? Use a fragment.
  if(children.map(isPrimitiveReact).reduce((x,y) => x && y, true)) {
    return React.createElement(React.Fragment, null, children);
  }
  
  // If it's a mix of primitive and non-primitive,
  // convert primitive children to trivial generators
  // so that we can handle all children generically later
  children = children.map(x => {
    if(isPrimitiveReact(x)) {
      return displayView(x);
    }
    return x;
  });

  // If only 0 or 1 child, then no need to merge
  if(!children.length) {
    return emptyView();
  }

  if(children.length === 1) {
    return children[0];
  }

  return (async function* () {
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
  })();
}

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
  let simpleChildren = false;
  if(children.length) {
    // Sometimes you can get arbitrarily nested children
    children = Array.concat.apply([], children.map(child => {
      if(Array.isArray(child)) {
        return child;
      } else {
        return [child];
      }
    }));
    simpleChildren = children.every(isPrimitiveReact);
  } else {
    simpleChildren = true;
  }
  const [p,props,simpleProps] = mkProps(properties);
  if(simpleChildren && simpleProps) {
    return reactCreateElement(componentOrTag, props)(children);
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
  let elem = w;
  if(!isPrimitiveReact(w)) {
    elem = <Concur>{function() {return w;}}</Concur>
  }
  ReactDOM.render(elem, document.getElementById(root));
}

export const withResolver = async function*(axn) {
  yield [];
  let resolveFn;
  const p = new Promise(resolve => { resolveFn = resolve });
  axn(resolveFn);
  return p;
};

//////////////////
// CONTROL FLOW //
//////////////////

export const forever = async function*(w) {
  // Avoid stack overflow
  while(true) {
    yield* w();
  }
};

// Useful array constructor
export const range = (start, stop) => Array.from({ length: stop - start }, (_, i) => start + i);

// Monad fix for JS
// mfix :: ((() -> a) -> (() -> a)) -> () -> a
export const mfix = (f) => {
  return () => {
    let ready = false;
    let result = f(() => {
      if (!ready) throw new Error(message);
      return result;
    })();
    ready = true;
    return result;
  };
};

// DELME - PRIMITIVE TIMEOUT VIEW
export const Timeout = (ms) => {
  return withResolver(r => setTimeout(r, ms));
}
