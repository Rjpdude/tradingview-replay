import pod from 'redux-pods'
import { positions } from './positions'

export interface AccountState {
  balance: string
  equity: string
  pl: string
  wins: number
  biggestWin: number
  losses: number
  biggestLoss: number
  rate: string
}

export const account = pod<AccountState>({
  balance: '$0.00',
  equity: '$0.00',
  pl: '-',
  wins: 0,
  biggestWin: 0,
  losses: 0,
  biggestLoss: 0,
  rate: '0.0%'
})
.track(positions, (positionsState) => (accountState) => {
  let balance = 0
  let pl = 0
  let wins = 0
  let winTotal = 0
  let losses = 0
  let lossTotal = 0

  positionsState.forEach((position) => {
    const positionPl = parseFloat(position.pl.replace('$',''))

    if (position.closed === false) {
      pl += positionPl
    } else {
      if (positionPl > 0) {
        ++wins
        winTotal += positionPl
      } else {
        ++losses
        lossTotal -= positionPl
      }

      if (positionPl > accountState.biggestWin) {
        accountState.biggestWin = positionPl
      } else if (positionPl < accountState.biggestLoss) {
        accountState.biggestLoss = positionPl
      }

      balance += positionPl
    }
  })

  accountState.balance = `$${balance.toFixed(2)}`
  accountState.pl = `${pl > 0 ? '+' : ''}$${pl.toFixed(2)}`
  accountState.equity = `$${(balance + pl).toFixed(2)}`

  accountState.wins = wins
  accountState.losses = losses
  accountState.rate = `${((wins / (wins + losses) * 100) || 0).toFixed(1)}%`
})
.on({
  reset: () => (accountState) => {
    accountState.balance = '$0.00'
    accountState.equity = '$0.00'
    accountState.pl = '-'
    accountState.biggestWin = 0
    accountState.biggestLoss = 0
  }
})
