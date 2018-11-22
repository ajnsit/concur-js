/** @jsx el */

import 'babel-polyfill';
import {el, forever, renderWidget, range} from '../core';

// This must be a function, instead of a straight generator
// Else once it finishes, it will not run
const helloWorld = () => forever(async function*() {
    yield* <button conClick onClick>Click me</button>
    yield* <div>
      <span>Hello Concur!</span>
      <button conClick>Restart?</button>
    </div>
  });

const hugeButtonListDemo = (num) => forever(async function*() {
  let arr = range(0,num);
  yield* <button conClick>{"Show a list of " + num + " buttons"}</button>
  let n = yield* <div>
    {arr.map(n => <button conClick={_ => n}>{n}</button>)}
  </div>
  yield* <div>
    {"You clicked button#" + n}
    <button conClick>Restart?</button>
  </div>
});

export const menuExample = forever(async function*(){
  yield* <div key="top">
    <h1>Concur Javascript Demos</h1>
    {forever(async function* () {
      let isHello = yield* <div>
        <div><button conClick={_ => true}>Hello World</button></div>
        <div><button conClick={_ => false}>Huge Button List</button></div>
      </div>
      if(isHello) {
        yield* <div>
          {helloWorld()}
          <hr />
          <button conClick>BACK TO MAIN MENU</button>
        </div>
      } else {
        yield* <div>
          {hugeButtonListDemo(10000)}
          <hr />
          <button conClick>BACK TO MAIN MENU</button>
        </div>
      }
    })}
  </div>
});
