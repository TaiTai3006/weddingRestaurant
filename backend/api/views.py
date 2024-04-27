from rest_framework.generics import ListAPIView, CreateAPIView
from api.models import *
from api.serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.urls import *
from rest_framework.authtoken.models import Token
import bcrypt
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.views.decorators.cache import cache_page
from django.core.cache import cache


model_serializer_map = {
        'lobbies': (Sanh, LobbySerializer, 'masanh'),
        'lobbyTypies': (Loaisanh, LobbyTypeSerializer, 'maloaisanh'),
        'foods': (Monan, FoodSerializer, 'mamonan'),
        'services': (Dichvu, ServiceSerializer, 'mamonan'),

    }
# Create your views here.
# class LobbyListView(ListAPIView):
#     queryset = Sanh.objects.all()
#     serializer_class = LobbySerializer

# Test 
@api_view(['GET'])
@cache_page(timeout=60 * 30)
def LobbyListView(request):
    query = Sanh.objects.all()
    serializer = LobbySerializer(query, many=True)
    return Response(serializer.data)
#test 2
@api_view(['GET'])
def LobbyListView1(request):
    cache.set("foo", [
    {
        "maloaisanh": "LS0001",
        "tenloaisanh": "Hiện đại",
        "dongiabantoithieu": "2500000.00"
    },
    {
        "maloaisanh": "LS0002",
        "tenloaisanh": "Hoang sơ",
        "dongiabantoithieu": "1100000.00"
    },
    {
        "maloaisanh": "LS0003",
        "tenloaisanh": "Cổ điển",
        "dongiabantoithieu": "1200000.00"
    },
    {
        "maloaisanh": "LS0004",
        "tenloaisanh": "Công nghệ",
        "dongiabantoithieu": "1400000.00"
    },
    {
        "maloaisanh": "LS0005",
        "tenloaisanh": "Bóng tối",
        "dongiabantoithieu": "1600000.00"
    },
    {
        "maloaisanh": "LS0006",
        "tenloaisanh": "Cổ điển",
        "dongiabantoithieu": "1200000.00"
    }
], timeout=60 * 30)
    cache.delete("foo")
    return Response(cache.get("foo"))


@api_view(['GET', 'PUT', 'POST', 'DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def LobbyView(request, model_name=None, id=None):
    if not model_serializer_map.get(model_name):
        return Response({'error': 'Invalid model name'}, status=status.HTTP_400_BAD_REQUEST)
    
    model, serializer_class, key = model_serializer_map[model_name]

    if id :
        try:
            row = model.objects.get(**{key: id})
        except model.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        model_cache = cache.get(model_name)
        if model_cache :
            return Response(model_cache)
        query = model.objects.all()
        serializer = serializer_class(query, many=True)
        cache.set(model_name, serializer.data, timeout= 60 * 30)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = serializer_class(row, data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete(model_name)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'POST':
        serializer = serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete(model_name)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        row.delete()
        cache.delete(model_name)
        return Response("Delete successfuly",status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username = request.data['username'])
    password_input = request.data['password'].encode('utf-8')
    print(type(user.password), user.password, user.username)
    if not bcrypt.checkpw(password_input, user.password.encode('utf-8')) :
        return Response({"error": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)
    token, created = Token.objects.create(user=user)
    return Response({"token": token.key, "user": user.username}, status=status.HTTP_200_OK)

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer_Signup(data=request.data)
    if serializer.is_valid():
        password = request.data['password']
        bytes = password.encode('utf-8') 
        salt = bcrypt.gensalt() 
        hashed_password = bcrypt.hashpw(bytes, salt).decode('utf-8')
        serializer.save(password = hashed_password)
        user = User.objects.create(username=request.data['username'], password=hashed_password)
        # token = Token.objects.create(user=user)
        return Response(status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    user = get_object_or_404(User, username = request.data['username'])
    Token.objects.filter(user=user).delete()
    return Response({"message": "Logged out successfully"},status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def searchPartyBookingFormAPI(request):
    model_cache = cache.get('searchPartyBooking')
    if model_cache :
        return Response(model_cache, status=status.HTTP_200_OK)
    
    query = Phieudattieccuoi.objects.raw('SELECT * FROM PhieuDatTiecCuoi WHERE PhieuDatTiecCuoi.maTiecCuoi not in (SELECT maTiecCuoi FROM HoaDon) ORDER BY PhieuDatTiecCuoi.ngayDaiTiec ASC')
    serializer = PartyBookingFormSerializer(query, many = True)
 
    for item in serializer.data:
        query1 = Chitietdichvu.objects.filter(matieccuoi=item['matieccuoi'])
        query2 = Chitietmonan.objects.filter(matieccuoi=item['matieccuoi'])
        query3 = Sanh.objects.filter(masanh = item['masanh'])
        item['danhsachdichvu'] = ServiceDetailsSerializer(query1, many=True).data
        item['danhsachmonan'] = FoodDetailsSerializer(query2, many=True).data
        item['thongtinsanh'] = LobbySerializer(query3, many = True).data[0]

    cache.set('searchPartyBooking', serializer.data, timeout=60*30)

    return Response(serializer.data)

# Lấy danh sách các sảnh chưa có khách hàng đặt theo ngày đãi tiệc và ca tương ứng.
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def availablelobbiesListAPI(request):
    maca = request.data.get('maca')
    ngaydaitiec = request.data.get('ngaydaitiec')

    if not maca or not ngaydaitiec :
        return Response({"error": "maca and ngaydaitiec query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
    query = Sanh.objects.raw(f"SELECT * FROM Sanh WHERE Sanh.maSanh not in (SELECT maSanh FROM PhieuDatTiecCuoi WHERE PhieuDatTiecCuoi.maCa = '{maca}' AND PhieuDatTiecCuoi.ngayDaiTiec = {ngaydaitiec})")
    serializer = LobbySerializer(query, many = True)

    for item in serializer.data:
         query1 = Loaisanh.objects.filter(maloaisanh=item['maloaisanh'])
         item['thongtinloaisanh'] = LobbyTypeSerializer(query1, many = True).data[0]
    
    return Response(serializer.data, status=status.HTTP_200_OK)

#Lưu trữ thông tin đặt tiệc cưới của khách hàng
@api_view(['POST'])
def bookingPartyWeddingAPI(request):
    # Tạo mã phiếu đặt tiệc theo định dạng 'TC****' Ví dụ: 'TC0001'
    query = Phieudattieccuoi.objects.raw('SELECT * FROM PhieuDatTiecCuoi ORDER BY maTiecCuoi DESC LIMIT 1')
    matieccuoi = query[0].matieccuoi if query else 'TC0000'
    matieccuoi = int(matieccuoi[2:]) + 1
    matieccuoi = f'TC{matieccuoi:04}'
    
    # Lưu trữ thông tin đặt tiệc của khách hàng.
    party_booking_info = {
        'matieccuoi': matieccuoi,
        'ngaydat': request.data.get('ngaydat'),
        'ngaydaitiec': request.data.get('ngaydaitiec'),
        'soluongban': request.data.get('soluongban'),
        'soluongbandutru': 0,
        'dongiaban': request.data.get('dongiaban'),
        'tongtienban': request.data.get('tongtienban'),
        'tongtiendichvu': request.data.get('tongtiendichvu'),
        'tongtiendattiec': request.data.get('tongtiendattiec'),
        'conlai': request.data.get('conlai'),
        'tencodau': request.data.get('tencodau'),
        'sdt': request.data.get('sdt'),
        'tinhtrangphancong': None,
        'maca': request.data.get('maca'),
        'masanh': request.data.get('masanh'),
        'username': request.data.get('username')
    }

    partyBookingForm = PartyBookingFormSerializer(data=party_booking_info)
    if partyBookingForm.is_valid():
        partyBookingForm.save() #Lưu trữ thông tin khách hàng và thông tin đặt tiệc vào bảng Phieuchitietdattiec trong database
        # Lưu trữ thông tin món ăn đã đặt vào bảng Chitietmonan trong database
        foodList = request.data.get('danhsachmonan')
        for food in foodList:
            food['matieccuoi'] = matieccuoi
            foodDetail = FoodDetailsSerializer(data = food)
            print(foodDetail.is_valid())
            if not foodDetail.is_valid():
                Phieudattieccuoi.objects.get(matieccuoi = matieccuoi).delete()
                return Response(foodDetail.errors, status=status.HTTP_400_BAD_REQUEST)
            else: foodDetail.save()
        
        # Lưu trữ thông tin dịch vụ đã đặt vào bảng Chitietmonan trong database
        serviceList = request.data.get('danhsachdichvu')
        for service in serviceList:
            service['matieccuoi'] = matieccuoi
            serviceDetail = ServiceDetailsSerializer(data = service)
            if not serviceDetail.is_valid():
                Chitietmonan.objects.get(matieccuoi = matieccuoi).delete()
                Phieudattieccuoi.objects.get(matieccuoi = matieccuoi).delete()
                return Response(serviceDetail.errors, status=status.HTTP_400_BAD_REQUEST)
            else: serviceDetail.save()

        cache.delete('searchPartyBooking')
        return Response(status = status.HTTP_201_CREATED)
        
    return Response(partyBookingForm.errors, status=status.HTTP_400_BAD_REQUEST)
    


    
