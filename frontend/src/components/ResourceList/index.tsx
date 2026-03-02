import { Resource } from "@/types/resources"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface ResourceListProps {
  resources: Resource[]
  onEdit: (resource: Resource) => void
  onDelete: (id: number) => void
  isLoading: boolean
}

export function ResourceList({resources, onEdit, onDelete, isLoading}: ResourceListProps){
    
    const typeBadgeColor = (type: string) => {
        if(type=== "Video") return "bg-blue-500"
        if (type === "PDF") return "bg-red-500"
        return "bg-green-500"
    }

    if (isLoading) {
        return <p className="text-center py-8 text-gray-500">Carregando...</p>
    }

    if (resources.length === 0) {
        return <p className="text-center py-8 text-gray-500">Nenhum recurso encontrado.</p>
    }

    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {resources.map((resource) =>(
                    <TableRow key={resource.id}>
                        
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        
                        <TableCell>
                            <Badge className={`${typeBadgeColor(resource.type)} text-white`}>
                                {resource.type}
                            </Badge>
                        </TableCell>

                        <TableCell className="text-gray-500 max-w-[150px] truncate">
                            {resource.url}
                        </TableCell>

                        <TableCell>
                            {new Date(resource.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>

                         <TableCell>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => onEdit(resource)}>
                                    <Pencil className="w-4 h-4" />
                                </Button>

                                <Button variant="ghost" size="icon" onClick={() => onDelete(resource.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                            </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

}

