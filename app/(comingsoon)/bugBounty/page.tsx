import TrendingCards from '@/components/bugBounty/TrendingCards'
import { NavbarWrapper } from '@/components/navbar/navbar'
import SecurityLeaderBoard from '@/components/security/SecurityLeaderBoard'
import Title from '@/components/title'
import React from 'react'

type Props = {}

const BugBounty = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="flex flex-col w-full h-full gap-4 px-5 py-4">
        <Title title="Bug Bounties" />
        <TrendingCards />
        <SecurityLeaderBoard search />
      </div>
    </NavbarWrapper>
  )
}

export default BugBounty