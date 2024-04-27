from rest_framework import serializers
from api.models import *

class LobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = Sanh
        fields = '__all__'

class LobbyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loaisanh
        fields = '__all__'

class UserSerializer_Signup(serializers.ModelSerializer):
    class Meta:
        model = Taikhoan
        fields = ['username','password','machucvu']

class FoodDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chitietmonan
        fields = '__all__'

class ServiceDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chitietdichvu
        fields = '__all__'
class PartyBookingFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phieudattieccuoi
        fields = '__all__'

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monan
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dichvu
        fields = '__all__'

