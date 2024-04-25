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
        'lobby': (Sanh, LobbySerializer, 'masanh'),
        'lobbyType': (Loaisanh, LobbyTypeSerializer, 'maloaisanh'),

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