from django.urls import path
from api.views import *
from api.models import *
from api.serializers import *

urlpatterns = [
  path('', getindex, name='index'),
  path('login/', login, name='login'),
  path('logout/', logout, name='logout'),
  path('create/pdf/<type>/<id>', documentPdfView),
  path('create/', create),
  path('report/', revenueReport, name='report'),
 
  path('search/', search),
  path('paymentConfirm/<str:wedding_id>/', paymentConfirm, name = 'paymentConfirm'),
  path('cancelConfirm/<str:wedding_id>/', cancelConfirm, name = 'cancelConfirm'),
  path('search/searchParty/', searchPartyBookingFormAPI, name='search_party'),
  path('wedding/update/<str:wedding_id>/', updateWeddingInfo, name='update_wedding_info'),
  path('search/searchFood/', displayFoodDetailChecked),
  path('search/searchService/', displayServiceDetailChecked),
  path('addFoodDetails/', addFoodDetail),
  path('addServiceDetails/', addServiceDetail),
  path('paymentInvoice/',paymentInvoiceAPI),
  path('searchParty/', searchPartyBookingFormAPI),
  path('create/bookingParty/bollies/available/', availablelobbiesList),
  path('create/getFoodTable/<str:type>/', getFoodTable),
  path('create/bookingParty/', bookingPartyWedding),
  path('<str:model_name>/', apiView),
  
]