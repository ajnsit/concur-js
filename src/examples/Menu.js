/** @jsx el */

import 'babel-polyfill';
import {el, forever, renderWidget, range} from '../core';

// This must be a function, instead of a straight generator
// Else once it finishes, it will not run
const helloWorld = () => forever(async function*() {
    yield* <button onClick>Click me</button>
    yield* <div>
      <span>Hello Concur!</span>
      <button onClick>Restart?</button>
    </div>
  });

const hugeButtonListDemo = (num) => forever(async function*() {
  let arr = range(0,num);
  yield* <button onClick>{"Show a list of " + num + " buttons"}</button>
  let n = yield* <div>
    {arr.map(n => <button onClick={_ => n}>{n}</button>)}
  </div>
  yield* <div>
    {"You clicked button#" + n}
    <button onClick>Restart?</button>
  </div>
});

export const menuExample = forever(async function*(){
  yield* <div key="top">
    <h1>Concur Javascript Demos</h1>
    {forever(async function* () {
      let isHello = yield* <div>
        <div><button onClick={_ => true}>Hello World</button></div>
        <div><button onClick={_ => false}>Huge Button List</button></div>
      </div>
      if(isHello) {
        yield* <div>
          {helloWorld()}
          <hr />
          <button onClick>BACK TO MAIN MENU</button>
        </div>
      } else {
        yield* <div>
          {hugeButtonListDemo(10000)}
          <hr />
          <button onClick>BACK TO MAIN MENU</button>
        </div>
      }
    })}
  </div>
});
