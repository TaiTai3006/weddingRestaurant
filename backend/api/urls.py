from django.urls import path
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = [
  path('', getindex, name='index'),
  path('create/pdf/<type>/<id>', documentPdfView ),
  path('create/', create),
  path('report/', revenueReport, name='report'),
  path('invoice/', invoice),
  path('search/', search),
  path('search/searchParty/', searchPartyBookingFormAPI, name='search_party'),
  path('wedding/update/<str:wedding_id>/', update_wedding_info, name='update_wedding_info'),
  path('search/searchFood/', displayFoodDetailChecked),
  path('search/searchService/', displayServiceDetailChecked),
  path('addFoodDetails/', addFoodDetail),
  path('addServiceDetails/', addServiceDetail),
  path('management/', management),
  path('login/', login),
  path('logout/', logout),
  path('signup/', signup),
  path('assignTask/', assignTaskAPI),
  path('paymentInvoice/',paymentInvoiceAPI),
  path('statistic/countLobbyBooking/', countLobbyBookingAPI),
  path('statistic/countFoodBooking/', countFoodBookingAPI),
  path('statistic/countServiceBooking/', countServiceBookingAPI),
  path('searchParty/', searchPartyBookingFormAPI),
  path('create/bookingParty/bollies/available/', availablelobbiesListAPI),
  path('create/getFoodTable/<str:type>/', getFoodTable),
  path('create/bookingParty/', bookingPartyWeddingAPI),
  path('<str:model_name>/', LobbyView),
  path('<str:model_name>/<str:id>/', LobbyView),
  
]