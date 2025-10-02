// Quick authentication check for your frontend
import { isLoggedIn, getAuthToken } from '@/utils/auth';

export const handleNovelAccess = async (slug: string, needsEdit = false) => {
  try {
    if (needsEdit) {
      // For editing, check authentication first
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        console.warn('User not authenticated, redirecting to login');
        window.location.href = '/login';
        return null;
      }
      
      // Use authenticated endpoint for editing
      const token = await getAuthToken();
      const response = await fetch(`/api/author/novels/${slug}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to access novel: ${response.status}`);
      }
      
      return response.json();
    } else {
      // For reading, use public endpoint
      const response = await fetch(`/api/novels/${slug}/`);
      if (!response.ok) {
        throw new Error(`Novel not found: ${response.status}`);
      }
      return response.json();
    }
  } catch (error) {
    console.error('Error accessing novel:', error);
    throw error;
  }
};

// Usage examples:
// const novel = await handleNovelAccess('my-new-novel', false); // Read-only
// const novel = await handleNovelAccess('my-new-novel', true);  // For editing