import React from 'react'
import { connect } from 'react-redux'
import { account } from '../reducers/account'
import { symbol, Symbol } from '../reducers/symbol'
import { positions } from '../reducers/positions'
import { Text, Box } from 'ink'
import TextInput from 'ink-text-input'
import { nextTicker } from '../browser'

interface Props {
  symbol: Symbol
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}

const Trade = (props: Props) => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const resetQuery = () => {
    setQuery('')
    setLoading(false)
  }

  const onSubmit = () => {
    if (!loading) {
      const [command, ...args] = query.split(" ")
  
      if (command === "buy" || command === "sell") {
        if (props.symbol.price) {
          const size = parseFloat(args[0].replace('k', '000'))
          if (!isNaN(size)) {
            positions.addPosition(command === "buy" ? "Buy" : "Sell", size, props.symbol)
          }
        }
        resetQuery()
      }
      else if (command === "close") {
        if (args[0] === "all") {
          positions.closeAll()
        } else {
          positions.closePosition(!args[0] ? undefined : parseInt(args[0]))
        }
        resetQuery()
      }
      else if (command === "reset") {
        account.reset()
        positions.reset()
        resetQuery()
      }
      else if (command === "view") {
        props.setViewMode(mode => !mode)
        resetQuery()
      }
      else if (command === "") {
        setLoading(true)
  
        nextTicker()
          .finally(() => {
            resetQuery()
          })
          .catch(() => {})
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
