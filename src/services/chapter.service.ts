interface ChapterReorderRequest {
  novelId: string
  chapterOrders: { id: string; order: number }[]
}

interface ChapterCreateRequest {
  novelId: string
  title: string
  content: string
}

interface ChapterUpdateRequest {
  title?: string
  content?: string
}

class ChapterService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  async reorderChapters(novelId: string, chapterOrders: { id: string; order: number }[]): Promise<void> {
    console.log('📡 Service: calling reorder API', { novelId, chapterOrders })
    
    const response = await fetch('/api/chapters/test-reorder', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        novelId,
        chapterOrders,
      }),
    })

    console.log('📡 Service: API response status', response.status)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder chapters' }))
      console.error('📡 Service: API error', error)
      throw new Error(error.message || 'Failed to reorder chapters')
    }
    
    console.log('📡 Service: reorder successful')
  }

  async getChapters(novelId: string) {
    const response = await fetch(`/api/chapters?novelId=${encodeURIComponent(novelId)}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch chapters' }))
      throw new Error(error.message || 'Failed to fetch chapters')
    }

    return response.json()
  }

  async createChapter(data: ChapterCreateRequest) {
    const response = await fetch('/api/chapters', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create chapter' }))
      throw new Error(error.message || 'Failed to create chapter')
    }

    return response.json()
  }

  async updateChapter(chapterId: string, data: ChapterUpdateRequest) {
    const response = await fetch(`/api/chapters/${chapterId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update chapter' }))
      throw new Error(error.message || 'Failed to update chapter')
    }

    return response.json()
  }

  async deleteChapter(chapterId: string) {
    const response = await fetch(`/api/chapters/${chapterId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete chapter' }))
      throw new Error(error.message || 'Failed to delete chapter')
    }

    return response.json()
  }
}

export const chapterService = new ChapterService()
export default chapterService