from django.contrib.auth import get_user_model
from django.test import TestCase

class UserTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(
            username='test_user', password='test_password')

    def test_user_created(self):
        #asserts the user dummy test input
        self.assertEqual(self.user.username, 'test_user')
        self.assertTrue(self.user.check_password('test_password'))