from django.contrib import admin
from .models import Loaisanh, Sanh, Chucvu, Taikhoan, Ca, Phieudattieccuoi, Dichvu, Chitietdichvu, Loaimonan, Monan, Chitietmonan, Baocaodoanhthu, Chitietbaocao, Congviec, Nhanvien, Phancong, Hoadon, ChitietDvThanhtoan, Thamso
import bcrypt
from django.contrib.auth.models import User

#Thêm chức năng mã hoá mật khẩu trước khi lưu trữ vào TaiKhoan
class MyModelAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        password = request.POST.get('password')
        bytes = password.encode('utf-8') 
        salt = bcrypt.gensalt() 
        # Thực hiện các xử lý đặc biệt trước khi tạo đối tượng
        if not change:
            obj.password = bcrypt.hashpw(bytes, salt).decode('utf-8')
            User.objects.create(username=request.POST['username'], password=obj.password)
        
        # Gọi phương thức lưu mặc định
        super().save_model(request, obj, form, change)
        
#Đăng kí model hiển thị trong trang admin
admin.site.register(Loaisanh)
admin.site.register(Sanh)
admin.site.register(Chucvu)
admin.site.register(Taikhoan, MyModelAdmin) #Them vao admin
admin.site.register(Ca)
admin.site.register(Phieudattieccuoi)
admin.site.register(Dichvu)
admin.site.register(Chitietdichvu)
admin.site.register(Loaimonan)
admin.site.register(Monan)
admin.site.register(Chitietmonan)
admin.site.register(Baocaodoanhthu)
admin.site.register(Chitietbaocao)
admin.site.register(Congviec)
admin.site.register(Nhanvien)
admin.site.register(Phancong)
admin.site.register(Hoadon)
admin.site.register(ChitietDvThanhtoan)
admin.site.register(Thamso)
