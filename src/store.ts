import { createStore, combineReducers } from 'redux'
import pod from 'redux-pods'
import { symbol } from './reducers/symbol'
import { account } from './reducers/account'
import { positions } from './reducers/positions'

const rootReducer = combineReducers({
  symbol,
  account,
  positions,
})

export const store = createStore(rootReducer, pod.enhancer())
