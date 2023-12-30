import React from 'react'
import InheritanceGraph from './inheritance-graph'

type Props = {
  dependencyData: any
}

const DependencyReport = ({ dependencyData }: Props) => {
  return (
    <div>
      <InheritanceGraph data={dependencyData} />
    </div>
  )
}

export default DependencyReport