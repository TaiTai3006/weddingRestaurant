from django.urls import path
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = [
  path('', getindex, name='index'),
  # path('<type>/', selectDashboard),
  path('create/', create),
  path('report/', report),
  path('invoice/', invoice),
  path('search/', search),
  path('search/searchParty/', searchPartyBookingFormAPI, name='search_party'),
  path('search/searchFoodService/', displayFoodServiceDetailChecked),
  path('management/', management),
  path('login/', login),
  path('logout/', logout),
  path('signup/', signup),
  path('assignTask/', assignTaskAPI),
  path('paymentInvoice/',paymentInvoiceAPI),
  # path('statistic/eventsPerDayInMonth/', countWeddingEventsPerDayInMonthAPI),
  # path('statistic/eventsPerMonth/', countWeddingEventsPerMonthAPI),
  # path('statistic/eventsPerDay/', countWeddingEventsPerDayAPI),
  path('statistic/revenueReportPerDay/', revenueReportPerDayAPI),
  path('statistic/revenueReportPerMonth/', revenueReportPerMonthAPI),
  path('statistic/revenueReportPerYear/', revenueReportPerYearAPI),
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