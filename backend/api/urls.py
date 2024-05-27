from django.urls import path
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = [
  path('', getindex, name='index'),
  path('login/', login, name='login'),
  path('logout/', logout, name='logout'),
  path('create/', create, name='createBookingWedding'),
  path('create/pdf/<str:type>/<str:id>', documentPdfView, name='documentPdfView'),
  path('create/bookingParty/bollies/available/', availablelobbiesList, name='availableLobbiesList'),
  path('create/getFoodTable/<str:type>/', getFoodTable, name='getFoodTable'),
  path('create/bookingParty/', bookingPartyWedding),
  path('report/', revenueReport, name='report'),
  path('search/', search, name='searchBookingWedding'),
  path('search/searchParty/', searchPartyBookingFormAPI, name='search_party'),
  path('search/searchFood/', displayFoodDetailChecked,name='displayFoodDetailChecked'),
  path('search/searchService/', displayServiceDetailChecked, name='displayServiceDetailChecked'),
  path('paymentConfirm/<str:wedding_id>/', paymentConfirm, name = 'paymentConfirm'),
  path('cancelConfirm/<str:wedding_id>/', cancelConfirm, name = 'cancelConfirm'),
  path('wedding/update/<str:wedding_id>/', updateWeddingInfo, name='update_wedding_info'),
  path('addFoodDetails/', addFoodDetail, name='addFoodDetail'),
  path('addServiceDetails/', addServiceDetail, name='addServiceDetail'),
  path('paymentInvoice/',paymentInvoiceAPI, name='paymentInvoice'),
  path('<str:model_name>/', apiView, name='apiView'),
]