import time
import logging

logger = logging.getLogger('api')


class RequestLoggingMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()

        # Log incoming request
        logger.info(f"→ {request.method} {request.path} | user={self._get_user(request)}")

        response = self.get_response(request)

        duration = (time.time() - start_time) * 1000  # ms
        logger.info(f"← {request.method} {request.path} | status={response.status_code} | {duration:.1f}ms")

        return response

    def _get_user(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            return request.user.username
        return 'anonymous'