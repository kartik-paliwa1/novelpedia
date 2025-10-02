"use client"

import { useState, useEffect } from 'react'
import { api, Notification } from '@/services/api'

interface NotificationsData {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

export function useNotifications() {
  const [data, setData] = useState<NotificationsData>({
    notifications: [],
    unreadCount: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        const response = await api.getNotifications({ limit: 10 })
        const notifications = response.data
        const unreadCount = notifications.filter(n => !n.read).length

        setData({
          notifications,
          unreadCount,
          loading: false,
          error: null
        })
      } catch (error: any) {
        console.error('Failed to fetch notifications:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch notifications'
        }))
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (notificationId: string | number) => {
    try {
      await api.markNotificationRead(notificationId)
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead()
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }))
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  return {
    ...data,
    markAsRead,
    markAllAsRead
  }
}