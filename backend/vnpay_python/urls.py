from django.urls import path, include
from vnpay_python.views import *
# from vnpay_python.models import *

urlpatterns = [
   path('payment/', payment),
]