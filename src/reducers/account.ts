import pod from 'redux-pods'
import { positions } from './positions'

export interface AccountState {
  balance: string
  equity: string
  pl: string
}

export const account = pod<AccountState>({
  balance: '-',
  equity: '-',
  pl: '-',
})
.track(positions, (positionsState) => (accountState) => {
  let balance = 0
  let pl = 0

  positionsState.forEach((position) => {
    if (position.closed === false) {
      pl += parseFloat(position.pl.replace('$',''))
    } else {
      balance += parseFloat(position.pl.replace('$',''))
    }
  })

  accountState.balance = `$${balance.toFixed(2)}`
  accountState.pl = `${pl > 0 ? '+' : ''}$${pl.toFixed(2)}`
  accountState.equity = `$${(balance + pl).toFixed(2)}`
})
