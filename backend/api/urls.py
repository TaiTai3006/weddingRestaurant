from django.urls import path, include
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = [
  path('test/', LobbyListView),
  path('test1/', LobbyListView1),
  path('login/', login),
  path('logout/', logout),
  path('signup/', signup),
  path('<str:model_name>/', LobbyView),
  path('<str:model_name>/<str:id>/', LobbyView),
  
]