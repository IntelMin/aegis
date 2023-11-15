import TrendingCards from '@/components/bugBounty/TrendingCards'
import { NavbarWrapper } from '@/components/navbar/navbar'
import SecurityLeaderBoard from '@/components/security/SecurityLeaderBoard'
import Title from '@/components/title'
import React from 'react'

type Props = {}

const BugBounty = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="py-4 px-5 w-full h-full flex flex-col gap-4">
        <Title title="Bug Bounty Leaderboard" />
        <TrendingCards />
        <SecurityLeaderBoard />
      </div>
    </NavbarWrapper>
  )
}

export default BugBounty