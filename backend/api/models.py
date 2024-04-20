from django.db import models

# Create your models here.
class Loaisanh(models.Model):
    maloaisanh = models.CharField(db_column='maLoaiSanh', primary_key=True, max_length=6)  # Field name made lowercase.
    tenloaisanh = models.CharField(db_column='tenLoaiSanh', max_length=50, blank=True, null=True)  # Field name made lowercase.
    dongiabantoithieu = models.DecimalField(db_column='donGiaBanToiThieu', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'LoaiSanh'
        
class Sanh(models.Model):
    masanh = models.CharField(db_column='maSanh', primary_key=True, max_length=6)  # Field name made lowercase.
    tensanh = models.CharField(db_column='tenSanh', max_length=50, blank=True, null=True)  # Field name made lowercase.
    soluongbantoida = models.IntegerField(db_column='soLuongBanToiDa', blank=True, null=True)  # Field name made lowercase.
    maloaisanh = models.ForeignKey(Loaisanh, models.DO_NOTHING, db_column='maLoaiSanh') 
    img = models.ImageField(upload_to='images')
    ghichu = models.TextField(db_column='ghiChu', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Sanh'

class Chucvu(models.Model):
    machucvu = models.CharField(db_column='maChucVu', primary_key=True, max_length=6)  # Field name made lowercase.
    tenchucvu = models.CharField(db_column='tenChucVu', max_length=30, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ChucVu'

class Taikhoan(models.Model):
    username = models.CharField(db_column='userName', primary_key=True, max_length=30)  # Field name made lowercase.
    password = models.CharField(db_column='passWord', max_length=100, blank=True, null=True) 
    img = models.ImageField(upload_to='images') 
    machucvu = models.ForeignKey(Chucvu, models.DO_NOTHING, db_column='maChucVu')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'TaiKhoan'
    