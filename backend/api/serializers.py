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

class FoodTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loaimonan
        fields = '__all__'

class FoodSerializer(serializers.ModelSerializer):
    thongTinLoaiMonAn = FoodTypeSerializer(many=True, read_only=True)
    class Meta:
        model = Monan
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dichvu
        fields = '__all__'

class RevenueReportDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chitietbaocao
        fields = '__all__'

class RevenueReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Baocaodoanhthu
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Baocaodoanhthu
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Congviec
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nhanvien
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phancong
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hoadon
        fields = '__all__'

class DetailServicePaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChitietDvThanhtoan
        fields = '__all__'

class ParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thamso
        fields = '__all__'