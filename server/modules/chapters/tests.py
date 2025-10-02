from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from modules.novel.models import Novel
from .models import Chapter, Paragraph

User = get_user_model()

class ChapterAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(name='testuser', email='test@test.com', password='password123', dob='2000-01-01', gender='O')
        self.other_user = User.objects.create_user(name='otheruser', email='other@test.com', password='password123', dob='2000-01-01', gender='O')
        self.novel = Novel.objects.create(author=self.user, title='The Test Novel', synopsis='A novel for testing.')
        self.chapter1 = Chapter.objects.create(novel=self.novel, title='Chapter 1', number=1)
        self.p1 = Paragraph.objects.create(chapter=self.chapter1, text='This is the first paragraph.', order=0)
        self.p2 = Paragraph.objects.create(chapter=self.chapter1, text='This is the second.', order=1)

    def _get_jwt_token(self, identifier, password):
        response = self.client.post('/api/accounts/login/', {'identifier': identifier, 'password': password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data['access']

    def test_list_chapters_for_novel(self):
        """
        Ensure anyone can list the chapters for a given novel.
        """
        response = self.client.get(f'/api/novels/{self.novel.slug}/chapters/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Chapter 1')

    def test_create_chapter_for_novel_owner(self):
        """
        Ensure the novel owner can create a new chapter for their novel.
        """
        token = self._get_jwt_token('testuser', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        data = {'title': 'Chapter 2', 'number': 2}
        response = self.client.post(f'/api/novels/{self.novel.slug}/chapters/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.novel.chapters.count(), 2)

    def test_create_chapter_for_novel_not_owner(self):
        """
        Ensure a non-owner cannot create a chapter for a novel.
        """
        token = self._get_jwt_token('otheruser', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        data = {'title': 'Chapter 2', 'number': 2}
        response = self.client.post(f'/api/novels/{self.novel.slug}/chapters/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_chapter_stats(self):
        """
        Ensure anyone can get statistics for a chapter.
        """
        response = self.client.get(f'/api/chapters/{self.chapter1.pk}/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 5 words in p1, 4 in p2 = 9
        self.assertEqual(response.data['word_count'], 9)
        self.assertEqual(response.data['total_views'], 0)

    def test_autosave_chapter_owner(self):
        """
        Ensure the chapter owner can autosave changes.
        """
        token = self._get_jwt_token('testuser', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        data = {
            'title': 'Chapter 1 - Autosaved',
            'paragraphs': ['The content has been updated.', 'Completely new.']
        }
        response = self.client.post(f'/api/chapters/{self.chapter1.pk}/autosave/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.chapter1.refresh_from_db()
        self.assertEqual(self.chapter1.title, 'Chapter 1 - Autosaved')
        self.assertEqual(self.chapter1.paragraphs.count(), 2)
        self.assertEqual(self.chapter1.paragraphs.last().text, 'Completely new.')
        self.assertEqual(self.chapter1.word_count, 7)

    def test_autosave_chapter_not_owner(self):
        """
        Ensure a non-owner cannot autosave a chapter.
        """
        token = self._get_jwt_token('otheruser', 'password123')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        data = {'title': 'Trying to hijack'}
        response = self.client.post(f'/api/chapters/{self.chapter1.pk}/autosave/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
