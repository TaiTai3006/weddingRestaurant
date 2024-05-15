from django.urls import path
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = [
  path('', getindex),
   path('create/', create),
  path('login/', login),
  path('logout/', logout),
  path('signup/', signup),
  path('assignTask/', assignTaskAPI),
  path('paymentInvoice/',paymentInvoiceAPI),
  path('statistic/eventsPerDayInMonth/', countWeddingEventsPerDayInMonthAPI),
  path('statistic/eventsPerDay/', countWeddingEventsPerDayAPI),
  path('statistic/revenueReportPerDay/', revenueReportPerDayAPI),
  path('statistic/revenueReportPerMonth/', revenueReportPerMonthAPI),
  path('statistic/revenueReportPerYear/', revenueReportPerYearAPI),
  path('statistic/countLobbyBooking/', countLobbyBookingAPI),
  path('statistic/countFoodBooking/', countFoodBookingAPI),
  path('statistic/countServiceBooking/', countServiceBookingAPI),
  path('searchParty/', searchPartyBookingFormAPI),
  path('create/bookingParty/bollies/available/', availablelobbiesListAPI),
  path('bookingParty/', bookingPartyWeddingAPI),
  path('<str:model_name>/', LobbyView),
  path('<str:model_name>/<str:id>/', LobbyView),
  
]