from allauth.account.adapter import DefaultAccountAdapter
from django.http import JsonResponse

class CustomAccountAdapter(DefaultAccountAdapter):
    def render_signup_response(self, request, form):
        """Return JSON instead of HTML when signing up via API."""
        if request.content_type == "application/json":
            if form.is_valid():
                return JsonResponse({"detail": "Signup successful! Please verify your email."})
            else:
                return JsonResponse({"errors": form.errors}, status=400)
        return super().render_signup_response(request, form)

