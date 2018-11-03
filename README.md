# Concur JS

Concur is a Javascript UI Framework based on Async Generators.

It is a port to Javascript of [Concur for Haskell](https://github.com/ajnsit/concur) and [Concur for Purescript](https://github.com/ajnsit/purescript-concur), and is the first version of Concur for an imperative language.

An introduction to Concur concepts can be found in the [Documentation for the Haskell/Purescript versions](https://github.com/ajnsit/concur-documentation/blob/master/README.md). This obviously uses Haskell/Purescript syntax, but many of the concepts will apply to the JS version.

## Hello World Example

```javascript
// Create a new widget
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

### Run Dev Server

> yarn

> yarn start

### Build production artifacts

> yarn build
