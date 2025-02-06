# # tests.py
# from django.test import TestCase, RequestFactory
# from django.contrib.auth.models import User
# from django.urls import reverse
# from django.core.files.uploadedfile import SimpleUploadedFile
# from .models import Profile, Tournament, MatchHistory
# from .forms import CustomUserCreationForm
# import json

# class AuthTests(TestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(username='testuser', password='Testpass123!')
#         self.profile = Profile.objects.create(user=self.user, display_name='TestUser')
#         self.factory = RequestFactory()

#     # Registration Tests
#     def test_register_success(self):
#         data = {
#             'username': 'newuser',
#             'email': 'new@example.com',
#             'password1': 'ComplexPassword123!',
#             'password2': 'ComplexPassword123!',
#             'display_name': 'NewUser'
#         }
#         response = self.client.post(reverse('register'), json.dumps(data), content_type='application/json')
#         self.assertEqual(response.status_code, 200)
#         self.assertTrue(User.objects.filter(username='newuser').exists())

#     def test_register_duplicate_username(self):
#         data = {
#             'username': 'testuser',  # Already exists
#             'email': 'test@example.com',
#             'password1': 'Testpass123!',
#             'password2': 'Testpass123!',
#             'display_name': 'DuplicateUser'
#         }
#         response = self.client.post(reverse('register'), json.dumps(data), content_type='application/json')
#         self.assertEqual(response.status_code, 400)
#         self.assertIn('username', response.json()['errors'])

#     # Login/Logout Tests
#     def test_login_success(self):
#         data = {'username': 'testuser', 'password': 'Testpass123!'}
#         response = self.client.post(reverse('user_login'), json.dumps(data), content_type='application/json')
#         self.assertEqual(response.status_code, 200)
#         self.profile.refresh_from_db()
#         self.assertTrue(self.profile.online)

#     def test_logout_success(self):
#         self.client.login(username='testuser', password='Testpass123!')
#         response = self.client.post(reverse('user_logout'))
#         self.assertEqual(response.status_code, 200)
#         self.profile.refresh_from_db()
#         self.assertFalse(self.profile.online)

# class ProfileTests(TestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(username='testuser', password='Testpass123!')
#         self.profile = Profile.objects.create(user=self.user, display_name='TestUser')
#         self.client.login(username='testuser', password='Testpass123!')

#     def test_update_profile_success(self):
#         new_data = {'display_name': 'UpdatedUser'}
#         response = self.client.post(reverse('update_profile'), new_data)
#         self.assertEqual(response.status_code, 200)
#         self.profile.refresh_from_db()
#         self.assertEqual(self.profile.display_name, 'UpdatedUser')

#     def test__success(self):
#         friend = User.objects.create_user(username='frienduser', password='Testpass123!')
#         Profile.objects.create(user=friend, display_name='FriendUser')
#         response = self.client.post(reverse('add_friend'), {'friend_username': 'frienduser'})
#         self.assertEqual(response.status_code, 200)
#         self.assertIn(friend.profile, self.profile.friends.all())

# class MatchHistoryTests(TestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(username='testuser', password='Testpass123!')
#         self.opponent = User.objects.create_user(username='opponent', password='Testpass123!')
        
#         # Create profiles for both users
#         Profile.objects.create(user=self.user, display_name='TestUser')
#         Profile.objects.create(user=self.opponent, display_name='OpponentUser')
        
#         self.tournament = Tournament.objects.create(name='Test Tournament')
#         self.match = MatchHistory.objects.create(
#             user=self.user,
#             opponent=self.opponent,
#             result='win',
#             tournament=self.tournament
#         )
#         self.client.login(username='testuser', password='Testpass123!')

#     def test_get_match_history(self):
#         response = self.client.get(reverse('get_match_history'))
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(len(response.json()), 1)
#         self.assertEqual(response.json()[0]['result'], 'win')

# class FormTests(TestCase):
#     def test_valid_registration_form(self):
#         form_data = {
#             'username': 'newuser',
#             'email': 'new@example.com',
#             'password1': 'ComplexPassword123!',
#             'password2': 'ComplexPassword123!',
#             'display_name': 'NewUser'
#         }
#         form = CustomUserCreationForm(data=form_data)
#         self.assertTrue(form.is_valid())

#     def test_password_mismatch(self):
#         form_data = {
#             'username': 'newuser',
#             'email': 'new@example.com',
#             'password1': 'ComplexPassword123!',
#             'password2': 'DifferentPassword123!',
#             'display_name': 'NewUser'
#         }
#         form = CustomUserCreationForm(data=form_data)
#         self.assertFalse(form.is_valid())
#         self.assertIn('password2', form.errors)

# class ModelTests(TestCase):
#     def test_profile_creation(self):
#         user = User.objects.create_user(username='modeltest', password='Testpass123!')
#         profile = Profile.objects.create(user=user, display_name='ModelTest')
#         self.assertEqual(profile.user.username, 'modeltest')
#         self.assertEqual(profile.display_name, 'ModelTest')

#     def test_match_history_creation(self):
#         user = User.objects.create_user(username='player1', password='Testpass123!')
#         opponent = User.objects.create_user(username='player2', password='Testpass123!')
#         match = MatchHistory.objects.create(user=user, opponent=opponent, result='win')
#         self.assertEqual(match.result, 'win')
#         self.assertEqual(match.user.username, 'player1')
# tests.py
from django.test import TestCase
from django.urls import reverse
import json

class AuthTests(TestCase):
    def test_registration(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'securepassword123',
            'password2': 'securepassword123',
            'display_name': 'TestUser'
        }
        
        # Test valid registration
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('status', response.json())

        # Test duplicate username
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_login(self):
        # First create a user
        self.test_registration()
        
        url = reverse('user_login')
        data = {
            'username': 'testuser',
            'password': 'securepassword123'
        }
        
        # Test valid login
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        
        # Test invalid credentials
        data['password'] = 'wrongpassword'
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 401)