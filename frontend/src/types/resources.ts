export type ResourceType = "Video" | "PDF" | "Link"

export interface Resource {
  id: number
  title: string
  description: string | null
  type: ResourceType
  url: string
  tags: string[]
  created_at: string
}

export type ResourceCreate = Omit<Resource, "id" | "created_at">
export type ResourceUpdate = Partial<ResourceCreate>