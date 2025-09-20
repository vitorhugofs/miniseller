import './App.css'
import LeadsList from './components/LeadsList'

function App() {

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-start">
      <div className="w-full lg:max-w-[760px] lg:min-w-[760px] min-w-[95vw] max- px-4 py-8">
        <LeadsList />
      </div>
    </div>
  )
}

export default App
