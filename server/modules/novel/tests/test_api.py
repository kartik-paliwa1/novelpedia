from datetime import date

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from modules.accounts.models import MyUser
from modules.chapters.models import Chapter
from modules.comments.models import Comment
from modules.novel.models import Novel
from modules.tags.models import Tag
from modules.genres.models import Genre
from modules.reviews.models import Review

class NovelAPITests(APITestCase):
    def setUp(self):
        self.author = MyUser.objects.create_user(
            name='author-user',
            email='author@example.com',
            dob=date(1990, 1, 1),
            gender='M',
            password='strongpassword123',
        )

    def test_get_novels_unauthenticated(self):
        """
        Ensure unauthenticated users can access the novel list endpoint.
        """
        url = reverse('novel-list')
        self.client.force_authenticate(user=None)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_author_can_create_novel_with_metadata(self):
        primary_genre = Genre.objects.create(name='Fantasy')
        secondary_genre = Genre.objects.create(name='Adventure')
        tag_one = Tag.objects.create(name='Magic')
        tag_two = Tag.objects.create(name='Epic')

        payload = {
            'title': 'Chronicles of the Emberfall',
            'synopsis': 'A sweeping saga of fire and fate.',
            'short_synopsis': 'A tale of embers and destiny.',
            'status': 'Draft',
            'target_audience': 'Young Adult',
            'language': 'English',
            'update_schedule': 'Weekly',
            'planned_length': 'Novel',
            'maturity_rating': 'PG-13',
            'primary_genre_id': primary_genre.id,
            'genre_ids': [primary_genre.id, secondary_genre.id],
            'tag_ids': [tag_one.id, tag_two.id],
        }

        self.client.force_authenticate(self.author)
        url = reverse('author-novel-list')
        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        body = response.json()
        self.assertEqual(body['title'], payload['title'])
        self.assertEqual(body['target_audience'], payload['target_audience'])
        self.assertEqual(body['language'], payload['language'])
        self.assertEqual(body['primary_genre']['id'], primary_genre.id)
        self.assertEqual({tag['id'] for tag in body['tags']}, {tag_one.id, tag_two.id})
        self.assertTrue(body['slug'])

    def test_author_can_update_novel_metadata(self):
        genre = Genre.objects.create(name='Sci-Fi')
        novel = Novel.objects.create(
            title='Starbound',
            synopsis='Space opera adventures',
            author=self.author,
            primary_genre=genre,
            language='English',
            target_audience='General',
        )

        update_payload = {
            'title': 'Starbound: Redux',
            'synopsis': 'Updated synopsis',
            'target_audience': 'Adult',
            'language': 'German',
            'update_schedule': 'Monthly',
            'planned_length': 'Epic',
        }

        self.client.force_authenticate(self.author)
        url = reverse('author-novel-detail', kwargs={'slug': novel.slug})
        response = self.client.patch(url, update_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()
        self.assertEqual(body['title'], update_payload['title'])
        self.assertEqual(body['language'], 'German')
        self.assertEqual(body['target_audience'], 'Adult')
        self.assertEqual(body['update_schedule'], 'Monthly')


class AuthorDashboardStatsAPITests(APITestCase):
    def setUp(self):
        self.author = MyUser.objects.create_user(
            name='author-user',
            email='author@example.com',
            dob=date(1990, 1, 1),
            gender='M',
            password='strongpassword123',
        )
        self.reader = MyUser.objects.create_user(
            name='reader-user',
            email='reader@example.com',
            dob=date(1992, 2, 2),
            gender='F',
            password='strongpassword123',
        )
        self.client.force_authenticate(self.author)

    def test_dashboard_stats_returns_aggregated_metrics(self):
        novel = Novel.objects.create(
            title='Mystery Novel',
            synopsis='A thrilling mystery.',
            author=self.author,
            views=120,
            likes=15,
            reviews_count=1,
            rating=4.5,
        )

        published_chapter = Chapter.objects.create(
            novel=novel,
            title='Chapter One',
            status='published',
            number=1,
            is_published=True,
            total_views=75,
            word_count=2500,
        )
        Chapter.objects.create(
            novel=novel,
            title='Chapter Two',
            status='draft',
            number=2,
            is_published=False,
            total_views=0,
            word_count=0,
        )

        Review.objects.create(
            novel=novel,
            user=self.reader,
            rating=4.5,
            comment='Loved it!',
        )

        recent_comment = Comment.objects.create(
            chapter=published_chapter,
            user=self.reader,
            text='Excited for more!',
        )
        # Ensure the engagement data is within the recent window
        Comment.objects.filter(pk=recent_comment.pk).update(
            created_at=timezone.now(),
            updated_at=timezone.now(),
        )

        url = reverse('author-dashboard-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertEqual(data['performance']['totalViews']['value'], 120)
        self.assertAlmostEqual(data['performance']['engagementRate']['value'], 1.7)
        self.assertEqual(data['performance']['chapterCompletion']['value'], 50.0)
        self.assertEqual(data['performance']['estimatedRevenue']['value'], 0.3)

        self.assertEqual(data['ratings']['totalReviews'], 1)
        self.assertAlmostEqual(data['ratings']['averageRating'], 4.5)
        self.assertEqual(data['ratings']['distribution']['4'], 1)
