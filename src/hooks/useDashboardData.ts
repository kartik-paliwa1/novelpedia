"use client"

import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { DashboardStats } from '@/types/dashboard'
import { Project } from '@/types/editor'

interface DashboardData {
  stats: DashboardStats | null
  novels: Project[] | null
  loading: boolean
  error: string | null
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    novels: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Fetch dashboard stats and novels in parallel
        const [statsResponse, novelsResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getMyNovels()
        ])

        // Fetch chapter counts and latest published date for each novel
        const novelsWithChapterCounts = await Promise.all(
          (novelsResponse.data || []).map(async (novel) => {
            try {
              const chaptersResponse = await api.getChapters(novel.slug)
              const chapters = Array.isArray(chaptersResponse.data) ? chaptersResponse.data : []
              const chapterCount = chapters.length
              
              // Find the latest published chapter date
              const publishedChapters = chapters.filter(ch => ch.status === 'published' && ch.publishedAt)
              const latestPublishedDate = publishedChapters.length > 0
                ? publishedChapters
                    .map(ch => new Date(ch.publishedAt!).getTime())
                    .sort((a, b) => b - a)[0] // Sort descending, get the most recent
                : null
              
              return {
                ...novel,
                chapters: chapterCount,
                lastUpdated: latestPublishedDate 
                  ? new Date(latestPublishedDate).toISOString() 
                  : novel.lastUpdated
              }
            } catch (error) {
              console.error(`Failed to fetch chapters for ${novel.slug}:`, error)
              return novel // Return novel without chapter count if fetch fails
            }
          })
        )

        setData({
          stats: statsResponse.data,
          novels: novelsWithChapterCounts,
          loading: false,
          error: null
        })
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch dashboard data'
        }))
      }
    }

    fetchDashboardData()
  }, [])

  const refetch = () => {
    setData(prev => ({ ...prev, loading: true, error: null }))
    // Re-run the effect
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, novelsResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getMyNovels()
        ])

        // Fetch chapter counts and latest published date for each novel
        const novelsWithChapterCounts = await Promise.all(
          (novelsResponse.data || []).map(async (novel) => {
            try {
              const chaptersResponse = await api.getChapters(novel.slug)
              const chapters = Array.isArray(chaptersResponse.data) ? chaptersResponse.data : []
              const chapterCount = chapters.length
              
              // Find the latest published chapter date
              const publishedChapters = chapters.filter(ch => ch.status === 'published' && ch.publishedAt)
              const latestPublishedDate = publishedChapters.length > 0
                ? publishedChapters
                    .map(ch => new Date(ch.publishedAt!).getTime())
                    .sort((a, b) => b - a)[0] // Sort descending, get the most recent
                : null
              
              return {
                ...novel,
                chapters: chapterCount,
                lastUpdated: latestPublishedDate 
                  ? new Date(latestPublishedDate).toISOString() 
                  : novel.lastUpdated
              }
            } catch (error) {
              console.error(`Failed to fetch chapters for ${novel.slug}:`, error)
              return novel // Return novel without chapter count if fetch fails
            }
          })
        )

        setData({
          stats: statsResponse.data,
          novels: novelsWithChapterCounts,
          loading: false,
          error: null
        })
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch dashboard data'
        }))
      }
    }

    fetchDashboardData()
  }

  return {
    ...data,
    refetch
  }
}