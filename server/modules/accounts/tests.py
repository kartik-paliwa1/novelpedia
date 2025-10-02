from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date
from unittest.mock import patch

User = get_user_model()

#  Unit tests for the accounts app.

class UserModelTests(TestCase):
    """Test the custom User model"""
    
    def setUp(self):
        self.user_data = {
            'name': 'testuser',
            'email': 'test@example.com',
            'dob': date(1990, 1, 1),
            'gender': 'M',
            'password': 'testpass123'
        }
    
    def test_create_user_success(self):
        """Test creating a user with valid data"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.name, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertEqual(user.role, 'reader')  # default role
        self.assertEqual(user.user_status, 'normal')  # default status
    
    def test_create_user_without_name_fails(self):
        """Test creating user without name raises TypeError"""
        user_data_no_name = self.user_data.copy()
        del user_data_no_name['name']
        with self.assertRaises(TypeError):
            User.objects.create_user(**user_data_no_name)
    
    def test_create_user_without_email_fails(self):
        """Test creating user without email raises TypeError"""
        user_data_no_email = self.user_data.copy()
        del user_data_no_email['email']
        with self.assertRaises(TypeError):
            User.objects.create_user(**user_data_no_email)
    
    def test_create_superuser_success(self):
        """Test creating a superuser"""
        
        user = User.objects.create_superuser(
            name=self.user_data['name'],
            email=self.user_data['email'],
            dob=self.user_data['dob'],
            gender=self.user_data['gender'],
            password=self.user_data['password']
        )
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
    
    def test_user_str_method(self):
        """Test user string representation"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), 'testuser')

class AuthBackendTests(TestCase):
    """Test the custom authentication backend"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            name='testuser',
            email='test@example.com',
            dob=date(1990, 1, 1),
            gender='M',
            password='testpass123'
        )
    
    def test_authenticate_with_name(self):
        """Test authentication using username"""
        from accounts.auth_backends import NameOrEmailBackend
        backend = NameOrEmailBackend()
        user = backend.authenticate(None, username='testuser', password='testpass123')
        self.assertEqual(user, self.user)
    
    def test_authenticate_with_email(self):
        """Test authentication using email"""
        from accounts.auth_backends import NameOrEmailBackend
        backend = NameOrEmailBackend()
        user = backend.authenticate(None, username='test@example.com', password='testpass123')
        self.assertEqual(user, self.user)
    
    def test_authenticate_with_wrong_password(self):
        """Test authentication with wrong password fails"""
        from accounts.auth_backends import NameOrEmailBackend
        backend = NameOrEmailBackend()
        user = backend.authenticate(None, username='testuser', password='wrongpass')
        self.assertIsNone(user)

class RegisterViewTests(APITestCase):
    """Test user registration endpoint"""
    
    def setUp(self):
        self.register_url = reverse('register')
        self.valid_data = {
            'name': 'testuser',
            'email': 'test@example.com',
            'dob': '1990-01-01',
            'gender': 'M',
            'password': 'testpass123'
        }
    
    def test_register_user_success(self):
        """Test successful user registration"""
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(name='testuser').exists())
    
    def test_register_duplicate_name_fails(self):
        """Test registration with duplicate name fails"""
        User.objects.create_user(**{
            'name': 'testuser',
            'email': 'existing@example.com',
            'dob': date(1990, 1, 1),
            'gender': 'M',
            'password': 'pass123'
        })
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_duplicate_email_fails(self):
        """Test registration with duplicate email fails"""
        User.objects.create_user(**{
            'name': 'existinguser',
            'email': 'test@example.com',
            'dob': date(1990, 1, 1),
            'gender': 'M',
            'password': 'pass123'
        })
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_invalid_data_fails(self):
        """Test registration with invalid data fails"""
        invalid_data = self.valid_data.copy()
        del invalid_data['email']
        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class LoginViewTests(APITestCase):
    """Test user login endpoint"""
    
    def setUp(self):
        self.login_url = reverse('token_obtain_pair')
        self.user = User.objects.create_user(
            name='testuser',
            email='test@example.com',
            dob=date(1990, 1, 1),
            gender='M',
            password='testpass123'
        )
    
    def test_login_with_name_success(self):
        """Test successful login with username"""
        response = self.client.post(self.login_url, {
            'identifier': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
    
    def test_login_with_email_success(self):
        """Test successful login with email"""
        response = self.client.post(self.login_url, {
            'identifier': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_login_wrong_password_fails(self):
        """Test login with wrong password fails"""
        response = self.client.post(self.login_url, {
            'identifier': 'testuser',
            'password': 'wrongpass'
        })
        # The actual response might be 400 Bad Request instead of 401 Unauthorized
        # This depends on your serializer implementation
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED])
    
    def test_login_nonexistent_user_fails(self):
        """Test login with non-existent user fails"""
        response = self.client.post(self.login_url, {
            'identifier': 'nonexistent',
            'password': 'testpass123'
        })
        # The actual response might be 400 Bad Request instead of 401 Unauthorized
        # This depends on your serializer implementation
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED])

class ProfileViewTests(APITestCase):
    """Test user profile endpoints"""
    
    def setUp(self):
        self.profile_url = reverse('profile')
        self.user = User.objects.create_user(
            name='testuser',
            email='test@example.com',
            dob=date(1990, 1, 1),
            gender='M',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_get_profile_success(self):
        """Test getting user profile"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')
    
    def test_get_profile_unauthenticated_fails(self):
        """Test getting profile without authentication fails"""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_profile_put_success(self):
        """Test full profile update with PUT"""
        update_data = {
            'name': 'updateduser',
            'email': 'updated@example.com',
            'dob': '1991-01-01',
            'gender': 'F',
            'bio': 'Updated bio'
        }
        response = self.client.put(self.profile_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'Updated bio')
    
    def test_update_profile_patch_success(self):
        """Test partial profile update with PATCH"""
        update_data = {'bio': 'New bio only'}
        response = self.client.patch(self.profile_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'New bio only')

class LogoutViewTests(APITestCase):
    """Test user logout endpoint"""
    
    def setUp(self):
        self.logout_url = reverse('logout')
        self.user = User.objects.create_user(
            name='testuser',
            email='test@example.com',
            dob=date(1990, 1, 1),
            gender='M',
            password='testpass123'
        )
    
    def test_logout_authenticated_user_success(self):
        """Test successful logout"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Successfully logged out.')
    
    def test_logout_unauthenticated_fails(self):
        """Test logout without authentication fails"""
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class SerializerTests(TestCase):
    """Test serializers functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            name='testuser',
            email='test@example.com',
            dob=date(1990, 1, 1),
            gender='M',
            password='testpass123'
        )
    
    def test_user_serializer(self):
        """Test UserSerializer"""
        from accounts.serializers import UserSerializer
        serializer = UserSerializer(self.user)
        data = serializer.data
        
        self.assertEqual(data['name'], 'testuser')
        self.assertEqual(data['email'], 'test@example.com')
        self.assertIn('id', data)
        self.assertIn('role', data)
    
    def test_register_serializer_valid_data(self):
        """Test RegisterSerializer with valid data"""
        from accounts.serializers import RegisterSerializer
        data = {
            'name': 'newuser',
            'email': 'new@example.com',
            'dob': '1992-01-01',
            'gender': 'F',
            'password': 'newpass123'
        }
        serializer = RegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_register_serializer_create_user(self):
        """Test RegisterSerializer creates user correctly"""
        from accounts.serializers import RegisterSerializer
        data = {
            'name': 'newuser',
            'email': 'new@example.com',
            'dob': '1992-01-01',
            'gender': 'F',
            'password': 'newpass123'
        }
        serializer = RegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.name, 'newuser')
        self.assertTrue(user.check_password('newpass123'))