import React from 'react'
import { render, Box, Text } from 'ink'
import { Provider } from 'react-redux'
import { store } from './store'
import { configure } from './browser'
import Account from './components/account'
import Positions from './components/positions'
import Trade from './components/trade'

const Interface = () => {
	const [waiting, setWaiting] = React.useState(true)
	const [dots, setDots] = React.useState(1)
	const [symbol, setSymbol] = React.useState("")
	const [viewMode, setViewMode] = React.useState(false)

	React.useEffect(() => {
		const interval = setInterval(() => {
			setDots(curDots => curDots === 4 ? 1 : curDots + 1)
			configure().then((res) => {
				if (res) {
					setSymbol(res)
					setWaiting(false)
				}
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [waiting])

	const dotsOutput = React.useMemo(() => {
		return ".".repeat(dots)
	}, [dots])

  return waiting ? (
		<Text color="green" dimColor bold>Waiting for symbol initialization{dotsOutput}</Text>
	) : (
		<Provider store={store}>
			<Box marginBottom={1}>
				<Text color="green" dimColor bold>
					Initialized symbol {symbol} successfully.
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Account />
			</Box>
			
			{viewMode && (
				<Box marginBottom={1}>
					<Text color="orange" dimColor bold>
						Position history:
					</Text>
				</Box>
			)}

			<Box marginBottom={1}>
				<Positions viewMode={viewMode} />
			</Box>

			<Box>
				<Trade setViewMode={setViewMode} />
			</Box>
		</Provider>
	)
}

render(<Interface />)
