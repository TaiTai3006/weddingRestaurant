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
from django.db.models import Count
from django.db.models.functions import ExtractDay
from django.http import JsonResponse
from datetime import datetime

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
# Trang dashboard
def getindex(request):
    """
    Trang dashboard hiển thị thông tin thống kê về sự kiện cưới và biểu đồ tương ứng.
    url: '/'

    Tham số:
    - request: Đối tượng HttpRequest chứa dữ liệu được gửi bởi người dùng.
    + request.POST['type'] (str): loại thống kê bản đồ muốn trả về (day, month)
    + request.POST['date'] (str): ngày thống kê bản đồ muốn trả về (yyyy-mm-dd)

    Trả về:
    - Đối tượng HttpResponse hiển thị trang dashboard với thông tin thống kê và biểu đồ tương ứng.
    + optionsChart (list): Chứa các dữ liệu thông số để vẽ bản đồ biểu diễn thống kê.
    + dataWeddingEvents (list): Chứa các dữ liệu thống kê sự kiện cưới theo từng loại.
    + dataRequest (dict): Chứa các thông tin dữ liệu được gửi bởi người dùng.
    """
    date_string = request.POST.get('date')
    type = request.POST.get('type', 'day')
    now = datetime.now()

    date = datetime.strptime(date_string, "%Y-%m-%d") if date_string else None
    year = date.year if date else now.year
    month = date.month if date else now.month
    
    current_date = date_string if date_string else f"{year}-{month:02}-{now.day:02}"    

    if type == 'day':
        data_count_wedding = countWeddingEventsPerDayInMonth(month, year)
    else:
        data_count_wedding = countWeddingEventsPerMonth(year)

    data_wedding_events = countWeddingEventsPerDay(current_date)

    options_chart = {
        "categories": [x.get("day") if type == 'day' else x.get("month") for x in data_count_wedding],
        "series": [x.get("count") for x in data_count_wedding]
    }

    return render(request, 'dashboard.html', {
        "optionsChart": json.dumps(options_chart), 
        "dataWeddingEvents": data_wedding_events,
        "dataRequest": {"date": current_date, "type": type}
    })

#Đếm số lượng tiệc cưới theo từng ngày theo tháng, năm cụ thể
def countWeddingEventsPerDayInMonth(month, year):
    """
    Đếm số lượng tiệc cưới theo từng ngày trong một tháng và năm cụ thể.

    Tham số:
    - month (int): Tháng cần thống kê số lượng tiệc cưới (1 đến 12).
    - year (int): Năm cần thống kê số lượng tiệc cưới.

    Trả về:
    - Danh sách (list) các bản ghi chứa số lượng tiệc cưới theo từng ngày trong tháng và năm chỉ định.
    """
    query = Phieudattieccuoi.objects.raw(f"""
        SELECT maTiecCuoi, DAY(`ngayDaiTiec`) as Day, COUNT(*) as Count 
        FROM `PhieuDatTiecCuoi` 
        WHERE YEAR(`ngayDaiTiec`) = {year} AND MONTH(`ngayDaiTiec`) = {month} 
        GROUP BY DAY(`ngayDaiTiec`)
    """)
    
    result_list = []
    for item in query:
        day = item.Day
        count = item.Count
        result_list.append({'day': day, 'count': count})

    return result_list

#Đếm số lượng tiệc cưới theo từng tháng theo năm cụ thể
def countWeddingEventsPerMonth(year):
    """
    Đếm số lượng tiệc cưới theo từng tháng trong một năm cụ thể.

    Tham số:
    - year (int): Năm cần thống kê số lượng tiệc cưới.

    Trả về:
    - Danh sách (list) các bản ghi chứa số lượng tiệc cưới theo từng tháng trong năm chỉ định.
    """
    query = Phieudattieccuoi.objects.raw(f"""
        SELECT maTiecCuoi, MONTH(`ngayDaiTiec`) as Month, COUNT(*) as Count 
        FROM `PhieuDatTiecCuoi` 
        WHERE YEAR(`ngayDaiTiec`) = {year} 
        GROUP BY MONTH(`ngayDaiTiec`)
    """)
    
    result_list = []
    for item in query:
        month = item.Month
        count = item.Count
        result_list.append({'month': month, 'count': count})

    return result_list

def getDayFromDateString(date_string):
    """
    Trích xuất ngày từ một chuỗi ngày tháng năm.

    Tham số:
    - date_string (str): Chuỗi đại diện cho ngày tháng năm trong định dạng "YYYY-MM-DD".

    Trả về:
    - Ngày (str) được trích xuất từ chuỗi đầu vào.
    """
    date_parts = date_string.split('-')
    day = date_parts[2]
    return day

#Dếm số tiệc cưới theo từng ca theo 1 ngày cụ thể
def countWeddingEventsPerDay(date):
    """
    Đếm số lượng tiệc cưới theo từng ca trong một ngày cụ thể.

    Tham số:
    - date (str): Ngày cần thống kê số lượng tiệc cưới (trong định dạng 'YYYY-MM-DD').

    Trả về:
    - Danh sách (list) các bản ghi chứa số lượng tiệc cưới theo từng ca trong ngày chỉ định.
    """
    query = Phieudattieccuoi.objects.raw(
        f"SELECT maTiecCuoi, Ca.tenCa, COUNT(*) AS event_count "
        f"FROM `PhieuDatTiecCuoi`, Ca "
        f"WHERE PhieuDatTiecCuoi.maCa = Ca.maCa AND PhieuDatTiecCuoi.ngayDaiTiec = '{date}' "
        f"GROUP BY Ca.tenCa"
    )
    results = [{"ca": item.tenCa, "event_count": item.event_count} for item in query]
    print(results)
    return results

def revenueReport(request):
    """
    Thống kê doanh thu của nhà hàng theo từng ngày, từng tháng từ năm
    url: '/repost/'

    Tham số:
    - request: Đối tượng HttpRequest chứa dữ liệu được gửi bởi người dùng.
    + request.POST[type] (str): loại thống kê muốn trả về (daily, monthly, annual)
    + request.POST[month] (int): tháng muốn thống kê
    + request.POST[year] (int): năm muốn thống kê

    Trả về:
    - Đối tượng HttpResponse hiển thị mẫu báo cáo doanh thu với dữ liệu cần thiết.
    + optionsChart (list): Chứa các dữ liệu thông số để vẽ bản đồ biểu diễn thống kê.
    + reportData (list): Chứa các dữ liệu thống kê doanh thu theo từng loại.
    + requestData (dict): Chứa các thông tin dữ liệu được gửi bởi người dùng.
    """
    now = datetime.now() #sua thanh now
    type = request.POST.get('type', 'daily')
    month = request.POST.get('month', 6)
    year = request.POST.get('year', 2023)
   
    report_data = []
    options_chart = []

    if type == 'daily':
        report_data = revenueReportPerDay(month, year)
        options_chart = {
            "series": [x.get("tile") for x in report_data],
            "labels": [f"Ngày {x.get('ngay')}" for x in report_data]
        }

    elif type == 'monthly':
        report_data = revenueReportPerMonth(year)
        options_chart = [{"x": data.get('thang'), "y": data.get('tongdoanhthu')} for data in report_data]

    elif type == 'annual':
        report_data = revenueReportPerYear()
        options_chart = [{"x": data.get('nam'), "y": data.get('tongdoanhthu')} for data in report_data]

    return render(request, 'report.html', {
        "optionsChart": json.dumps(options_chart),
        "reportData": report_data,
        "requestData": {"type": type, "month": month, "year": year}
    })

# Thống kê doanh thu theo từng ngày
def revenueReportPerDay(month, year): 
    """
    Thống kê doanh thu theo từng ngày cho một tháng và năm cụ thể.

    Tham số:
    - month (int): Tháng cần thống kê doanh thu (1 đến 12).
    - year (int): Năm cần thống kê doanh thu.

    Trả về:
    - Danh sách (list) các bản ghi thống kê doanh thu theo từng ngày trong tháng và năm chỉ định.
    """   
    query = Chitietbaocao.objects.raw(f"SELECT * FROM `ChiTietBaoCao` WHERE MONTH(`ngay`) = {month} AND YEAR(`ngay`) = {year}")
    serializer = RevenueReportDetailSerializer(query, many = True)

    for index,data in enumerate(serializer.data):
        data['id'] = index + 1
        data['tile'] = round(data.get("tile") * 100,2)
        data['ngay'] = getDayFromDateString(data.get('ngay'))

    return serializer.data

# Thống kê doanh thu theo từng thang
def revenueReportPerMonth(year):
    """
    Thống kê doanh thu theo từng tháng cho một năm cụ thể.

    Tham số:
    - year (int): Năm cần thống kê doanh thu.

    Trả về:
    - Danh sách (list) các bản ghi thống kê doanh thu theo từng tháng trong năm chỉ định.
    """   
    query = Baocaodoanhthu.objects.raw(f"SELECT * FROM `BaoCaoDoanhThu` WHERE `nam` = {year}")
    serializer = RevenueReportSerializer(query, many = True)

    for data in serializer.data:
        data['tongdoanhthu'] = int(float(data['tongdoanhthu']))

    return serializer.data

# Thống kê doanh thu theo từng năm
def revenueReportPerYear():
    """
    Thống kê doanh thu theo từng năm.

    Trả về:
    - Danh sách (list) các bản ghi thống kê doanh thu theo từng năm, bao gồm tổng doanh thu cho mỗi năm.
    """
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT nam, SUM(`tongDoanhThu`) FROM `BaoCaoDoanhThu` ORDER BY nam ")
        temp = cursor.fetchall()

    data = []
    for item in temp:
        data.append({'nam': item[0], 'tongdoanhthu': float(item[1])})

    return data

# Thống kê số lượng sảnh được đặt theo tháng, năm
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


def report(request):
    return render(request, 'report.html')
def invoice(request):
    return render(request, 'invoice.html')
def search(request):
    foods = Monan.objects.all()
    food_serializer = FoodSerializer(foods, many=True)
    services = Dichvu.objects.all()
    service_serializer = ServiceSerializer(services, many=True)
    lobby_types = Loaisanh.objects.all()
    shifts = Ca.objects.all()
    food_types = Loaimonan.objects.all()
    
    food_serializer = FoodSerializer(foods, many=True)
    food_type_serializer = FoodTypeSerializer(food_types, many=True)
    service_serializer = ServiceSerializer(services, many=True)
    lobby_type_serializer = LobbyTypeSerializer(lobby_types, many=True)
    shift_serializer = ShiftSerializer(shifts, many = True)

    query = Phieudattieccuoi.objects.raw('SELECT * FROM PhieuDatTiecCuoi WHERE PhieuDatTiecCuoi.maTiecCuoi not in (SELECT maTiecCuoi FROM HoaDon) ORDER BY PhieuDatTiecCuoi.ngayDaiTiec ASC')
    serializer = PartyBookingFormSerializer(query, many = True)
    serialized_data = {
        'weddings': serializer.data,
        'foods': food_serializer.data,
        'services': service_serializer.data,
        'lobbyTypes': lobby_type_serializer.data,
        'shifts' : shift_serializer.data,
        'foodTypes': food_type_serializer.data, 

    }
    
   
    for item in serializer.data:
        query1 = Chitietdichvu.objects.filter(matieccuoi=item['matieccuoi'])
        query2 = Chitietmonan.objects.filter(matieccuoi=item['matieccuoi'])
        query3 = Sanh.objects.filter(masanh = item['masanh'])
        query4 = Ca.objects.filter(maca = item['maca'])
        item['danhsachdichvu'] = ServiceDetailsSerializer(query1, many=True).data
        item['danhsachmonan'] = FoodDetailsSerializer(query2, many=True).data
        item['thongtinsanh'] = LobbySerializer(query3, many = True).data[0]
        item['thongtinca'] = ShiftSerializer(query4, many = True).data[0]
        
   
   
    print(serialized_data)
    
    return render(request, 'search.html',serialized_data)
def management(request):
    data = searchPartyBookingFormAPI(request)

    print(data)
    return render(request, 'management.html',{'data': data})
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

def getFoodTable(request, type): 

    if type == 'all':
        foods = Monan.objects.all()
        serializer = FoodSerializer(foods, many=True)
        return render(request, 'foodTable.html', {"foods": serializer.data})
    
    foods = Monan.objects.filter(maloaimonan=type)
    serializer = FoodSerializer(foods, many=True)
    return render(request, 'foodTable.html', {"foods": serializer.data})


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
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def searchPartyBookingFormAPI(request):
    # model_cache = cache.get('searchPartyBooking')
    # if model_cache :
        # return Response(model_cache, status=status.HTTP_200_OK)
    #     return render(request, 'search.html', {"data": model_cache})
   
    foods = Monan.objects.all()
    food_serializer = FoodSerializer(foods, many=True)
    services = Dichvu.objects.all()
    service_serializer = ServiceSerializer(services, many=True)
    tenchure = request.GET.get('tenchure', '')
    tencodau = request.GET.get('tencodau', '')
    maca = request.GET.get('maca', '')
    masanh = request.GET.get('masanh', '')
    ngaydattiec = request.GET.get('ngaydattiec', '')
    ngaydaitiec = request.GET.get('ngaydaitiec', '')
    soluongban = request.GET.get('soluongban', '')
    soluongbandutru = request.GET.get('soluongbandutru', '')

    query = "SELECT * FROM PhieuDatTiecCuoi WHERE PhieuDatTiecCuoi.maTiecCuoi NOT IN (SELECT maTiecCuoi FROM HoaDon)"

# Tạo danh sách các điều kiện
    conditions = []

# Kiểm tra và thêm điều kiện nếu giá trị không rỗng
    if tenchure:
        conditions.append(f"PhieuDatTiecCuoi.tenChuRe LIKE '%%{tenchure}%%'")
    if tencodau:
        conditions.append(f"PhieuDatTiecCuoi.tenCoDau LIKE '%%{tencodau}%%'")
    if maca:
        conditions.append(f"PhieuDatTiecCuoi.maca = '{maca}'")
    if masanh:
        conditions.append(f"PhieuDatTiecCuoi.masanh = '{masanh}'")
    if ngaydattiec:
        conditions.append(f"PhieuDatTiecCuoi.ngayDatTiec = '{ngaydattiec}'")
    if ngaydaitiec:
        conditions.append(f"PhieuDatTiecCuoi.ngayDaiTiec = '{ngaydaitiec}'")
    if soluongban:
        conditions.append(f"PhieuDatTiecCuoi.soLuongBan = '{soluongban}'")
    if soluongbandutru:
        conditions.append(f"PhieuDatTiecCuoi.soLuongBanDuTru = '{soluongbandutru}'")

    # Ghép các điều kiện vào câu truy vấn nếu có điều kiện nào
    if conditions:
        query += " AND " + " AND ".join(conditions)

    query += " ORDER BY PhieuDatTiecCuoi.ngayDaiTiec ASC"

    query_f = Phieudattieccuoi.objects.raw(query)     
    
    
    serializer = PartyBookingFormSerializer(query_f, many = True)
    
    for item in serializer.data:
        query1 = Chitietdichvu.objects.filter(matieccuoi=item['matieccuoi'])
        query2 = Chitietmonan.objects.filter(matieccuoi=item['matieccuoi'])
        query3 = Sanh.objects.filter(masanh = item['masanh'])
        query4 = Ca.objects.filter(maca = item['maca'])
        item['danhsachdichvu'] = ServiceDetailsSerializer(query1, many=True).data
        item['danhsachmonan'] = FoodDetailsSerializer(query2, many=True).data
        item['thongtinsanh'] = LobbySerializer(query3, many = True).data[0]
        item['thongtinca'] = ShiftSerializer(query4, many = True).data[0]
        
    serialized_data = {
        
        'weddings': serializer.data,
        'foods': food_serializer.data,
        'services': service_serializer.data,
        
    }
    # cache.set('searchPartyBooking', serializer.data, timeout=60*30)
    
    # return serializer.data
    return render(request, 'searchResult.html',serialized_data)
    # return Response(serializer.data)

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
# @api_view(['POST'])
def bookingPartyWeddingAPI(request):
    data = json.loads(request.body)
    # Tạo mã phiếu đặt tiệc theo định dạng 'TC****' Ví dụ: 'TC0001'
    matieccuoi = getNextID(Phieudattieccuoi, 'matieccuoi')
    
    # Lưu trữ thông tin đặt tiệc của khách hàng.
    party_booking_info = {
        'matieccuoi': matieccuoi,
        'ngaydat': data.get('ngaydattiec'),
        'ngaydaitiec': data.get('ngaydaitiec'),
        'soluongban': data.get('soluongban'),
        'soluongbandutru': 0,
        'dongiaban': data.get('dongiaban'),
        'tongtienban': data.get('tongtienban'),
        'tongtiendichvu': data.get('tongtiendichvu'),
        'tongtiendattiec': data.get('tongtiendattiec'),
        'conlai': data.get('conlai'),
        'tiendatcoc': data.get('tiendatcoc'),
        'tencodau': data.get('tencodau'),
        'tenchure': data.get('tenchure'),
        'sdt': data.get('sdt'),
        'tinhtrangphancong': None,
        'maca': data.get('maca'),
        'masanh': data.get('masanh'),
        'username': 'taitai'
    }

    partyBookingForm = PartyBookingFormSerializer(data=party_booking_info)
    if partyBookingForm.is_valid():
        partyBookingForm.save() #Lưu trữ thông tin khách hàng và thông tin đặt tiệc vào bảng Phieuchitietdattiec trong database
        # Lưu trữ thông tin món ăn đã đặt vào bảng Chitietmonan trong database
        foodList = data.get('danhsachmonan')
        for food in foodList:
            food['matieccuoi'] = matieccuoi
            foodDetail = FoodDetailsSerializer(data = food)
            if not foodDetail.is_valid():
                Phieudattieccuoi.objects.get(matieccuoi = matieccuoi).delete()
                return Response(foodDetail.errors, status=status.HTTP_400_BAD_REQUEST)
            else: foodDetail.save()
        
        # Lưu trữ thông tin dịch vụ đã đặt vào bảng Chitietmonan trong database
        serviceList = data.get('danhsachdichvu')
        for service in serviceList:
            service['matieccuoi'] = matieccuoi
            serviceDetail = ServiceDetailsSerializer(data = service)
            if not serviceDetail.is_valid():
                Chitietmonan.objects.get(matieccuoi = matieccuoi).delete()
                Phieudattieccuoi.objects.get(matieccuoi = matieccuoi).delete()
                return Response(serviceDetail.errors, status=status.HTTP_400_BAD_REQUEST)
            else: serviceDetail.save()

        cache.delete('searchPartyBooking')
        return redirect('/create')
        
    return Response(partyBookingForm.errors, status=status.HTTP_400_BAD_REQUEST)
# Hiển thị thông tin các món ăn và dịch vụ đã chọn
@api_view(['GET'])
def displayFoodServiceDetailChecked(request):
    matieccuoi = request.GET.get('matieccuoi')
    
    try:
        wedding = Phieudattieccuoi.objects.get(matieccuoi=matieccuoi)
    except Phieudattieccuoi.DoesNotExist:
        return JsonResponse({'error': 'Không tìm thấy phiếu đặt tiệc'}, status=404)
    
    serializer = PartyBookingFormSerializer(wedding)
    
    chitietmonan_query = Chitietmonan.objects.filter(matieccuoi=matieccuoi)
    chitietmonan_serializer = FoodDetailsSerializer(chitietmonan_query, many=True)
    data={
        'wedding': serializer.data,
        'food': chitietmonan_serializer.data
    }
    serializer.data['danhsachmonan'] = chitietmonan_serializer.data
    print(data)
    return JsonResponse(data)
def displayFoodServiceDetailCheckedffff(request):
    matieccuoi = request.GET.get('matieccuoi')
    query = "SELECT * FROM PhieuDatTiecCuoi WHERE PhieuDatTiecCuoi.maTiecCuoi = '{matieccuoi}' "
    try:
        wedding = Phieudattieccuoi.objects.get(matieccuoi=matieccuoi)
        # print("wehiing",wedding)
    except Phieudattieccuoi.DoesNotExist:
        return JsonResponse({'error': 'Không tìm thấy phiếu đặt tiệc'}, status=404)
    serializer = PartyBookingFormSerializer(query, many = False)
    print("wehiing",serializer)
    for item in serializer.data:
        query1 = Chitietdichvu.objects.filter(matieccuoi=item['matieccuoi'])
        query2 = Chitietmonan.objects.filter(matieccuoi=item['matieccuoi'])
        query3 = Sanh.objects.filter(masanh = item['masanh'])
        query4 = Ca.objects.filter(maca = item['maca'])
        item['danhsachdichvu'] = ServiceDetailsSerializer(query1, many=True).data
        item['danhsachmonan'] = FoodDetailsSerializer(query2, many=True).data
        item['thongtinsanh'] = LobbySerializer(query3, many = True).data[0]
        item['thongtinca'] = ShiftSerializer(query4, many = True).data[0]
        
    # selected_foods = list(wedding.danhsachmonan.values_list('mamonan', flat=True))
    # selected_services = list(wedding.danhsachdichvu.values_list('madichvu', flat=True))
    
    # Lấy danh sách tất cả món ăn và dịch vụ
    all_foods = Monan.objects.all()
    all_services = Dichvu.objects.all()
    food_serializer = FoodSerializer(all_foods, many=True)
    
    service_serializer = ServiceSerializer(all_services, many=True)
    
    # Tạo danh sách JSON chứa thông tin món ăn và dịch vụ, đánh dấu các mục đã chọn
    # food_list = [{'id': food.id, 'name': food.tenmonan, 'checked': food.id in selected_foods} for food in all_foods]
    # service_list = [{'id': service.id, 'name': service.tendichvu, 'checked': service.id in selected_services} for service in all_services]
    # print(food_list,service_list)
    return JsonResponse({'foods': food_serializer.data, 'services': service_serializer.data}) 
    
# Thống kê số lượng tiệc trong tháng theo từng ngày
# @api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def countWeddingEventsPerDayInMonthAPI(request):
#     month = request.GET.get('month')
#     year = request.GET.get('year')
#     print(month, year)
#     query = Phieudattieccuoi.objects.raw(f"""
#         SELECT maTiecCuoi, DAY(`ngayDaiTiec`) as Day, COUNT(*) as Count 
#         FROM `PhieuDatTiecCuoi` 
#         WHERE YEAR(`ngayDaiTiec`) = {year} AND MONTH(`ngayDaiTiec`) = {month} 
#         GROUP BY DAY(`ngayDaiTiec`)
#     """)
    
#     result_list = []
#     for item in query:
#         day = item.Day
#         count = item.Count
#         result_list.append({'day': day, 'count': count})
#     print(result_list)
#     return JsonResponse(result_list, safe=False)
# @api_view(['GET'])
# def countWeddingEventsPerMonthAPI(request):
#     year = request.GET.get('year')
#     print( year)
#     query = Phieudattieccuoi.objects.raw(f"""
#         SELECT maTiecCuoi, MONTH(`ngayDaiTiec`) as Month, COUNT(*) as Count 
#         FROM `PhieuDatTiecCuoi` 
#         WHERE YEAR(`ngayDaiTiec`) = {year} 
#         GROUP BY MONTH(`ngayDaiTiec`)
#     """)
    
#     result_list = []
#     for item in query:
#         month = item.Month
#         count = item.Count
#         result_list.append({'month': month, 'count': count})
#     print(result_list)
#     return JsonResponse(result_list, safe=False)

# def countWeddingEventsPerDayInMonthAPI(request):
#     # model_cache = cache.get('countWeddingEventsPerDayInMonth')

#     # if model_cache:
#     #     return Response(model_cache, status=status.HTTP_200_OK) 
    
#     month = request.GET.get('month')
#     year = request.GET.get('year')
#     print(month,year)
    
  
#     # if not month or not year:
#     #     return Response({"error": "month and year query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
#     # query = Phieudattieccuoi.objects.raw(f"SELECT DAY(`ngayDaiTiec`) as Day, COUNT(*) as Count FROM `PhieuDatTiecCuoi` WHERE YEAR(`ngayDaiTiec`) = {year} AND MONTH(`ngayDaiTiec`) = {month} GROUP BY DAY(`ngayDaiTiec`)")
#     # with connection.cursor() as cursor:
#     #     cursor.execute(f"SELECT DAY(`ngayDaiTiec`) as Day, COUNT(*) as Count FROM `PhieuDatTiecCuoi` WHERE YEAR(`ngayDaiTiec`) = {year} AND MONTH(`ngayDaiTiec`) = {month} GROUP BY DAY(`ngayDaiTiec`)")
#     #     data = cursor.fetchall()
    
#     # cache.set('countWeddingEventsPerDayInMonth', data, timeout=60*30)
    
#     # return Response(data, status=status.HTTP_200_OK)
#     return render(request, 'workScheduleChart.html', {"result_list" : result_list})

#Thống kê số lượng tiệc cưới trong ngày theo từng ca
# @api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def countWeddingEventsPerDayAPI(request):
#     date = request.GET.get('date')
#     print(request,date)

#     if not date:
#         return Response({"error": "date query parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
#     query = Phieudattieccuoi.objects.raw(
#         f"SELECT maTiecCuoi, Ca.tenCa, COUNT(*) AS event_count "
#         f"FROM `PhieuDatTiecCuoi`, Ca "
#         f"WHERE PhieuDatTiecCuoi.maCa = Ca.maCa AND PhieuDatTiecCuoi.ngayDaiTiec = '{date}' "
#         f"GROUP BY Ca.tenCa"
#     )
#     results = [{"ca": item.tenCa, "event_count": item.event_count} for item in query]
#     print(results)
#     return JsonResponse(results, safe=False)





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


