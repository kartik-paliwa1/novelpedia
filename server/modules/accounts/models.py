# Hey there, code explorer! Welcome to the models file for our 'accounts' module.
# This is where we define the blueprint for our users. It's like creating a character sheet for everyone who signs up! 🎭

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# --- The User Manager: Our very own user-creation wizard! ---
# This class, `MyUserManager`, is in charge of creating new users and superusers.
# It's like the factory that produces all the awesome people who will use our app.
class MyUserManager(BaseUserManager):
    # `create_user` is our go-to method for creating a regular user.
    # It takes all the essential info and brings a new user to life!
    def create_user(self, name, email, dob, gender, password=None, **extra_fields):
        # We're making sure everyone has a name and an email. No nameless, emailless ghosts here! 👻
        if not name:
            raise ValueError('Users must have a name. It\'s just polite!')
        if not email:
            raise ValueError('Users must have an email address. How else will we send them cool updates?')

        # We're creating a new user instance with all the provided details.
        # We also normalize the email to make sure it's in a consistent format.
        user = self.model(
            name=name,
            email=self.normalize_email(email),
            dob=dob,
            gender=gender,
            **extra_fields
        )

        # We're setting the password here. We use `set_password` to make sure it's securely hashed.
        user.set_password(password)
        # And... save! The user is now officially part of our database. Welcome to the club!
        user.save(using=self._db)
        return user

    # `create_superuser` is for creating the ultimate user: the superuser!
    # They have all the power, so we need to make sure they're created correctly.
    def create_superuser(self, name, email, dob, gender, password=None, **extra_fields):
        # We're setting `is_admin` to True by default for superusers. With great power comes great responsibility!
        extra_fields.setdefault('is_admin', True)
        # We're using our trusty `create_user` method to do the heavy lifting.
        user = self.create_user(name, email, dob, gender, password, **extra_fields)
        # And save! The superuser is now ready to rule the world (or at least, our app).
        user.save(using=self._db)
        return user

# --- The User Model: The star of the show! ---
# This is our custom user model, `MyUser`. It's where we define all the fields and properties of our users.
# We're inheriting from `AbstractBaseUser` and `PermissionsMixin` to get all the standard Django user features.
class MyUser(AbstractBaseUser, PermissionsMixin):
    # --- Choices, choices, choices! ---
    # We're defining some choices for our fields to keep the data consistent.
    GENDER_CHOICES = (('M', 'Male'), ('F', 'Female'), ('O', 'Other'))
    ROLE_CHOICES = (('reader', 'Reader'), ('author', 'Author'), ('admin', 'Admin'))
    USER_STATUS_CHOICES = (('normal', 'Normal'), ('banned', 'Banned'), ('suspended', 'Suspended'))

    # --- The Core Fields: The essentials for every user. ---
    email = models.EmailField(unique=True, max_length=255, help_text="The user's email address. Must be unique!")
    name = models.CharField(max_length=100, unique=True, help_text="The user's name. Also unique!")
    dob = models.DateField(help_text="The user's date of birth. Let's send them a birthday card! 🎂")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, help_text="The user's gender.")

    # --- The Extra Fields: All the cool stuff that makes our users unique! ---
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='reader', help_text="What's their role? A reader, an author, or an admin?")
    time_read = models.PositiveIntegerField(default=0, help_text="How much time have they spent reading? We're tracking it! ⏱️")
    user_status = models.CharField(max_length=20, choices=USER_STATUS_CHOICES, default='normal', help_text="Are they in good standing, or have they been a little naughty?")
    books_read = models.PositiveIntegerField(default=0, help_text="How many books have they conquered? 📚")
    followers_count = models.PositiveIntegerField(default=0, help_text="How many people are following their journey?")
    profile_likes = models.PositiveIntegerField(default=0, help_text="How many likes does their profile have? Popularity contest! 🏆")
    bio = models.TextField(blank=True, default='', help_text="A little something about themselves. Let their personality shine! ✨")
    imageURI = models.URLField(blank=False, default='https://www.freepik.com/free-vector/illustration-user-avatar-icon_2606572.htm#fromView=keyword&page=1&position=8&uuid=a02fe564-eed5-4549-822b-4fa4f03ab29f&query=Default+User', help_text="A link to their profile picture. Say cheese! 📸")
    bannerImageURI = models.URLField(blank=True, null=True, default=None, help_text="A link to their banner image. Make it epic! 🖼️")
    timezone = models.CharField(max_length=100, blank=True, default='', help_text="User's preferred timezone for scheduling and time-based features 🌍")
    patreonUrl = models.URLField(blank=True, default='', help_text="Link to their Patreon page. Support your favorite authors! 💝")

    # We're telling our model to use our custom user manager.
    objects = MyUserManager()

    # --- Model Configuration: The nitty-gritty details. ---
    # We're telling Django that the `name` field is the username.
    USERNAME_FIELD = 'name'
    # And these are the fields that are required when creating a new user.
    REQUIRED_FIELDS = ['email', 'dob', 'gender']

    # This is what our user will look like when we print it. It's like their official title.
    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"
    
    # This property checks if the user is a staff member.
    # In our app, only admins are staff.
    @property
    def is_staff(self):
        return self.role == 'admin'

# And that's our user model! A masterpiece of data architecture, if we do say so ourselves.
# Now, let's go and build some amazing features with it! 🚀


