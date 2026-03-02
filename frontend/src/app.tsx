import { useState } from "react"
import { ResourceModal } from "@/components/ResourceModal"

function App() {
  const [open, setOpen] = useState(true) // true pra já abrir

  return (
    <div>
      <ResourceModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => console.log(data)}
      />
    </div>
  )
}

export default App