from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class UserTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(
            username='test_user', password='test_password')

    def test_user_created(self):
        """Test that the user is created successfully with the correct username and password."""
        self.assertEqual(self.user.username, 'test_user', "Username does not match the expected value.")
        self.assertTrue(self.user.check_password('test_password'), "Password check failed for the created user.")
        
    def test_incorrect_password(self):
        """Test that the user cannot be authenticated with an incorrect password."""
        self.assertFalse(self.user.check_password('wrong_password'), "Password check should fail for incorrect passwords.")
    
    def test_duplicate_username(self):
        """Test that creating a user with a duplicate username raises an error."""
        with self.assertRaises(Exception):
            get_user_model().objects.create_user(username='test_user', password='another_password')

    def test_api_create_user(self):
        """Test creating a new user via the API."""
        client = APIClient()
        response = client.post('/api/users/', {
            'username': 'new_user',
            'password': 'new_password'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(get_user_model().objects.filter(username='new_user').exists(), True)
    
    def test_api_duplicate_user(self):
        """Test that attempting to create a duplicate user via the API returns an error."""
        client = APIClient()
        response = client.post('/api/users/', {
            'username': 'test_user',
            'password': 'some_password'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
