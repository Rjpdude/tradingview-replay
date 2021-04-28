import React from 'react'
import Table from 'ink-table'
import { connect } from 'react-redux'
import { account, AccountState } from '../reducers/account'

interface Props {
  accountState: AccountState
}

const StatsComponent = (props: Props) => {
  return (
    <Table
      data={[
        {
          "Win Rate": props.accountState.rate,
          "Win/Loss": `${props.accountState.wins} / ${props.accountState.losses}`,
          "Max. Win": `$${props.accountState.biggestWin}`,
          "Max. Loss": `$${props.accountState.biggestLoss}`
        }
      ]}
    />
  )
}

const mapStateToProps = (state: any) => ({
  accountState: account.mapState(state)
})

export default connect(mapStateToProps)(StatsComponent)
