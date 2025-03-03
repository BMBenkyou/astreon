from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class SupabaseAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        try:
            # Log the token for debugging
            logger.debug(f"Raw token: {raw_token}")
            
            # Decode the JWT token without verification for development
            decoded_token = jwt.decode(
                raw_token,
                options={"verify_signature": False}  # For development only
            )
            
            logger.debug(f"Decoded token: {decoded_token}")

            # Get user info from token
            user_id = decoded_token.get('sub')
            email = decoded_token.get('email')

            if not user_id:
                raise AuthenticationFailed('No user ID in token')

            # Get or create user based on Supabase user ID
            user, created = User.objects.get_or_create(
                username=user_id,
                defaults={
                    'email': email or '',
                    'is_active': True
                }
            )

            if created:
                logger.info(f"Created new user with ID: {user_id}")

            return (user, decoded_token)

        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token error: {str(e)}")
            raise InvalidToken('Invalid token')
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise AuthenticationFailed(str(e)) 