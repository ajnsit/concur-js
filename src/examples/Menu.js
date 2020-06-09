/** @jsx el */

import 'babel-polyfill';
import {el, forever, w, range} from '../core';
import {goodBoy} from './GoodBoy';

// This must be a function, instead of a straight generator
// Else once it finishes, it will not run
const helloWorld = () => forever(async function*() {
    yield* <button conClick>Click me</button>
    yield* <div>
      <span>Hello Concur!</span>
      <button conClick>Restart?</button>
    </div>
  });

const hugeButtonListDemo = (num) => forever(async function*() {
  let arr = range(0,num);
  yield* <button conClick>{"Show a list of " + num + " buttons"}</button>
  let n = yield* <div>
    {arr.map(n => <button conClick={n}>{n}</button>)}
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
      let component = yield* <div>
        <div><button conClick={_ => helloWorld()}>Hello World</button></div>
        <div><button conClick={_ => goodBoy}>Good Boy</button></div>
        <div><button conClick={_ => hugeButtonListDemo(10000)}>Huge Button List</button></div>
      </div>
      yield* <div>
        {component}
        <hr />
        <button conClick>BACK TO MAIN MENU</button>
      </div>
    })}
  </div>
});
