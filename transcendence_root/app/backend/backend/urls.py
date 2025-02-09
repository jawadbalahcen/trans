"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from AuthUsers.views import(
    CurrentUserView,
    UpdateUserView,
    AuthCheckView,
    CSRFTokenView,
    register_user,
    user_login,
    user_logout
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', CurrentUserView.as_view()),
    path('api/update_user/', UpdateUserView.as_view()),
    path('auth-check/', AuthCheckView.as_view()),
    path('get-csrf-token/', CSRFTokenView.as_view()),
    path('api/register/', register_user),
    path('api/login/', user_login),
    path('api/logout/', user_logout, name='user_logout'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('', include('AuthUsers.urls')),  # Include your app's URLs
    
# ]
