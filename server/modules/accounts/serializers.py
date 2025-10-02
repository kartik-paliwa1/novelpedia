# Welcome to the serializers file for our 'accounts' module!
# This is where we transform our complex data, like our User model, into a format that can be easily
# sent over the internet (usually JSON). It's like being a translator for our data! 🌐

from rest_framework import serializers
from .models import MyUser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- The User Serializer: Our user's public profile! ---
# This serializer determines what user information we share with the world.
# We're being very selective here to protect our users' privacy.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        # We're listing all the fields that we want to include in the user's public profile.
        fields = (
            'id', 'name', 'email', 'dob', 'gender',
            'role', 'time_read', 'user_status', 'books_read',
            'followers_count', 'profile_likes', 'bio', 'imageURI', 'bannerImageURI',
            'timezone', 'patreonUrl'
        )

# --- The Register Serializer: The gateway to our app! ---
# This serializer is used to create new users. It's the first step on their journey with us.
class RegisterSerializer(serializers.ModelSerializer):
    # We're making the password write-only, so it's not included when we send user data back.
    password = serializers.CharField(write_only=True, help_text="The user's password. Write-only for security!")

    class Meta:
        model = MyUser
        # These are the fields we need to create a new user.
        fields = ('name', 'email', 'dob', 'gender', 'password')

    # This is where the magic happens! We're overriding the `create` method to use our custom user manager.
    def create(self, validated_data):
        # We're calling our `create_user` method from the user manager to create a new user.
        user = MyUser.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            dob=validated_data['dob'],
            gender=validated_data['gender'],
            password=validated_data['password'],
        )
        return user

# --- The Login Serializer: The key to the kingdom! ---
# This serializer is used to log users in. It checks their credentials and makes sure they're legit.
class LoginSerializer(serializers.Serializer):
    # We're using 'identifier' to accept either a username or an email. How flexible is that?
    identifier = serializers.CharField(help_text="The user's name or email.")
    password = serializers.CharField(write_only=True, help_text="The user's password. Write-only for security!")

    # We're overriding the `validate` method to check the user's credentials.
    def validate(self, data):
        # We're using our custom `NameOrEmailBackend` to authenticate the user.
        user = authenticate(username=data['identifier'], password=data['password'])
        # If the user is valid and active, we let them in. Otherwise, we show them the door.
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials. Please try again!")

# --- The Token Obtain Pair Serializer: The golden ticket! ---
# This serializer is used to generate a JSON Web Token (JWT) for the user.
# It's like giving them a key to access all the cool features of our app.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # We're accepting either a username or an email here as well.
    identifier = serializers.CharField(help_text="The user's name or email.")
    password = serializers.CharField(write_only=True, help_text="The user's password. Write-only for security!")

    # We're adding some custom claims to our JWT. This is like adding extra info to the user's key.
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # We're adding the user's name and email to the token, so we can use it on the frontend.
        token['name'] = user.name
        token['email'] = user.email
        return token

    # We're overriding the `validate` method to authenticate the user and add their data to the response.
    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')
        # We're using our custom backend to authenticate the user.
        user = authenticate(username=identifier, password=password)
        # If the user is not valid, we raise an error.
        if user is None or not user.is_active:
            raise serializers.ValidationError("Invalid credentials. One more try?")
        # We need to set the username field for the parent class validation
        # The JWT library expects the field name configured in USERNAME_FIELD
        attrs[self.username_field] = user.name
        # We're calling the parent's `validate` method to get the token.
        data = super().validate(attrs)
        # We're also adding the user's data to the response, so the frontend has everything it needs.
        data['user'] = UserSerializer(user).data
        return data

    # We're customizing the fields of the serializer to only require the identifier and password.
    @property
    def fields(self):
        fields = super().fields
        fields['identifier'] = serializers.CharField()
        fields['password'] = serializers.CharField(write_only=True)
        # We're removing the 'username' field, since we're using 'identifier' instead.
        if 'username' in fields:
            fields.pop('username')
        return fields

# And that's a wrap on our serializers! They're all set to translate our data and keep our app secure.
# Now, let's see them in action in our views! 🎬
