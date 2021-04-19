import React from 'react'
import { connect } from 'react-redux'
import { symbol, Symbol } from '../reducers/symbol'
import { positions } from '../reducers/positions'
import { Text, Box } from 'ink'
import TextInput from 'ink-text-input'
import { nextTicker, configure } from '../browser'

interface Props {
  symbol: Symbol
}

const Trade = (props: Props) => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const resetQuery = () => {
    setQuery('')
  }

  const onSubmit = () => {
    const [command, ...args] = query.split(" ")

    if (command === "setup") {
      setLoading(true)

      configure(parseInt(args[0])).finally(() => {
        resetQuery()
        setLoading(false)
      })
    }
    else if (command === "buy" || command === "sell") {
      const size = parseInt(args[0])
      positions.addPosition(command === "buy" ? "Buy" : "Sell", size, props.symbol)
      resetQuery()
    }
    else if (command === "close") {
      if (args[0] === "all") {
        positions.closeAll()
      } else {
        positions.closePosition(parseInt(args[0]))
      }
      resetQuery()
    }
    else if (command === "") {
      setLoading(true)

      nextTicker().finally(() => {
        setLoading(false)
      })
    }
  }

  return (
    <>
      <Box marginRight={1}>
        <Text>{loading ? 'Loading...' : 'Command:'}</Text>
      </Box>

      {!loading && <TextInput value={query} onChange={setQuery} onSubmit={onSubmit} />}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    symbol: symbol.mapState(state)
  }
}

export default connect(mapStateToProps)(Trade)
