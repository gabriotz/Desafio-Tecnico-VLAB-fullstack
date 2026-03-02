import {Resource, ResourceCreate, ResourceType} from "@/types/resources"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select,
        SelectTrigger,
        SelectContent,
        SelectGroup,
        SelectItem,
        SelectValue,
 } from "@/components/ui/select"
import { Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogFooter,
 } from "@/components/ui/dialog"

interface ResourceModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    resource?: Resource | null
    onSubmit: (data: ResourceCreate) => void
}

export function ResourceModal({isOpen, onClose, resource = null, onSubmit}: ResourceModalProps){
    const isEditing = resource !== null
    const [title,setTitle] = useState(resource?.title?? "")
    const [type, setType] = useState<ResourceType>(resource?.type ?? "Video")
    const [url,setUrl] = useState(resource?.url?? "")
    const [description,setDescription] = useState(resource?.description?? "")
    const [tags, setTags] = useState<string[]>(resource?.tags ?? [])

    const [tagInput, setTagInput] = useState("")

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
        e.preventDefault()
        setTags([...tags, tagInput.trim()])
        setTagInput("")
    }
    }
    
    const handleSubmit = () => {
        if (!title.trim() || !url.trim()) return
        onSubmit({ title, type, url, description, tags })
        onClose(false)
    }
    useEffect(() =>{
        if(resource){
            setTitle(resource.title)
            setType(resource.type)
            setUrl(resource.url)
            setDescription(resource.description ?? "")
            setTags([...resource.tags])
        } else{
            setTitle("")
            setType("Video")
            setUrl("")
            setDescription("")
            setTags([])
        }
    }, [resource,isOpen])
return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
                <DialogTitle>
                    {isEditing? "Editar Recurso" : "Novo Recurso"}
                </DialogTitle>
            </DialogHeader>

            <div>

                <p>Título*</p>
                <Input 
                placeholder="Digite o título" 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                >
                </Input>
                
                <p>Tipo*</p>
                <Select value={type} onValueChange={(v) => setType(v as ResourceType)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o Tipo"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="Link">LINK</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                
                <Button 
                type="button"
                variant="outline"
                className="bg-gray-200 w-full flex justify-center ">
                    Gere com IA 
                </Button>

                <p>URL*</p>
                <Input 
                placeholder="Https://" 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                >
                </Input>

                <p>Descrição</p>
                <Input 
                placeholder="Digite uma breve descrição" 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                >
                </Input>

                <p>Tags</p>
                <Input
                placeholder="Digite uma tag e pressione Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                />

                {/* mostra as tags adicionadas */}
                <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {tag}
                    </span>
                ))}
                </div>

            </div>

            <DialogFooter>
            <Button variant="outline" onClick={() => onClose(false)}>
                Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || !url.trim()}>
                {isEditing ? "Salvar" : "Criar Recurso"}
            </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
}
