from django.core.management.base import BaseCommand
from django.utils import timezone
from modules.accounts.models import MyUser

class Command(BaseCommand):
    help = 'Create a test user for development'

    def add_arguments(self, parser):
        parser.add_argument('--name', default='testuser', help='Username for the test user')
        parser.add_argument('--email', default='test@example.com', help='Email for the test user')
        parser.add_argument('--password', default='Password123!', help='Password for the test user')

    def handle(self, *args, **options):
        name = options['name']
        email = options['email']
        password = options['password']

        # Check if user already exists
        if MyUser.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists'))
            return

        if MyUser.objects.filter(name=name).exists():
            self.stdout.write(self.style.WARNING(f'User with name {name} already exists'))
            return

        # Create test user
        user = MyUser.objects.create_user(
            name=name,
            email=email,
            dob=timezone.now().date(),  # Use today's date for DOB
            gender='O',  # Other
            password=password
        )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created test user: {name} ({email}) with password: {password}')
        )