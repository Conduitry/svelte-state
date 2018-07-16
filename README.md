# Svelte-State

A very small, simple library for managing state in a [Svelte](https://svelte.technology) app. Steals the most useful bits from `redux` and `react-redux` and presents them as a single library with no dependencies.

**Disclaimer:** Probably all that extra code in Redux is there for a reason, and probably one day I'll regret not just using the real Redux library.

## Concepts

As in Redux: entire app state represented as a plain object; changes in state represented by actions, which are also plain objects; state updated via a pure function that takes the current state and an action, and returns the new state.

Unlike actual Redux, here there is only one store, so you don't need to create it and then worry about how to get it to all of your components.

On the Svelte side, when you connect a component to the state store, you can do two things: map the whole application state to the state data for a given component; and map certain component state data changes back to actions to apply to the global state store.

## API

`state`

The current state from the store. Do not directly mutate this.

`setReducer(reducer, preloadedState = reducer())`

Sets the reducer to be used for the store. Typically, this would be called only once, at the beginning of your app. You may optionally pass a second argument to give the initial state; otherwise, the reducer will be called with no arguments, and that will be the initial state.

`dispatch(action)`

Dispatches the given action, updates the state accordingly, and calls any subscribed listeners (see below).

`subscribe(listener)`

Subscribes a new listener to state changes. This listener will be called (with no arguments) when the state updates. You need to check the `state` yourself, and you need to decide whether the state change is something that's relevant to this listener. Remember that, because of the pure nature of the reducer function, it's safe to use `===` to compare old and new values, even on objects and arrays.

Returns a function to call to unsubscribe the listener.

`combineReducers(reducers)`

Given an object whose values are reducers, returns a single reducer function which runs each reducer on the value for the corresponding key on the state.

`connect(component, stateToData, dataToAction)`

Connects a `component` to the state. Both `stateToData` and `dataToAction` are optional. If `stateToData` is passed, it should be a function that takes the current app state and returns an object of keys-values to set as data on this component. If `dataToAction` is passed, it should be an object whose keys are component data keys to observe, and whose values are functions that turn the data value into an action to dispatch.

This should be called in the `oncreate` hook of a Svelte component. It will automatically unsubscribe from state changes when the component is destroyed.

## Usage

Combine reducers for parts of the state into the main, central reducer with `combineReducers`. Use `setReducer` assign the top-level reducer to the store.

Dispatch actions with `dispatch`, and manually subscribe to state changes with `subscribe`. Access the current state with `state`.

Call `connect` appropriately in the `oncreate` hook of your Svelte component. The first argument, `component`, should be `this`. Pass a `stateToData` if you want to automatically update component state when global state changes. Pass a `dataToAction` if you want to automatically dispatch actions when certain component state changes occur.

## License

Copyright (c) 2017 Conduitry

- [MIT](LICENSE)
