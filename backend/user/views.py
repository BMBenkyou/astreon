import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from dj_rest_auth.registration.views import SocialLoginView
from django.views.decorators.csrf import csrf_exempt

class GoogleLogin(SocialLoginView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        google_access_token = request.data.get('access_token')
        if not google_access_token:
            return Response({'detail': 'Access token is required'}, status=400)

        # Send the token to dj-rest-auth for verification and login
        return super().post(request, *args, **kwargs)
