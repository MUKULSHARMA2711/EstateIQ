from django.urls import path
from .views import analyze_property

urlpatterns = [
    path('analyze/', analyze_property, name='analyze_property'),
]
