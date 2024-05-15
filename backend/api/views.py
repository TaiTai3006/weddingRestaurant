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
from django.db import connection
from django.shortcuts import render, redirect
import json

model_serializer_map = {
        'lobbies': (Sanh, LobbySerializer, 'masanh'),
        'lobbyTypes': (Loaisanh, LobbyTypeSerializer, 'maloaisanh'),
        'foods': (Monan, FoodSerializer, 'mamonan'),
        'foodTypes': (Loaimonan, FoodTypeSerializer, 'maloaimonan'),
        'services': (Dichvu, ServiceSerializer, 'madichvu'),
        'employee': (Nhanvien, EmployeeSerializer, 'manhanvien'),
        'job': (Congviec, JobSerializer, 'macongviec'),
        'parameter': (Thamso, ParameterSerializer, 'id'),
        'shifts': (Ca, ShiftSerializer, 'maca')
    }

def getindex(request):
    return render(request, 'home.html')

def create(request):
    
    lobbies = Sanh.objects.all()
    lobby_types = Loaisanh.objects.all()
    foods = Monan.objects.all()
    food_types = Loaimonan.objects.all()
    services = Dichvu.objects.all()
    shifts = Ca.objects.all()
    
    
    lobby_serializer = LobbySerializer(lobbies, many=True)
    lobby_type_serializer = LobbyTypeSerializer(lobby_types, many=True)
    food_serializer = FoodSerializer(foods, many=True)
    food_type_serializer = FoodTypeSerializer(food_types, many=True)
    service_serializer = ServiceSerializer(services, many=True)
    shift_serializer = ShiftSerializer(shifts, many = True)
    
    
    serialized_data = {
        'lobbies': lobby_serializer.data,
        'lobbyTypes': lobby_type_serializer.data,
        'foods': food_serializer.data,
        'foodTypes': food_type_serializer.data, 
        'services': service_serializer.data,
        'shifts' : shift_serializer.data,
    }
    
    return render(request, 'base.html',serialized_data)

def getFoodTable(requet, type):
    foods = Monan.objects.all()



# Tạo mã khoá chính tự động cho các bảng bằng cách lấy phần tử cuối cùng trong bảng cộng thêm 1
def getNextID(model, id_field):
    """
    Hàm này trả về mã khoá chính tiếp theo cho một model cụ thể.

    Tham số:
        - model (Model): Model của bảng cần tạo mã khoá chính tự động.
        - id_field (str): Tên trường chứa mã khoá chính.

    Trả về:
        - str: Mã khoá chính tiếp theo.
    """
    latest_query = model.objects.raw(f'SELECT * FROM {model._meta.db_table} ORDER BY {id_field} DESC LIMIT 1')
    latest_id = getattr(latest_query[0], id_field) if latest_query else ''
    header = latest_id[:2] #Lấy 2 ký tự đầu
    next_id = int(latest_id[2:]) + 1 #Lấy 4 ký tự cuối chuyển thành int cộng thêm 1
    next_id = f'{next_id:04}' 
    return header + next_id

@api_view(['GET', 'PUT', 'POST', 'DELETE'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
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
        request.data[key] = getNextID(model, key)
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
# @api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def availablelobbiesListAPI(request):
    data = json.loads(request.body)
    maca = data.get('maca')
    ngaydaitiec = data.get('ngaydaitiec')
    # print(request.query_params)
    if not maca or not ngaydaitiec :
        return render(request, 'selectLobbies.html')
    
    query = Sanh.objects.raw(f"SELECT * FROM Sanh WHERE Sanh.maSanh not in (SELECT maSanh FROM PhieuDatTiecCuoi WHERE PhieuDatTiecCuoi.maCa = '{maca}' AND PhieuDatTiecCuoi.ngayDaiTiec = '{ngaydaitiec}')")
    serializer = LobbySerializer(query, many = True)

    for item in serializer.data:
         query1 = Loaisanh.objects.filter(maloaisanh=item['maloaisanh'])
         item['thongtinloaisanh'] = LobbyTypeSerializer(query1, many = True).data[0]
    print(serializer.data)
    return render(request, 'selectLobbies.html', {"availablelobbies" : serializer.data})


#Lưu trữ thông tin đặt tiệc cưới của khách hàng
@api_view(['POST'])
def bookingPartyWeddingAPI(request):
    # Tạo mã phiếu đặt tiệc theo định dạng 'TC****' Ví dụ: 'TC0001'
    matieccuoi = getNextID(Phieudattieccuoi, 'matieccuoi')
    
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

# Thống kê số lượng tiệc trong tháng theo từng ngày
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def countWeddingEventsPerDayInMonthAPI(request):
    model_cache = cache.get('countWeddingEventsPerDayInMonth')

    if model_cache:
        return Response(model_cache, status=status.HTTP_200_OK) 
    
    month = request.data.get('month')
    year = request.data.get('year')

    if not month or not year:
        return Response({"error": "month and year query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        cursor.execute(f"SELECT DAY(`ngayDaiTiec`) as Day, COUNT(*) as Count FROM `PhieuDatTiecCuoi` WHERE YEAR(`ngayDaiTiec`) = {year} AND MONTH(`ngayDaiTiec`) = {month} GROUP BY DAY(`ngayDaiTiec`)")
        data = cursor.fetchall()
    
    cache.set('countWeddingEventsPerDayInMonth', data, timeout=60*30)

    return Response(data, status=status.HTTP_200_OK)

#Thống kê số lượng tiệc cưới trong ngày theo từng ca
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def countWeddingEventsPerDayAPI(request):
    date = request.data.get('date')

    if not date:
        return Response({"error": "date query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

    with connection.cursor() as cursor:
        cursor.execute(f"SELECT Ca.tenCa, COUNT(*) FROM `PhieuDatTiecCuoi`, Ca WHERE PhieuDatTiecCuoi.maCa = Ca.maCa AND PhieuDatTiecCuoi.ngayDaiTiec = '{date}' GROUP BY Ca.tenCa")
        data = cursor.fetchall()
    
    return Response(data, status=status.HTTP_200_OK)

# Thống kê doanh thu theo từng ngày
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def revenueReportPerDayAPI(request):
    month = request.data.get('month')
    year = request.data.get('year')

    if not month or not year:
        return Response({"error": "month and year query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    query = Chitietbaocao.objects.raw(f"SELECT * FROM `ChiTietBaoCao` WHERE MONTH(`ngay`) = {month} AND YEAR(`ngay`) = {year}")
    serializer = RevenueReportDetailSerializer(query, many = True)

    return Response(serializer.data, status = status.HTTP_200_OK)

# Thống kê doanh thu theo từng thang
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def revenueReportPerMonthAPI(request):
    year = request.data.get('year')

    if  not year:
        return Response({"error": "year query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    query = Baocaodoanhthu.objects.raw(f"SELECT * FROM `BaoCaoDoanhThu` WHERE `nam` = {year}")
    serializer = RevenueReportSerializer(query, many = True)

    return Response(serializer.data, status=status.HTTP_200_OK)

# Thống kê doanh thu theo từng năm
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def revenueReportPerYearAPI(request):
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT nam, SUM(`tongDoanhThu`) FROM `BaoCaoDoanhThu` ORDER BY nam ")
        temp = cursor.fetchall()

    data = []
    for item in temp:
        data.append({'nam': item[0], 'tongDoanhThu': item[1]})

    return Response(data, status=status.HTTP_200_OK)

# Thống kê số lượng sảnh được đặt theo tháng, năm
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def countLobbyBookingAPI(request):
    month = request.data.get('month')
    year = request.data.get('year')

    if (not month and not year ) or (month and not year):
        return Response({"error": "month and year query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if month and year:
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT Sanh.tenSanh, COUNT(*)  FROM `PhieuDatTiecCuoi`, Sanh WHERE PhieuDatTiecCuoi.maSanh = Sanh.maSanh AND MONTH(`ngayDaiTiec`) = {month} AND YEAR(`ngayDaiTiec`) = {year} GROUP BY Sanh.maSanh, Sanh.tenSanh ")
            temp = cursor.fetchall()
    else: 
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT Sanh.tenSanh, COUNT(*)  FROM `PhieuDatTiecCuoi`, Sanh WHERE PhieuDatTiecCuoi.maSanh = Sanh.maSanh AND YEAR(`ngayDaiTiec`) = {year} GROUP BY Sanh.maSanh, Sanh.tenSanh ")
            temp = cursor.fetchall()

    data = []
    for item in temp:
        data.append({'tenSanh': item[0], 'soluongSanh': item[1]})

    return Response(data, status=status.HTTP_200_OK)

# Thống kê số lượng mon an được đặt theo tháng, năm
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def countFoodBookingAPI(request):
    month = request.data.get('month')
    year = request.data.get('year')

    if (not month and not year ) or (month and not year):
        return Response({"error": "month and year query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if month and year:
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT MonAn.tenMonAn, COUNT(*) FROM `ChiTietMonAn`, MonAn, PhieuDatTiecCuoi WHERE ChiTietMonAn.maMonAn = MonAn.maMonAn AND PhieuDatTiecCuoi.maTiecCuoi = ChiTietMonAn.maTiecCuoi AND MONTH(`ngayDaiTiec`) = {month} AND YEAR(`ngayDaiTiec`) = {year} GROUP BY MonAn.maMonAn, MonAn.tenMonAn")
            temp = cursor.fetchall()
    else: 
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT MonAn.tenMonAn, COUNT(*) FROM `ChiTietMonAn`, MonAn, PhieuDatTiecCuoi WHERE ChiTietMonAn.maMonAn = MonAn.maMonAn AND PhieuDatTiecCuoi.maTiecCuoi = ChiTietMonAn.maTiecCuoi AND YEAR(`ngayDaiTiec`) = {year} GROUP BY MonAn.maMonAn, MonAn.tenMonAn")
            temp = cursor.fetchall()

    data = []
    for item in temp:
        data.append({'tenMonAn': item[0], 'soluongMonAn': item[1]})

    return Response(data, status=status.HTTP_200_OK)

# Thống kê số lượng dich vu được đặt theo tháng, năm
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def countServiceBookingAPI(request):
    month = request.data.get('month')
    year = request.data.get('year')

    if (not month and not year ) or (month and not year):
        return Response({"error": "month and year query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if month and year:
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT DichVu.tenDichVu, COUNT(*) FROM ChiTietDichVu, DichVu, PhieuDatTiecCuoi WHERE ChiTietDichVu.maDichVu = DichVu.maDichVu AND PhieuDatTiecCuoi.maTiecCuoi = ChiTietDichVu.maTiecCuoi AND MONTH(`ngayDaiTiec`) = {month} AND YEAR(`ngayDaiTiec`) = {year} GROUP BY DichVu.maDichVu, DichVu.tenDichVu")
            temp = cursor.fetchall()
    else: 
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT DichVu.tenDichVu, COUNT(*) FROM ChiTietDichVu, DichVu, PhieuDatTiecCuoi WHERE ChiTietDichVu.maDichVu = DichVu.maDichVu AND PhieuDatTiecCuoi.maTiecCuoi = ChiTietDichVu.maTiecCuoi AND YEAR(`ngayDaiTiec`) = {year} GROUP BY DichVu.maDichVu, DichVu.tenDichVu")
            temp = cursor.fetchall()

    data = []
    for item in temp:
        data.append({'tenDichVu': item[0], 'soluongDV': item[1]})

    return Response(data, status=status.HTTP_200_OK)

# Phan cong viec cho nhan vien cho từng tiệc cưới
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def assignTaskAPI(request):
    """
    API để phân công công việc cho nhân viên.

    Parameters:
    - task_assignment_list (list): Danh sách các công việc cần phân công cho nhân viên. 
                                  Mỗi công việc được đại diện bởi một dictionary có hai keys: "manhanvien" và "matieccuoi".

    Returns:
    - Response: status code.
    """
    task_assignment_list = request.data

    if not task_assignment_list:
        return Response({"error": "task assignment list query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Lưu trữ phân công cho từng nhân viên vào bảng Phân công trong database
    for task_assignment in task_assignment_list:
        serializer = AssignmentSerializer(data=task_assignment)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

    # Cập nhật trường tình trạng phân công công việc thành 1 trong bảng Phiếu đặt tiệc 
    with connection.cursor() as cursor:
        cursor.execute("UPDATE PhieuDatTiecCuoi SET tinhtrangphancong = 1 WHERE maTiecCuoi = %s", [task_assignment_list[0].get('matieccuoi')])

    return Response(status=status.HTTP_201_CREATED)

# Lưu trữ thông tin thanh toán hoá đơn của khách hàng vào bảng Hoá đơn trong database
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def paymentInvoiceAPI(request):
    """
    API để tạo mới hoá đơn thanh toán và lưu trữ các dịch vụ đã sử dụng.

    Parameters: request.data là một dictionary gồm:
        - mahoadon (str): ID của hoá đơn.
        - ngayThanhtoan (str): Ngày thanh toán.
        - tongtiendichvu (float): Tổng chi phí dịch vụ.
        - tienphat (float): Số tiền phạt.
        - tongtienhoadon (float): Tổng số tiền của hoá đơn.
        - conlai (float): Số tiền còn lại.
        - matieccuoi (str): ID của tiệc cưới.
        - username (str): Tên người dùng thực hiện thanh toán.
        - danhsachdichvu (list): Danh sách chi tiết dịch vụ gồm nhiều dictionary chứa thông tin bên dưới.
            + madichvu (str): ID của dịch vụ.
            + soluong (int): Số lượng.
            + giatien (float): Giá tiền.

    Returns:
        - Response: Status code.
    """
    mahoadon = getNextID(Hoadon, 'mahoadon')
    request.data['mahoadon'] = mahoadon

    invoice = InvoiceSerializer(data = request.data)

    if not invoice.is_valid():
        return Response(invoice.errors, status=status.HTTP_400_BAD_REQUEST)
    
    invoice.save()

    service_list = request.data.get('danhsachdichvu')

    for service in service_list:
        service['mahoadon'] = mahoadon
        detail_service_payment = DetailServicePaymentSerializer(data=service)

        if not detail_service_payment.is_valid():
            ChitietDvThanhtoan.objects.get(mahoadon = mahoadon).delete()
            Hoadon.objects.get(mahoadon = mahoadon).delete()
            return Response(detail_service_payment.errors, status=status.HTTP_400_BAD_REQUEST)
        
        detail_service_payment.save()
    
    return Response(status=status.HTTP_201_CREATED)


