# views.py
from apps.common.email_utils import send_request_email
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RequestSerializer


class SubmitRequest(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            request_content = serializer.validated_data['request_content']

            try:
                send_request_email(user_id, request_content)
                return Response({'message': 'Request sent successfully'}, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
