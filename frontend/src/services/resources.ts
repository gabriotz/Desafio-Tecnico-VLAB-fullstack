import api from './api'
import { Resource, ResourceCreate, ResourceUpdate } from '@/types/resources'

interface PaginatedResponse {
  items: Resource[]
  total: number
  page: number
  size: number
}

interface FetchResourcesParams {
  page?: number
  size?: number
  order_by?: string
  order_dir?: 'asc' | 'desc'
  search?: string
}

export const fetchResources = async (params: FetchResourcesParams): Promise<PaginatedResponse> => {
  const response = await api.get('/api/resources', { params })
  return response.data
}

export const createResource = async (data: ResourceCreate): Promise<Resource> => {
  const response = await api.post('/api/resources', data)
  return response.data
}

export const updateResource = async (id: number, data: ResourceUpdate): Promise<Resource> => {
  const response = await api.put(`/api/resources/${id}`, data)
  return response.data
}

export const deleteResource = async (id: number): Promise<void> => {
  await api.delete(`/api/resources/${id}`)
}

export const generateAISuggestion = async (title: string, type: string) => {
  const response = await api.post('/api/ai/suggest', { title, type })
  return response.data
}