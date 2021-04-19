import React from 'react'
import { connect } from 'react-redux'
import { symbol, Symbol } from '../reducers/symbol'
import { positions } from '../reducers/positions'
import { Text, Box, Newline } from 'ink'
import TextInput from 'ink-text-input'
import { nextTicker } from '../browser'

interface Props {
  symbol: Symbol
}

const Trade = (props: Props) => {
  const [query, setQuery] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const resetQuery = () => {
    setQuery('')
    setError('')
    setLoading(false)
  }

  const onSubmit = () => {
    if (!loading) {
      const [command, ...args] = query.split(" ")
  
      if (command === "buy" || command === "sell") {
        if (props.symbol.price) {
          const size = parseInt(args[0])
          positions.addPosition(command === "buy" ? "Buy" : "Sell", size, props.symbol)
          resetQuery()
        } else {
          setQuery("")
          setError("Error - symbol price not yet set.")
        }
      }
      else if (command === "close") {
        if (args[0] === "all") {
          positions.closeAll()
        } else {
          positions.closePosition(!args[0] ? undefined : parseInt(args[0]))
        }
        resetQuery()
      }
      else if (command === "") {
        setLoading(true)
  
        nextTicker()
          .finally(() => {
            resetQuery()
          })
          .catch(() => {
            setError("Error loading next ticker. Try again.")
          })
      }
    }
  }

  return (
    <Box>
      <Box marginRight={1}>
        <Text>{loading ? 'Loading...' : 'Command:'}</Text>
      </Box>

      <TextInput value={query} onChange={setQuery} onSubmit={onSubmit} />
    </Box>
  )
}

const mapStateToProps = (state: any) => {
  return {
    symbol: symbol.mapState(state)
  }
}

export default connect(mapStateToProps)(Trade)
