import CompanionCard from "@/components/CompanionCard";
import { getAllCompanions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;
  const subject =filters.subject ? filters.subject : '';
   const topic =filters.topic ? filters.topic : '';
   const companion = await getAllCompanions({ subject, topic });
  console.log(companion);
  
  // Render the companions library page with the fetched companions

  return (
    <main>
      <section className=" flex justify-between gap-4 max-sm:flex-col">
        <h1>Padii Library</h1>
        <div className="flex gap-4">Filters</div>
      </section>
      <section className="companions-grid">
        {companion.map((companion) => (
          <CompanionCard key={companion.id} 
          {...companion}
          color= {getSubjectColor(companion.subject)} />
        ))}
      </section>
      
    </main>
  )
}

export default CompanionsLibrary
