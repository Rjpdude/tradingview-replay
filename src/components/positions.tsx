import React from 'react'
import Table from 'ink-table'
import { connect } from 'react-redux'
import { positions, Position } from '../reducers/positions'

interface Props {
  positions: Position[]
  viewMode: boolean
}

const PositionsComponent = (props: Props) => {
  const filteredPositions = props.positions.filter((p) => p.closed === props.viewMode)

  const data = filteredPositions.map((p) => ({
    Id: p.id,
    Type: p.type,
    Size: p.size,
    Open: p.open,
    [props.viewMode ? 'Close' : 'Current']: p.current,
    "P/L": p.pl
  }))

  return (
    <Table columns={["Id", "Type", "Size", "Open", props.viewMode ? 'Close' : 'Current', "P/L"]} data={data} />
  )
}

const mapStateToProps = (state: any) => ({
  positions: positions.mapState(state)
})

export default connect(mapStateToProps)(PositionsComponent)
