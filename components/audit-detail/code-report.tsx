import React from 'react'
import CodeViewer from './code-viewer'

type Props = {
  codeData: any
}

const CodeReport = ( { codeData }: Props) => {
  return (
    <div>
      <CodeViewer {...(codeData as any)} />
    </div>
  )
}

export default CodeReport