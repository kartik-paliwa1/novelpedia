from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Novel

User = get_user_model()

class NovelAPITests(APITestCase):
    def setUp(self):
        # Create two users
        self.user1 = User.objects.create_user(name='user1', email='user1@test.com', password='password123', dob='2000-01-01', gender='O')
        self.user2 = User.objects.create_user(name='user2', email='user2@test.com', password='password123', dob='2000-01-01', gender='O')

        # Create a novel for user1
        self.novel1 = Novel.objects.create(author=self.user1, title='My First Novel', synopsis='A great story.')

    def _get_jwt_token(self, identifier, password):
        response = self.client.post('/api/accounts/login/', {'identifier': identifier, 'password': password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data['access']

    def test_list_novels_unauthenticated(self):
        """
        Ensure unauthenticated users can list novels.
        """
        response = self.client.get('/api/novels/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_novel_authenticated(self):
        """
        Ensure authenticated users can create a novel.
        """
        token = self._get_jwt_token('user2', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        data = {'title': 'A New Adventure', 'synopsis': 'Another great story.'}
        response = self.client.post('/api/novels/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Novel.objects.count(), 2)
        # Check if slug was created automatically
        new_novel = Novel.objects.get(title='A New Adventure')
        self.assertEqual(new_novel.slug, 'a-new-adventure')

    def test_create_novel_unauthenticated(self):
        """
        Ensure unauthenticated users cannot create a novel.
        """
        data = {'title': 'Unauthorized Novel', 'synopsis': 'Should not be created.'}
        response = self.client.post('/api/novels/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_novel_by_slug(self):
        """
        Ensure anyone can retrieve a novel by its slug.
        """
        response = self.client.get(f'/api/novels/{self.novel1.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.novel1.title)

    def test_update_novel_owner(self):
        """
        Ensure the owner of a novel can update it.
        """
        token = self._get_jwt_token('user1', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        data = {'title': 'My First Novel - Updated'}
        response = self.client.put(f'/api/novels/{self.novel1.slug}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.novel1.refresh_from_db()
        self.assertEqual(self.novel1.title, 'My First Novel - Updated')

    def test_update_novel_not_owner(self):
        """
        Ensure a user who is not the owner cannot update a novel.
        """
        token = self._get_jwt_token('user2', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        data = {'title': 'Trying to hijack'}
        response = self.client.put(f'/api/novels/{self.novel1.slug}/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_novel_owner(self):
        """
        Ensure the owner of a novel can delete it.
        """
        token = self._get_jwt_token('user1', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.delete(f'/api/novels/{self.novel1.slug}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Novel.objects.count(), 0)

    def test_delete_novel_not_owner(self):
        """
        Ensure a user who is not the owner cannot delete a novel.
        """
        token = self._get_jwt_token('user2', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.delete(f'/api/novels/{self.novel1.slug}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Novel.objects.count(), 1)
