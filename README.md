# Concur JS

Concur is a Javascript UI Framework based on Async Generators.

It is a port to Javascript of [Concur for Haskell](https://github.com/ajnsit/concur) and [Concur for Purescript](https://github.com/ajnsit/purescript-concur), and is the first version of Concur for an imperative language.

## The Elevator Pitch

Concur can be thought of as a layer on top of React components. It helps you get rid of unprincipled event handlers and mutable state, and lets you build structured and composable abstractions. The primary mechanism for this is composition of components **in time**™.

To learn more, continue to the [Quick Introduction](/#user-content-quick-introduction) section below.

A discussion of Concur concepts can also be found in the [Documentation for the Haskell/Purescript versions](https://github.com/ajnsit/concur-documentation/blob/master/README.md). This obviously uses Haskell/Purescript syntax and semantics, but many of the concepts will apply to the JS version.

## Sample Concur Component

```javascript
const HelloWorld = <div>
  <h1>Concur JS Hello World</h1>
  {forever(async function*() {
    yield* <button onClick>Click me</button>
    yield* <div>
      <span>Hello Concur!</span>
      <button onClick>Restart?</button>
    </div>
  })}
</div>

// You can directly render a widget using `renderWidget`.
renderWidget(HelloWorld)('root');

// Or you can also convert a widget to a React element by wrapping it in <Concur></Concur> tags
// (It needs to be wrapped inside a function due to technical limitations).
ReactDOM.render(<Concur>{() => HelloWorld}</Concur>, document.getElementById('root'));
```

You can see this example run here - https://ajnsit.github.io/concur-js/.

## Usage

### Clone repo

> git clone https://github.com/ajnsit/concur-js.git

### Run Dev Server

> yarn

> yarn start

### Build production artifacts

> yarn build


## Quick Introduction

### Hello World

Concur-js uses babel's [plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) to allow using JSX directly. Any JSX snippet is also a valid Concur Component.

E.g. Hello World -

```jsx
<span>Hello World</span>
```

Or as a button -

```jsx
<button onClick={fireMissiles}>Hello World</button>
```

If you want two buttons together -

```jsx
<div>
  <button onClick={fireMissiles}>Click Me</button>
  <button onClick={fireMissiles}>Or Me</button>
</div>
```

### Parameterised Components

You can also take parameters by using plain Javascript functions. Unlike what's common in React and JSX world, you should avoid shoe-horning component parameters into HTML props (though you still can).

```javascript
// A parameterised component
function(label) {
  return <button>{label}<button>
}
```

### Peeling back the curtain

Under the hood, Concur components are [Async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) [Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) which yield React Elements (we call this react element the `view` of the concur component).

So a component `<div>Hello</div>` is equivalent to -

```javascript
async function* () {
  yield React.createElement('div', 'Hello')
}()
```

Note how we also *invoked* the function by adding parens `()`. This is because in Javascript an `Async Generator Function` has to be executed to return an `Async Generator`.

Also, Concur components can also have **return values**. So a widget with a return value of `42` will be something like this -

```javascript
async function*() {
  yield <some view>
  ...
  return 42
}
```

A very handy ES2015 feature - **`yield*`** - lets us temporarily cede control to another sub-component from within a component -

```javascript
const divText = async function* (str) {
  yield React.createElement('div', str)
  return 21
}

// Now we can use divText in another component
const myComponent = async function*() {
  const x = yield* divText('Hello')
  return 21+x
}()
```

You can see how the return value of the sub-component `divText` can be accessed as the return value of the `yield*` call in the calling component.


### Event Handling

Just a couple more things to understand before we come to the *raison d'être* for Concur - composing components in time.

We need to understand the event handing model for Concur widgets.

We discussed previously how a Concur component `yield`s a view, and `return`s a final value. However AsyncGenerators in Javascript can `yield` multiple times. So what does it mean to yield views multiple times?

In ES Generator terms, yielding means ceding control to an outer "driver" function which gets the yielded value, processes it somehow, and eventually (if at all) continues the remaining generator computation by passing it a value back.

**==== Now here is the secret sauce ====**

Every time a Concur component yields a view, it expects that the view will be populated in some UI. And after some time, and event handler within the view is going to fire, and the outer driver function (which is internal to Concur) will *return the value which was passed to the event handler, back to the component*, and the component can then resume processing. For example, the component can construct a different view and yield that, or it can return a final value and end.

You can use regular JSX event handling props to indicate to Concur which events you want to handle. *And you don't provide a event handler itself, since Concur handles that for you.* If you are using JSX syntax you can just leave out the `={handler}` part. E.g. `<button onClick>label</button>`. If you are using `React.createElement` you can pass `true` instead of a handler. E.g. `React.createElement('button', {onClick:true}, label)`.

So let's use all that we've learnt to create a counter button component that shows the number of time it's been clicked -

```javascript
const counter = async function* () {
  let count = 0
  while(true) {
    yield React.createElement('button', {onClick:true}, count)
    count = count + 1
  }
}
```

Here, we use a regular local mutable variable `count` (declared with `let`) as our state. Then we forever `yield` the `button` element with an `onClick` handler, and the `count` as the button label. Every time the `yield` returns (which will only be if the button was clicked, since that's the only handler we attached) we increment the count and loop. This results in yielding an updated button view with an incremented label. Thanks to the magic of React's virtual-dom, the actual button is updated efficiently in place on the HTML page.

Take a moment to bask in the fact that you created a complete functional component, with a very clear update flow, and a fully local state without using any lifecycle methods or even without any magic inbuilt functionality (like the *useState hook* recently added to React), in only a few lines of very transparent code.

### Handling multiple events

Note that you can nest dom elements in the view arbitrarily, and you can attach any number of event handlers anywhere deep in the dom tree. The entire component will return whenever any of the handlers are invoked.

Then how can you tell which event handler on which dom element was invoked? You can modify the value returned by the event handler by attaching a modifier function to the event handling prop. You need to wrap the modified function inside `mapProp`.

For example, the following component will display 100 buttons and return the index of the button which is clicked. Assume here `range` is a function which returns an array with all the numbers between the upper and lower limits supplied. As you can see, we use `mapProp` to ignore the supplied event, and return the index of the button instead.

```javascript
<div>
  { range(1,100).map(function(index) {
      return <div>
        <button onClick={mapProp(()=>index}>{index}</button>
        </div>
    })
  }
</div>
```

### Composing Concur Widgets In Time

Finally, as promised, the *raison d'être*. **Drum Roll..**

Well actually, if the previous section made sense to you, you already understand the concept of composing widgets in time. Every single `yield` statement is conceptually a separate widget where the return value is the return value of the `onClick` handler. You can reify it to an actual component by wrapping it into an async generator function.

So a button component which returns whenever it's clicked -

```javascript
const button = async function* (label) {
  return yield React.createElement('button', {onClick:true}, label)
}
```

Note how we immediately returned the value yielded by the event handler. So the return value of the component is the value passed to the event handler (which is usually the JS event object). This component only lasts as long as the button remains unclicked.

Now we can use it to re-create our `counter` component from before.

```javascript
const counter = async function* () {
  let count = 0
  while(true) {
    yield* button(count)
    count = count + 1
  }
}
```

Note how instead of `yield`ing a React element view, we are now `yield*`ing an actual component ('button`). Effectively we have now composed a never ending sequence of buttons with forever incrementing labels. And that's composing components in time!

You can do pretty fancy things with this scheme. And you can (and are encouraged to) go wild with using functions for abstraction.

For example, it's fairly common to repeatedly invoke a component with modified state as we did in the counter example. So we can abstract it out as a higher order component -

```javascript
const stateLoop = async function*(initState, component) {
  let state = initState
  while(true) {
    state = yield* component(state)
  }
}
```

Now our counter example can be written very succintly -

```javascript
const counter = stateLoop(0, (count) => <button onClick={mapProp(()=>count+1)}></button>)
```

How about creating a counter component with up, down, and reset buttons -

```javascript
const upDownResetCounter = stateLoop(0, (count) =>
  <div>
    <div>The current count is {count}</div>
    <div>
      <button onClick={mapProp(() => count+1)}>Increment</button>
      <button onClick={mapProp(() => count-1)}>Decrement</button>
      <button onClick={mapProp(() => 0)}>Reset</button>
    </div>
  </div>)
```

That's it for now. Play around with it. You will discover that these handful of concepts go a *long* way, and can be used to create even large UIs in a straightforward and clear manner.
