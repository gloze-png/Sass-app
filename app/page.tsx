export const dynamic = "force-dynamic";
import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionList'
import CTA from '@/components/CTA'
import { getAllCompanions } from '@/lib/actions/companion.actions'
import { getSubjectColor } from '@/lib/utils'
import React from 'react'

const Page = async() => {
  const companions = await getAllCompanions({limit:3});
  const recentSessions = await getAllCompanions({limit:10});
  return (
    <main>
      <h1>Padii Popular Course</h1>
      <section className="home-section">
        { companions.map((companion)=>(
          <CompanionCard
          key={companion.id}
          {...companion}
          color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>

      <section className="home-section">
        <CompanionList
        title="Recently completed session"
        companions={recentSessions}
        classNames = "w-2/3 max-lg:w-full"/>
        
        <CTA />
      </section>
    </main>
  )
}

export default Page