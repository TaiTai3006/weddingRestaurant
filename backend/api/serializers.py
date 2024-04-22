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