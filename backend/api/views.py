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
from datetime import datetime,timedelta
from django.utils.timezone import now
from django.db import transaction
from django.contrib.auth.decorators import login_required
from .pdf import *
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
import io
from decimal import Decimal,ROUND_HALF_UP

import json


def login(request):
    """
    Xử lý yêu cầu đăng nhập của người dùng.

    Nếu yêu cầu là phương thức POST, hàm này sẽ kiểm tra thông tin đăng nhập của người dùng,
    xác minh và đăng nhập họ nếu thông tin hợp lệ. Sau đó, chuyển hướng người dùng đến trang chính.

    url: "/login/" method="POST"

    Tham số:
        -request (HttpRequest): Đối tượng request chứa thông tin yêu cầu.
        +request.POST['username'] (str): Tên đăng nhập.
        +request.POST['password'] (str): Mật khẩu để nhập vào hệ thống.

    Trả về:
        HttpResponseRedirect: Chuyển hướng người dùng đến trang chính nếu đăng nhập thành công.
        HttpResponse: Hiển thị trang đăng nhập nếu thông tin đăng nhập không chính xác hoặc nếu yêu cầu không phải là phương thức POST.
    """
    if request.method == 'POST':
        user = get_object_or_404(User, username = request.POST['username'])
        password_input = request.POST['password'].encode('utf-8')

        if not bcrypt.checkpw(password_input, user.password.encode('utf-8')) :
            return render(request, 'login.html', {"error": "Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại!"})
        
        auth_login(request, user)
        return redirect('/', {"username": user.username})
    
    return render(request, 'login.html')


def logout(request):
    """
    Xử lý yêu cầu đăng xuất của người dùng.

    url: "/logout/"

    Hàm này đăng xuất người dùng hiện tại khỏi hệ thống và chuyển hướng họ đến trang chính.

    Tham số:
        request (HttpRequest): Đối tượng request chứa thông tin yêu cầu.

    Returns:
        HttpResponseRedirect: Chuyển hướng người dùng đến trang chính sau khi đăng xuất.
    """
    auth_logout(request)
    return redirect("/login/")

def documentPdfView(request, type, id):
    """
    In hoá đơn với dạng file PDF dựa trên loại tài liệu và ID cụ thể.

    Hàm này xử lý hai loại tài liệu: 'bookingPayment' và 'invoicePayment'. 
    Dựa trên loại tài liệu, nó sẽ truy xuất dữ liệu cần thiết từ cơ sở dữ liệu,
    tạo dữ liệu (context) và sử dụng template tương ứng để render PDF.

    url: "/create/pdf/<str:type>/<str:id>" method="GET"

    Tham số:
        -request: HttpRequest object chứa thông tin về request người dùng.
        -type (str): Loại tài liệu cần tạo PDF. Có thể là 'bookingPayment' hoặc 'invoicePayment'.
        -id (str): ID của tài liệu cần tạo PDF.

    Returns:
        HttpResponse: Phản hồi HTTP chứa file PDF được tạo.
    """
    if type == 'bookingPayment':
        bookingDetails = PartyBookingFormSerializer(Phieudattieccuoi.objects.get(matieccuoi=id))
        serviceDetails = Chitietdichvu.objects.filter(matieccuoi=id)
        shiftInfo = Ca.objects.get(maca=bookingDetails.data['maca'])
        parameters = Thamso.objects.all()[0]
        template_path = "invoicePDF_bookingPayment.html"
        context = {'bookingDetails': bookingDetails.data, "serviceDetails": serviceDetails, "shiftInfo": shiftInfo, "parameters": parameters}

    elif type == 'invoicePayment':
        invoiceDetails = InvoiceSerializer(Hoadon.objects.get(mahoadon=id))
        bookingDetails = PartyBookingFormSerializer(Phieudattieccuoi.objects.get(matieccuoi=invoiceDetails.data['matieccuoi']))
        serviceDetails = ChitietDvThanhtoan.objects.filter(mahoadon=id)
        shiftInfo = Ca.objects.get(maca=bookingDetails.data['maca'])
        template_path = "invoicePDF_invoicePayment.html"
        context = {'invoiceDetails': invoiceDetails.data, 'bookingDetails': bookingDetails.data, "serviceDetails": serviceDetails, "shiftInfo": shiftInfo}

    return renderPdfView(template_path, context)

# Trang dashboard

@login_required(login_url='/login/')
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

@login_required(login_url='/login/')
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


def createRevenueReport(date_string, tongtienhoadon):
    """
    Tạo hoặc cập nhật báo cáo doanh thu cho 2 bảng (Baocaodoanhthu, Chitietbaocao) và cập nhật tỷ lệ doanh thu.

    Tham số:
    date_string (str): Ngày cần tạo hoặc cập nhật báo cáo, định dạng 'YYYY-MM-DD'.
    tongtienhoadon (float): Tổng tiền hóa đơn cần thêm vào báo cáo doanh thu.
    """
    date = date_string.split('-')
    year, month = date[0], date[1]

    try:
        bao_cao_doanh_thu = Baocaodoanhthu.objects.get(nam=year, thang=month)
        bao_cao_doanh_thu.updateDoanhThu(tongtienhoadon)
    except Baocaodoanhthu.DoesNotExist:
        data = {
            "mabaocao": getNextID(Baocaodoanhthu, "mabaocao"),
            "thang": month,
            "nam": year,
            "tongdoanhthu": tongtienhoadon
        }
        reportSerializer = RevenueReportSerializer(data=data)
        if reportSerializer.is_valid():
            reportSerializer.save()
            bao_cao_doanh_thu = Baocaodoanhthu.objects.get(nam=year, thang=month)

    try:
        chi_tiet_bao_cao = Chitietbaocao.objects.get(ngay=date_string)
        chi_tiet_bao_cao.updateBaoCao(tongtienhoadon)
    except Chitietbaocao.DoesNotExist:
        data = {
            "mabaocao": bao_cao_doanh_thu.mabaocao,
            "ngay": date_string,
            "soluongtiec": 1,
            "doanhthu": tongtienhoadon,
            "tile": 0
        }
        reportDetailserializer = RevenueReportDetailSerializer(data=data)
        if reportDetailserializer.is_valid():
            reportDetailserializer.save()

    # Update revenue percentage for all Chitietbaocao records
    chi_tiet_bao_cao_all = Chitietbaocao.objects.filter(mabaocao=bao_cao_doanh_thu.mabaocao)
    for detail in chi_tiet_bao_cao_all:
        detail.setTiLe(bao_cao_doanh_thu.tongdoanhthu)

    
    
def report(request):
    return render(request, 'report.html')
def invoice(request):
    return render(request, 'invoice.html')
def search(request):
    """
    Hiển thị tất cả tiệc cưới và các lựa chọn để tìm kiếm tiệc cưới.
    url : 'search/'

    Trả về:
    - render: Một trang HTML chứa thông tin về các tiệc cưới, món ăn, dịch vụ, loại sảnh, ca, loại món ăn và sảnh.
    """
    # Lấy tất cả các món ăn, dịch vụ, loại sảnh, ca, loại món ăn và sảnh
    foods = Monan.objects.all()
    food_serializer = FoodSerializer(foods, many=True)
    services = Dichvu.objects.all()
    service_serializer = ServiceSerializer(services, many=True)
    lobby_types = Loaisanh.objects.all()
    shifts = Ca.objects.all()
    food_types = Loaimonan.objects.all()
    lobbies = Sanh.objects.all()
    # Serialize dữ liệu
    food_serializer = FoodSerializer(foods, many=True)
    food_type_serializer = FoodTypeSerializer(food_types, many=True)
    service_serializer = ServiceSerializer(services, many=True)
    lobby_type_serializer = LobbyTypeSerializer(lobby_types, many=True)
    shift_serializer = ShiftSerializer(shifts, many = True)
    lobby_serializer = LobbySerializer(lobbies, many=True)

    # Truy vấn tiệc cưới chưa có hóa đơn
    query = Phieudattieccuoi.objects.raw('SELECT * FROM PhieuDatTiecCuoi WHERE PhieuDatTiecCuoi.maTiecCuoi not in (SELECT maTiecCuoi FROM HoaDon) ORDER BY PhieuDatTiecCuoi.ngayDaiTiec ASC')
    serializer = PartyBookingFormSerializer(query, many = True)
    serialized_data = {
        'weddings': serializer.data,
        'foods': food_serializer.data,
        'services': service_serializer.data,
        'lobbyTypes': lobby_type_serializer.data,
        'shifts' : shift_serializer.data,
        'foodTypes': food_type_serializer.data, 
        'lobbies': lobby_serializer.data,

    }
    
    # Thêm thông tin chi tiết dịch vụ và món ăn vào từng tiệc cưới
    for item in serializer.data:
        query1 = Chitietdichvu.objects.filter(matieccuoi=item['matieccuoi'])
        query2 = Chitietmonan.objects.filter(matieccuoi=item['matieccuoi'])
        query3 = Sanh.objects.filter(masanh = item['masanh'])
        query4 = Ca.objects.filter(maca = item['maca'])
        item['danhsachdichvu'] = ServiceDetailsSerializer(query1, many=True).data
        item['danhsachmonan'] = FoodDetailsSerializer(query2, many=True).data
        item['thongtinsanh'] = LobbySerializer(query3, many = True).data[0]
        item['thongtinca'] = ShiftSerializer(query4, many = True).data[0]
        
    
    return render(request, 'search.html',serialized_data)


def paymentConfirm(request, wedding_id):
    """
    Xác nhận thanh toán cho tiệc cưới.
    url : 'paymentConfirm/<str:wedding_id>/'
    Tham số:
    - request: HttpRequest object chứa thông tin yêu cầu.
    - wedding_id: mã tiệc cưới.

    Trả về:
    - render: Trả về trang HTML xác nhận thanh toán với thông tin chi tiết về tiệc cưới và các dịch vụ đã chọn.
    """

    wedding = get_object_or_404(Phieudattieccuoi, matieccuoi=wedding_id)
    ngaythanhtoan = now()
    
    
    serializer = PartyBookingFormSerializer(wedding)
    serialized_wedding_data = serializer.data

    serialized_wedding_data['ngaythanhtoan'] = ngaythanhtoan.strftime('%Y-%m-%d')
    serialized_wedding_data['conlai'] = Decimal(wedding.tongtiendattiec) - Decimal(wedding.tiendatcoc)

    songaytre = (ngaythanhtoan.date() - wedding.ngaydaitiec).days
    # Lấy thông tin tỉ lệ phạt từ ThamSo 
    thamso = get_object_or_404(Thamso)
    tilephat = thamso.tilephat
    # Kiểm tra nếu bị trễ, tính tiền phạt theo quy định, nếu không tiền phạt = 0
    if songaytre > 0:
        tienphat = tilephat * Decimal(songaytre) * Decimal(wedding.tongtiendattiec)
    else:
        tienphat = Decimal(0)
    
    serialized_wedding_data['tienphat'] = round(tienphat, 2)
    # Tính tổng tiền hóa đơn 
    tongtienhoadon = tienphat + Decimal(wedding.tongtiendattiec) + Decimal(wedding.tongtiendichvu)
    serialized_wedding_data['tongtienhoadon'] = round(tongtienhoadon, 2)
    # Lấy danh sách chi tiết dịch vụ đã chọn
    ds_dv = Chitietdichvu.objects.filter(matieccuoi=wedding_id)
    services_serializer = ServiceDetailsSerializer(ds_dv, many=True).data
    # Thêm tên dịch vụ vào dữ liệu dịch vụ
    for service_data in services_serializer:
        service_id = service_data['madichvu']
        service_name = Dichvu.objects.get(pk=service_id).tendichvu
        service_data['tendichvu'] = service_name
    

    return render(request, 'paymentConfirm.html', {'wedding':  serialized_wedding_data,'services': services_serializer})

def cancelConfirm(request, wedding_id):
    """
    Xác nhận hủy tiệc cưới.
    url : 'cancelConfirm/<str:wedding_id>/'
    Tham số:
    - request: HttpRequest object chứa thông tin yêu cầu.
    - wedding_id: mã tiệc cưới.

    Trả về:
    - render: Trả về trang HTML xác nhận hủy tiệc cưới với thông tin chi tiết về tiệc cưới và số ngày hủy sớm.
    """
    # Lấy thông tin phiếu đặt tiệc cưới
    wedding = get_object_or_404(Phieudattieccuoi, matieccuoi=wedding_id)
    ngayhuy = now()
    print(ngayhuy.strftime('%Y-%m-%d'))
    # Serialize dữ liệu tiệc cưới
    serializer = PartyBookingFormSerializer(wedding)
    serialized_wedding_data = serializer.data
    serialized_wedding_data['ngayhuy'] = ngayhuy.strftime('%Y-%m-%d')
    serialized_wedding_data['tongtiendichvu'] = 0
    ngaydaitiec = wedding.ngaydaitiec
    # Tính số ngày hủy sớm
    songayhuysom = (ngaydaitiec- ngayhuy.date()).days
   
    if songayhuysom < 7:
        #  Tổng tiền hoá đơn = tổng tiền bàn, tiền còn lại = tiền bàn - tiền cọc.
        serialized_wedding_data['tongtienhoadon']= wedding.tongtienban
        serialized_wedding_data['conlai'] = wedding.tongtienban - wedding.tiendatcoc
    else:
        #  Tổng tiền hoá đơn = tiền cọc, tiền còn lại = 0.
        serialized_wedding_data['tongtienhoadon']= wedding.tiendatcoc
        serialized_wedding_data['conlai'] = 0
    

    return render(request, 'cancelConfirm.html', {'wedding':  serialized_wedding_data,'songayhuysom':abs(songayhuysom)})


# Lưu trữ thông tin thanh toán hoá đơn của khách hàng vào bảng Hoá đơn trong database
@api_view(['POST'])

def paymentInvoiceAPI(request):
    """
    API để tạo mới hoá đơn thanh toán và lưu trữ các dịch vụ đã sử dụng.
    url : 'paymentInvoice/'
    Tham số : HttpRequest object chứa thông tin:
        - mahoadon (str): ID của hoá đơn.
        - ngaythanhtoan (str): Ngày thanh toán.
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

    Trả về: 
        - HttpResponse:: Status code.
    """
    with transaction.atomic():
        mahoadon = getNextID(Hoadon, 'mahoadon')
        request.data['mahoadon'] = mahoadon

        invoice_data = {
            'mahoadon': mahoadon,
            'ngaythanhtoan': request.data.get('ngaythanhtoan'),
            'tongtiendichvu': request.data.get('tongtiendichvu'),
            'tienphat': request.data.get('tienphat'),
            'tongtienhoadon': request.data.get('tongtienhoadon'),
            'conlai': request.data.get('conlai'),
            'matieccuoi': request.data.get('matieccuoi'),
            'username': request.data.get('username'),
        }

        invoice = InvoiceSerializer(data=invoice_data)
        service_list = request.data.get('danhsachdichvu', [])
        
        if not invoice.is_valid():
            print("Invoice validation errors:", invoice.errors)  
            return Response(invoice.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_invoice_data = invoice.validated_data
        ngaythanhtoan = validated_invoice_data['ngaythanhtoan']
        tongtienhoadon = validated_invoice_data['tongtienhoadon']
        
        # Lưu trữ hoá đơn
        invoice.save()

        for service in service_list:
            service_data = {
                'mahoadon': mahoadon,
                'madichvu': service.get('madichvu'),
                'soluong': service.get('soluong'),
                'dongiadichvu': service.get('dongiadichvu'),
                'thanhtien': service.get('thanhtien'),
            }

            detail_service_payment = DetailServicePaymentSerializer(data=service_data)

            if not detail_service_payment.is_valid():
                Hoadon.objects.filter(mahoadon=mahoadon).delete()
                return Response(detail_service_payment.errors, status=status.HTTP_400_BAD_REQUEST)
            
            detail_service_payment.save()

        # Gọi hàm thống kê doanh thu với ngày thanh toán và tổng tiền hóa đơn của hóa đơn vừa tạo 
        createRevenueReport(str(ngaythanhtoan), tongtienhoadon)
        
        return Response({"message": "Hoá đơn được tạo thành công", "mahoadon": mahoadon}, status=status.HTTP_201_CREATED)

def updateWeddingInfo(request, wedding_id):
    """
    Cập nhật thông tin tiệc cưới.
    url : 'wedding/update/<str:wedding_id>/'
    Tham số:
    - wedding_id (int): Mã của tiệc cưới cần được cập nhật.
    - request : HttpRequest object chứa thông tin: 
        - tencodau (str): Tên của cô dâu.
        - tenchure (str): Tên của chú rể.
        - ngaydattiec (str): Ngày đặt tiệc.
        - ngaydaitiec (str): Ngày đãi tiệc.
        - maca (int): Mã của ca tiệc.
        - masanh (int): Mã của sảnh tiệc.

    Trả về:
        - Nếu cập nhật thành công: Chuyển hướng đến trang '/search'.
    """
    wedding = get_object_or_404(Phieudattieccuoi, matieccuoi=wedding_id)
    # Cập nhật thông tin từ dữ liệu POST
    if request.method == 'POST':
        wedding.tencodau = request.POST.get('tencodau')
        wedding.tenchure = request.POST.get('tenchure')
        wedding.ngaydattiec = request.POST.get('ngaydattiec')
        wedding.ngaydaitiec = request.POST.get('ngaydaitiec')
        maca_id = request.POST.get('maca')
        maca_instance = get_object_or_404(Ca, maca=maca_id)
        wedding.maca = maca_instance
        masanh_id = request.POST.get('masanh')
        masanh_instance = get_object_or_404(Sanh, masanh=masanh_id)
        wedding.masanh = masanh_instance
        
        wedding.save()
        return redirect('/search')
    
    # return render(request, 'searchResult.html')


@login_required(login_url='/login/')
def create(request):
    """
    Xử lý lấy danh sách các sảnh, loại sảnh, món ăn, loại món ăn, dịch vụ và ca, 
    sau đó trả về template trang đặt tiệc cưới.
    
    url: '/create/' method="GET"

    Tham số:
    - request: Đối tượng HttpRequest chứa thông tin yêu cầu HTTP.

    Trả về:
    - HttpResponse: Phản hồi HTTP chứa nội dung trang web đã render với dữ liệu đã được serialize.
    """
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
    """
    Xử lý lấy danh sách các món ăn dựa trên loại món ăn và trả về trang web.
    
    url: '/getFoodTable/<str:type>/' method="GET"

    Tham số:
    - request: Đối tượng HttpRequest chứa thông tin yêu cầu HTTP.
    - type (str): loại món ăn hoặc 'all' để lấy tất cả các món ăn.

    Trả về:
    - HttpResponse: Phản hồi HTTP chứa nội dung trang web đã render với danh sách các món ăn.

    """
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


@api_view(['GET'])

def apiView(request, model_name=None):
    """
    Xử lý yêu cầu GET cho một model cụ thể và trả về danh sách các đối tượng của model đó.

    Hàm này sử dụng model_serializer_map để ánh xạ tên model (model_name) tới model, serializer 
    và khóa chính (key) tương ứng. Nó kiểm tra tính hợp lệ của model_name, truy vấn tất cả các 
    đối tượng từ model, và serialize chúng trước khi trả về dữ liệu dưới dạng JSON.

    Tham số:
    - request: Đối tượng HttpRequest chứa thông tin về yêu cầu HTTP.
    - model_name (str, optional): Tên của model cần truy vấn. Đây là tham số động trong URL.

    Trả về:
    - Response: Phản hồi HTTP chứa dữ liệu JSON của các đối tượng được truy vấn. 
      Nếu model_name không hợp lệ, trả về phản hồi với lỗi và trạng thái HTTP 400.
    """
    if not model_serializer_map.get(model_name):
        return Response({'error': 'Invalid model name'}, status=status.HTTP_400_BAD_REQUEST)
    
    model, serializer_class, key = model_serializer_map[model_name]

    query = model.objects.all()
    serializer = serializer_class(query, many=True)
    return Response(serializer.data)
    
@login_required(login_url='/login/')
@api_view(['GET'])

def searchPartyBookingFormAPI(request):
    """
    Tìm kiếm thông tin tiệc cưới. Chỉnh sửa thông tin tiệc cưới nếu đủ điều kiện. (< 7 ngày trước ngày đãi tiệc )
    url : 'searchParty/'
    Tham số:HttpRequest object chứa thông tin : 
    - tenchure (str): Tên chú rể để lọc tiệc cưới
    - tencodau (str): Tên cô dâu để lọc tiệc cưới
    - maca (str): Mã ca để lọc tiệc cưới
    - masanh (str): Mã sảnh để lọc tiệc cưới
    - ngaydattiec (date): Ngày đặt tiệc để lọc tiệc cưới
    - ngaydaitiec (date): Ngày đãi tiệc để lọc tiệc cưới
    - soluongban (number): Số lượng bàn để lọc tiệc cưới
    
    Trả về:
    - render: Một trang HTML chứa thông tin về các tiệc cưới, món ăn, dịch vụ, ca, sảnh.
    """

    tenchure = request.GET.get('tenchure', '')
    tencodau = request.GET.get('tencodau', '')
    maca = request.GET.get('maca', '')
    masanh = request.GET.get('masanh', '')
    ngaydattiec = request.GET.get('ngaydattiec', '')
    ngaydaitiec = request.GET.get('ngaydaitiec', '')
    soluongban = request.GET.get('soluongban', '')
    

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
    

    # Ghép các điều kiện vào câu truy vấn nếu có điều kiện nào
    if conditions:
        query += " AND " + " AND ".join(conditions)

    query += " ORDER BY PhieuDatTiecCuoi.ngayDaiTiec DESC"
    # Tìm kiêm tiệc cưới với câu truy vấn 
    query_f = Phieudattieccuoi.objects.raw(query) 
    serializer = PartyBookingFormSerializer(query_f, many = True)    
    #   Thông tin tất cả món ăn, dịch vụ, ca, sảnh 
    foods = Monan.objects.all()
    food_serializer = FoodSerializer(foods, many=True)
    services = Dichvu.objects.all()
    service_serializer = ServiceSerializer(services, many=True)
    shifts = Ca.objects.all()
    lobbies = Sanh.objects.all()
    shift_serializer = ShiftSerializer(shifts, many = True)
    lobby_serializer = LobbySerializer(lobbies, many=True)
    
    # Giá trị ngày hôm nay 
    today = datetime.today().date()
    
    for item in serializer.data:
        query1 = Chitietdichvu.objects.filter(matieccuoi=item['matieccuoi'])
        query2 = Chitietmonan.objects.filter(matieccuoi=item['matieccuoi'])
        query3 = Sanh.objects.filter(masanh = item['masanh'])
        query4 = Ca.objects.filter(maca = item['maca'])
        item['danhsachdichvu'] = ServiceDetailsSerializer(query1, many=True).data
        item['danhsachmonan'] = FoodDetailsSerializer(query2, many=True).data
        item['thongtinsanh'] = LobbySerializer(query3, many = True).data[0]
        item['thongtinca'] = ShiftSerializer(query4, many = True).data[0]
        # Kiểm tra điều kiện nếu còn 7 ngày đến ngày đãi tiệc không cho phép chỉnh sửa thông tin tiệc cưới 
        item['within_7_days'] = datetime.strptime(item['ngaydaitiec'], '%Y-%m-%d').date() <= today + timedelta(days=7)
        
    serialized_data = {
    
        'weddings': serializer.data,
        'foods': food_serializer.data,
        'services': service_serializer.data,
        'shifts' : shift_serializer.data,
        'lobbies': lobby_serializer.data,
        
    }
    return render(request, 'searchResult.html',serialized_data)


def availablelobbiesList(request):
    """
    Xử lý lấy danh sách các sảnh có sẵn cho tiệc cưới dựa trên mã ca và ngày đãi tiệc.

    url: "create/bookingParty/bollies/available/" method: " POST"

    Tham số:
    - request: Đối tượng HttpRequest chứa thông tin về yêu cầu HTTP.
        + maca (str): mã ca.
        + ngaydaitiec (str): ngày đãi tiệc.

    Trả về:
    -  Phản hồi HTTP render template 'selectLobbies.html' với danh sách các sảnh có sẵn 
      nếu các tham số hợp lệ. Nếu không, render template mà không có dữ liệu sảnh.

    """
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
def bookingPartyWedding(request):
    """
    Đặt tiệc cưới và lưu trữ thông tin vào cơ sở dữ liệu.
    url: "create/bookingParty/" method: " POST"

    Tham số:
    - request: Đối tượng HttpRequest chứa thông tin về yêu cầu HTTP.

    Trả về:
    - JsonResponse: Phản hồi HTTP chứa mã phiếu đặt tiệc cưới mới nếu thành công.
    - Response: Phản hồi HTTP với lỗi và trạng thái HTTP 400 nếu có lỗi xảy ra.

    Ví dụ:
    - Yêu cầu POST với dữ liệu JSON:
      {
        "ngaydattiec": "2024-05-25",
        "ngaydaitiec": "2024-06-30",
        "soluongban": 10,
        "dongiaban": 500000,
        "tongtienban": 5000000,
        "tongtiendichvu": 2000000,
        "tongtiendattiec": 7000000,
        "conlai": 2000000,
        "tiendatcoc": 5000000,
        "tencodau": "Nguyen Thi A",
        "tenchure": "Tran Van B",
        "sdt": "0123456789",
        "maca": "1",
        "masanh": "S01",
        "danhsachmonan": [],
        "danhsachdichvu": []
      }
    """
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
        return JsonResponse({'matieccuoi': matieccuoi})
        
    return Response(partyBookingForm.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def addFoodDetail(request):
    """
    Thêm thông tin các món ăn trong tiệc cưới đã đặt.
    Tham số:
    - request: HttpRequest object chứa thông tin 'matieccuoi' và 'danhsachmonan'
    
    Trả về:
    - redirect: Chuyển hướng đến trang tìm kiếm nếu thành công
    - Response: Trả về lỗi nếu có bất kỳ vấn đề nào xảy ra
    """
    try:
        matieccuoi_id = request.data.get('matieccuoi')
        danhsachmonan = request.data.get('danhsachmonan')

        try:
            phieudattieccuoi = Phieudattieccuoi.objects.get(matieccuoi=matieccuoi_id)
        except Phieudattieccuoi.DoesNotExist:
            return Response({"error": "Phieudattieccuoi không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        

        # Xóa danh sách món ăn trước đó, sau đó thêm lại với danh sách mới đã chỉnh sửa 
        Chitietmonan.objects.filter(matieccuoi=matieccuoi_id).delete()

        soluongban = phieudattieccuoi.soluongban
        tongdongiaban = Decimal('0.00')

        for food in danhsachmonan:
            food['matieccuoi'] = matieccuoi_id
            food['mamonan'] = food.get('mamonan')
            food['ghichu'] = food.get('ghichu', '')

            try:
                monan_obj = Monan.objects.get(mamonan=food['mamonan'])
            except Monan.DoesNotExist:
                return Response({"error": f" Mã món ăn không tồn tại."}, status=status.HTTP_400_BAD_REQUEST)

            food['dongiamonan'] = monan_obj.dongia
            food['soluong'] = soluongban

            foodDetail = FoodDetailsSerializer(data=food)

            if not foodDetail.is_valid():
                return Response(foodDetail.errors, status=status.HTTP_400_BAD_REQUEST)

            foodDetail.save()

            
            tongdongiaban += monan_obj.dongia

        # Cập nhật lại đơn giá bàn và tổng tiền bàn trong Phieudattieccuoi khi món ăn thay đổi 
        phieudattieccuoi.dongiaban = tongdongiaban
        phieudattieccuoi.tongtienban = tongdongiaban * soluongban

        
        phieudattieccuoi.save()

        return redirect('/search')

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def addServiceDetail(request):
    """
    Thêm thông tin các dịch vụ trong tiệc cưới đã đặt.

    Tham số:
    - request: HttpRequest object chứa thông tin 'matieccuoi' và 'danhsachdichvu'
    
    Trả về:
    - redirect: Chuyển hướng đến trang tìm kiếm nếu thành công
    - Response: Trả về lỗi nếu có bất kỳ vấn đề nào xảy ra
    """
    try:
        matieccuoi_id = request.data.get('matieccuoi')
        danhsachdichvu = request.data.get('danhsachdichvu')

        try:
            phieudattieccuoi = Phieudattieccuoi.objects.get(matieccuoi=matieccuoi_id)
        except Phieudattieccuoi.DoesNotExist:
            return Response({"error": "Phieudattieccuoi không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        # Xóa thông tin dịch vụ đã có trước đó. Sau đó thêm lại bằng dịch vụ mới 
        Chitietdichvu.objects.filter(matieccuoi=matieccuoi_id).delete()

        tongtiendichvu = Decimal('0.00')

        for service_id in danhsachdichvu:
            service = {
                'matieccuoi': matieccuoi_id,
                'madichvu': service_id,
                'soluong': 1,
            }

            try:
                dichvu_obj = Dichvu.objects.get(madichvu=service_id)
            except Dichvu.DoesNotExist:
                return Response({"error": f"Mã dịch vụ không tồn tại."}, status=status.HTTP_400_BAD_REQUEST)

            service['dongiadichvu'] = dichvu_obj.dongia
            service['soluong'] = 1

            serviceDetail = ServiceDetailsSerializer(data=service)

            if not serviceDetail.is_valid():
                return Response(serviceDetail.errors, status=status.HTTP_400_BAD_REQUEST)

            serviceDetail.save()

            
            tongtiendichvu += dichvu_obj.dongia

        
        phieudattieccuoi.tongtiendichvu = tongtiendichvu
        phieudattieccuoi.save()

        return redirect('/search')

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def displayFoodDetailChecked(request):
    """
    Hiển thị thông tin các món ăn đã chọn và tất cả các món ăn.

    Tham số:
    - request: HttpRequest object chứa thông tin 'matieccuoi'

    Trả về:
    - render: Trả về trang HTML chứa thông tin về tiệc cưới, các món ăn đã chọn và tất cả các món ăn
    """
    matieccuoi = request.GET.get('matieccuoi')

    try:
        # Lấy thông tin phiếu đặt tiệc cưới theo mã tiệc cưới
        wedding = Phieudattieccuoi.objects.get(matieccuoi=matieccuoi)
    except Phieudattieccuoi.DoesNotExist:
        return JsonResponse({'error': 'Không tìm thấy phiếu đặt tiệc'}, status=404)

    # Serialize dữ liệu tiệc cưới
    serializer = PartyBookingFormSerializer(wedding)
    # Lấy tất cả các món ăn
    foods = Monan.objects.all()
    food_serializer = FoodSerializer(foods, many=True)
    # Lấy các món ăn đã chọn cho tiệc cưới
    chitietmonan_query = Chitietmonan.objects.filter(matieccuoi=matieccuoi)
    chitietmonan_serializer = FoodDetailsSerializer(chitietmonan_query, many=True)

    data = {
        'wedding': serializer.data,
        'selectedfood': chitietmonan_serializer.data,
        'allfoods': food_serializer.data,
    }
    serializer.data['danhsachmonan'] = chitietmonan_serializer.data

    return render(request, 'addFoodTable.html', data)
    

@api_view(['GET'])
def displayServiceDetailChecked(request):
    """
    Hiển thị thông tin các dịch vụ đã chọn và tất cả các dịch vụ.

    Tham số:
    - request: HttpRequest object chứa thông tin 'matieccuoi'

    Trả về:
    - render: Trả về trang HTML chứa thông tin về tiệc cưới, các dịch vụ đã chọn và tất cả các dịch vụ
    """
    matieccuoi = request.GET.get('matieccuoi')

    try:
        # Lấy thông tin phiếu đặt tiệc cưới theo mã tiệc cưới
        wedding = Phieudattieccuoi.objects.get(matieccuoi=matieccuoi)
    except Phieudattieccuoi.DoesNotExist:
        return JsonResponse({'error': 'Không tìm thấy phiếu đặt tiệc'}, status=404)

    # Serialize dữ liệu tiệc cưới
    serializer = PartyBookingFormSerializer(wedding)
    # Lấy tất cả các dịch vụ
    services = Dichvu.objects.all()
    service_serializer = ServiceSerializer(services, many=True)
    # Lấy các dịch vụ đã chọn cho tiệc cưới
    chitietdichvu_query = Chitietdichvu.objects.filter(matieccuoi=matieccuoi)
    chitietdichvu_serializer = ServiceDetailsSerializer(chitietdichvu_query, many=True)

    data = {
        'wedding': serializer.data,
        'selectedservice': chitietdichvu_serializer.data,
        'allservices': service_serializer.data,
    }

    
    return render(request, 'addServiceTable.html',data)
   

