/** @jsx el */

import 'babel-polyfill';
import {el, forever, w, range, displayView} from '../core';

// Generic combinator
// Throttle a widget output
function throttle(timeout, widget) {
  var isThrottled = false;
  var timer = null;
  var reset = () => {
    isThrottled = false
    timer = null
  }
  return async function*() {
    var res = yield* widget()
    while(isThrottled) {
      res = yield* widget();
    }
    isThrottled = true
    if(!timer) timer = setTimeout(reset, timeout);
    return res;
  }
}

const throttledButton = throttle(2000, async function* () {
  yield* <button conClick>Show me another dog</button>
})

// Generic combinator
// Show a loading indicator with an async widget
function loader(axn, msg) {
  return <div>{axn()}<div>{msg}</div></div>
}

// Fetch data for a random dog
async function* randomDog() {
  var data = yield* loader( async function* () {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    return await res.json();
  }, "Fetching a good boy...")

  yield* displayView(
    <a href={data.message}>
      <img src={data.message} alt="A Random Dog" width="300" />
    </a>
  );
}

export const goodBoy = forever(
    () => <div>
      {throttledButton()}
      {randomDog()}
    </div>
)
