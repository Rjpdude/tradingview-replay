import pod from 'redux-pods'

export interface Symbol {
  name: string
  spread: number
  price: string
  buy: string
  sell: string
}

export const symbol = pod<Symbol>({
  name: '',
  spread: 0,
  price: '',
  buy: '',
  sell: '',
}).on({
  setName: (name: string) => (state) => {
    state.name = name
  },
  setSpread: (spread: number) => (state) => {
    state.spread = spread
  },
  setPrice: (price: string) => (state) => {
    const decimalLength = price.split('.')[1].length
    const spread = state.spread / Math.pow(10, decimalLength) / 2

    state.price = price
    state.buy = (parseFloat(price) + spread).toFixed(decimalLength)
    state.sell = (parseFloat(price) - spread).toFixed(decimalLength)
  }
})
