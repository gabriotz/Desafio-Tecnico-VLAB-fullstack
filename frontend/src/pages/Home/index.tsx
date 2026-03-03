import { useState, useEffect } from "react"
import { Resource, ResourceCreate, ResourceUpdate } from "@/types/resources"
import { fetchResources, createResource, updateResource, deleteResource } from "@/services/resources"
import { ResourceList } from "@/components/ResourceList"
import { ResourceModal } from "@/components/ResourceModal"
import { ResourcePagination } from "@/components/ResourcePagination"
import { SearchBar } from "@/components/SearchBar"
import { SortControls } from "@/components/SortControls"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 5

export function Home() {
  const [resources, setResources] = useState<Resource[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [orderBy, setOrderBy] = useState("created_at")
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const loadResources = async () => {
    setIsLoading(true)
    try {
      const data = await fetchResources({
        page: currentPage,
        size: PAGE_SIZE,
        order_by: orderBy,
        order_dir: orderDir,
        search: search || undefined,
      })
      setResources(data.items)
      setTotal(data.total)
    } catch (error) {
      console.error("Falha em carregar recursos", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [currentPage, orderBy, orderDir, search])

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    await deleteResource(id)
    loadResources()
  }

  const handleSubmit = async (data: ResourceCreate) => {
    if (selectedResource) {
      await updateResource(selectedResource.id, data as ResourceUpdate)
    } else {
      await createResource(data)
    }
    setModalOpen(false)
    setSelectedResource(null)
    loadResources()
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleOrderDirChange = () => {
    setOrderDir((prev) => prev === "asc" ? "desc" : "asc")
    setCurrentPage(1)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <SearchBar value={search} onChange={handleSearchChange} />
          <SortControls
            orderBy={orderBy}
            orderDir={orderDir}
            onOrderByChange={(v) => { setOrderBy(v); setCurrentPage(1) }}
            onOrderDirChange={handleOrderDirChange}
          />
        </div>

        <Button onClick={() => { setSelectedResource(null); setModalOpen(true) }}>
          + Novo Recurso
        </Button>
      </div>

      <ResourceList
        resources={resources}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Mostrando {Math.min((currentPage - 1) * PAGE_SIZE + 1, total)}–{Math.min(currentPage * PAGE_SIZE, total)} de {total} recursos
        </p>
        <ResourcePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ResourceModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedResource(null) }}
        resource={selectedResource}
        onSubmit={handleSubmit}
      />
    </div>
  )
}