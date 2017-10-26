let reducer = state => state
let listeners = new Set()

export let state

export let setReducer = (newReducer, preloadedState = newReducer()) => {
	reducer = newReducer
	state = preloadedState
}

export let dispatch = action => {
	state = reducer(state, action)
	for (let listener of listeners) {
		listener()
	}
}

export let subscribe = listener => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

export let combineReducers = reducers => (state = {}, action) => {
	let newState = {}
	for (let key in reducers) {
		newState[key] = reducers[key](state[key], action)
	}
	return newState
}

export let connect = (component, stateToData, dataToAction) => {
	if (stateToData) {
		let update = () => {
			let newData = stateToData(state)
			if (newData) {
				let oldData = component.get()
				let changed = false
				let diff = {}
				for (let key in newData) {
					if (oldData[key] !== newData[key]) {
						changed = true
						diff[key] = newData[key]
					}
				}
				if (changed) {
					component.set(diff)
				}
			}
		}
		update()
		component.on('destroy', subscribe(update))
	}
	if (dataToAction) {
		for (let key in dataToAction) {
			component.observe(key, value => dispatch(dataToAction[key](value)), { init: false })
		}
	}
}
