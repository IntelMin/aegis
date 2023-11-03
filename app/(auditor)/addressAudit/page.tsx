import AddressAuditForm from '@/components/addressAuditForm'
import Title from '@/components/title'
import React from 'react'

type Props = {}

const AddressAudit = (props: Props) => {
  return (
    <div className='py-4 px-5 w-full h-full flex flex-col gap-4'>
      <Title title="Address Auditor" />
      <AddressAuditForm />
    </div>
  )
}

export default AddressAudit