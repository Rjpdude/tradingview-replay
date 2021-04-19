import pod from 'redux-pods'
import { symbol, Symbol } from './symbol'

let ticker = 1

export interface Position {
  id: number
  type: 'Buy' | 'Sell'
  size: number
  open: string
  current: string
  pl: string
  closed: boolean
}

export const positions = pod<Position[]>([])
  .track(symbol, (symbolState) => (positions) => {
    positions.forEach((position) => {
      if (position.closed === false) {
        resolvePosition(symbolState, position)
      }
    })
  })
  .on({
    addPosition: (type: 'Buy' | 'Sell', size: number, symbolState: Symbol) => (positions) => {
      const position = {
        id: ++ticker,
        type,
        size,
        open: type === 'Buy' ? symbolState.buy : symbolState.sell,
        current: '',
        pl: '',
        closed: false,
      }

      resolvePosition(symbolState, position)
      positions.push(position)
    },

    closePosition: (id: number) => (positions) => {
      const position = positions.find((position) => position.id === id)

      if (position) {
        position.closed = true
      }
    },

    closeAll: () => (positions) => {
      positions.forEach((position) => {
        position.closed = true
      })
    }
  })

const resolvePosition = (symbolState: Symbol, position: Position) => {
  const current = position.type === 'Buy' 
    ? symbolState.sell 
    : symbolState.buy
  const pips = position.type === 'Buy' 
    ? (parseFloat(current) - parseFloat(position.open))
    : (parseFloat(position.open) - parseFloat(current))
  const pl = pips * position.size
  const prefix = pips > 0 ? '+' : ''

  position.current = current
  position.pl = `${prefix}$${pl.toFixed(2)}`
}
