import './App.css'
import LeadsList from './components/LeadsList'

function App() {

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-start">
      <div className="w-full max-w-[760px] sm:min-w-[760px] min-w-[100vw-10%] px-4 py-8">
        <LeadsList />
      </div>
    </div>
  )
}

export default App
