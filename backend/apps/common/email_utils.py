from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail


def send_request_email(user_id, request_content):
    try:
        User = get_user_model()
        user = User.objects.get(user_id=user_id)
        subject = f"New Request from {user.username}"
        message = f"User {user.username} ({user.email}) has submitted the following request:\n\n{request_content}"
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
    except User.DoesNotExist:
        raise ValueError("Invalid user_id")
