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

  return props.positions.length > 0 && (
    <Table data={data} />
  )
}

const mapStateToProps = (state: any) => ({
  positions: positions.mapState(state).filter((position) => !position.closed)
})

export default connect(mapStateToProps)(PositionsComponent)
