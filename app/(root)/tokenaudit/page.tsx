import TokenAuditorForm from '@/components/tokenauditor/token-auditor-form'
import React from 'react'

type Props = {}

const TokenAuditPage = (props: Props) => {
  return (
    <div className='tokenBg pt-[80px] w-full flex items-center justify-center'>
        <TokenAuditorForm />
    </div>
  )
}

export default TokenAuditPage