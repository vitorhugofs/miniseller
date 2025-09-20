import LeadsList from './components/LeadsList'

function App() {

  return (
    <div className="bg-gray-800 flex justify-center items-center">
      <div className="w-full min-h-screen  lg:max-w-[760px] lg:min-w-[760px] min-w-[95vw] py-4">
        <LeadsList />
      </div>
    </div>
  )
}

export default App
