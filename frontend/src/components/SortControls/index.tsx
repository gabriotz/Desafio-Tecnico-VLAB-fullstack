import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SortControlsProps {
  orderBy: string
  orderDir: "asc" | "desc"
  onOrderByChange: (value: string) => void
  onOrderDirChange: () => void
}

export function SortControls({ orderBy, orderDir, onOrderByChange, onOrderDirChange }: SortControlsProps) {
  return (
    <div className="flex gap-2">
      <Select value={orderBy} onValueChange={onOrderByChange}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Criado em</SelectItem>
          <SelectItem value="title">Titulo</SelectItem>
          <SelectItem value="type">Tipo</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={onOrderDirChange}>
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    </div>
  )
}