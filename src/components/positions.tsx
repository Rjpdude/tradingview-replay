import React from 'react'
import Table from 'ink-table'
import { connect } from 'react-redux'
import { positions, Position } from '../reducers/positions'

interface Props {
  positions: Position[]
}

const PositionsComponent = (props: Props) => {
  const data = props.positions.map((p) => ({
    Id: p.id,
    Type: p.type,
    Size: p.size,
    Open: p.open,
    Current: p.current,
    "P/L": p.pl
  }))

  return (
    <Table columns={["Id", "Type", "Size", "Open", "Current", "P/L"]} data={data} />
  )
}

const mapStateToProps = (state: any) => ({
  positions: positions.mapState(state).filter((position) => !position.closed)
})

export default connect(mapStateToProps)(PositionsComponent)
