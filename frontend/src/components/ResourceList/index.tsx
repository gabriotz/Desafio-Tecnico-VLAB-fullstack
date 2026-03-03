import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
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
    const [openId, setOpenId] = useState<number | null>(null)

    const toggleOpen = (id: number) => {
        setOpenId((prev) => prev === id ? null : id)
    }
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
                {resources.map((resource) => (
                    <Collapsible
                        key={resource.id}
                        open={openId === resource.id}
                        onOpenChange={() => toggleOpen(resource.id)}
                        asChild
                    >
                        <>
                        <TableRow className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-medium">
                            <CollapsibleTrigger className="flex items-center gap-2 text-left w-full">
                                <ChevronDown className={`w-4 h-4 transition-transform ${openId === resource.id ? "rotate-180" : ""}`} />
                                {resource.title}
                            </CollapsibleTrigger>
                            </TableCell>

                            <TableCell>
                                <Badge className={`${typeBadgeColor(resource.type)} text-white`}>
                                    {resource.type}
                                </Badge>
                            </TableCell>

                           <TableCell className="max-w-[150px]">
                            <a
                                href={resource.url.startsWith("http") ? resource.url : `https://${resource.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline truncate block text-sm"
                            >
                                {resource.url}
                            </a>
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

                        <CollapsibleContent asChild>
                            <TableRow className="bg-gray-50">
                            <TableCell colSpan={5} className="py-3 px-6">
                                <p className="text-sm text-gray-600 mb-2">
                                {resource.description || "Sem descrição"}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                {resource.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                                    {tag}
                                    </span>
                                ))}
                                </div>
                            </TableCell>
                            </TableRow>
                        </CollapsibleContent>
                        </>
                    </Collapsible>
                    ))}
            </TableBody>
        </Table>
    )

}

