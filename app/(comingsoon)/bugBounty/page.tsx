import ComingSoon from '@/components/comingsoon'
import React from 'react'

type Props = {}

const BugBounty = (props: Props) => {
  return (
    <div className="py-4 px-5 w-full h-full flex flex-col gap-4">
      <ComingSoon />
    </div>
  )
}

export default BugBounty