import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionList'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1>Popular Companion </h1>
      <section className="home-section">
        <CompanionCard
        id= "123"
        name="Neura the Brainy Explorer"
        topic="Neura Network of the Brain"
        subject="science"
        duration={45}
        color ="#ffda6e"
         />
         <CompanionCard
        id= "456"
        name="Countsy the Number Wizard"
        topic="Derivatives and Integrals"
        subject="math"
        duration={30}
        color ="#e5d0ff"
         />
          <CompanionCard
        id= "789"
        name="Verba the Vocabulary Builder"
        topic="Language"
        subject="English Literature"
        duration={20}
        color ="#BDE7FF"
         />
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