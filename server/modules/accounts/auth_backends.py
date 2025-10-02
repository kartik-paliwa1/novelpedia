from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class NameOrEmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = None
        if username is None:
            username = kwargs.get('name') or kwargs.get('email')
        try:
            # Try to fetch by name
            user = UserModel.objects.get(name=username)
        except UserModel.DoesNotExist:
            # Try to fetch by email
            try:
                user = UserModel.objects.get(email=username)
            except UserModel.DoesNotExist:
                return None
        if user and user.check_password(password):
            return user
        return None
