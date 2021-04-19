import React from 'react'
import { render, Box } from 'ink'
import { Provider } from 'react-redux'
import { store } from './store'
import Account from './components/account'
import Positions from './components/positions'
import Trade from './components/trade'

const Interface = () => {
  return (
		<Provider store={store}>
			<Box marginBottom={1}>
				<Account />
			</Box>
			
			<Box marginBottom={1}>
				<Positions />
			</Box>

			<Box>
				<Trade />
			</Box>
		</Provider>
	)
}

render(<Interface />)
