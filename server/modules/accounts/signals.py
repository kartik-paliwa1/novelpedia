from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.conf import settings

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    email = reset_password_token.user.email
    token = reset_password_token.key

    reset_url = f"http://localhost:3000/auth/reset_password?token={token}"  #

    send_mail(
        subject="Reset your NovelPedia password",
        message=f"""
Hi {reset_password_token.user.name},s

We received a request to reset your password.

Use the token below in the password reset form:

🔑 Token: {token}

Or click this link:
{reset_url}

If you didn’t request this, ignore this email.

Thanks,  
NovelPedia Team
""",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )
