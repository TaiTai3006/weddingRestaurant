from django.db import models
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

class Ca(models.Model):
    maca = models.CharField(db_column='maCa', primary_key=True, max_length=6)  # Field name made lowercase.
    tenca = models.CharField(db_column='tenCa', max_length=20, blank=True, null=True)  # Field name made lowercase.
    giobatdau = models.TimeField(db_column='gioBatDau', blank=True, null=True)  # Field name made lowercase.
    gioketthuc = models.TimeField(db_column='gioKetThuc', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Ca'

class Phieudattieccuoi(models.Model):
    matieccuoi = models.CharField(db_column='maTiecCuoi', primary_key=True, max_length=6)  # Field name made lowercase.
    ngaydat = models.DateField(db_column='ngayDat', blank=True, null=True)  # Field name made lowercase.
    ngaydaitiec = models.DateField(db_column='ngayDaiTiec', blank=True, null=True)  # Field name made lowercase.
    soluongban = models.IntegerField(db_column='soLuongBan', blank=True, null=True)  # Field name made lowercase.
    soluongbandutru = models.IntegerField(db_column='soLuongBanDuTru', blank=True, null=True)  # Field name made lowercase.
    dongiaban = models.DecimalField(db_column='donGiaBan', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    tongtienban = models.DecimalField(db_column='tongTienBan', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    tongtiendichvu = models.DecimalField(db_column='tongTienDichVu', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    tongtiendattiec = models.DecimalField(db_column='tongTienDatTiec', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    tiendatcoc = models.DecimalField(db_column='tienDatCoc', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    conlai = models.DecimalField(db_column='conLai', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    tencodau = models.CharField(db_column='tenCoDau', max_length=30, blank=True, null=True)  # Field name made lowercase.
    tenchure = models.CharField(db_column='tenChuRe', max_length=30, blank=True, null=True)  # Field name made lowercase.
    sdt = models.CharField(max_length=10, blank=True, null=True)
    maca = models.ForeignKey(Ca, models.DO_NOTHING, db_column='maCa')  # Field name made lowercase.
    masanh = models.ForeignKey('Sanh', models.DO_NOTHING, db_column='maSanh')  # Field name made lowercase.
    username = models.ForeignKey('Taikhoan', models.DO_NOTHING, db_column='userName')  # Field name made lowercase.
    tinhtrangphancong = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'PhieuDatTiecCuoi'

class Dichvu(models.Model):
    madichvu = models.CharField(db_column='maDichVu', primary_key=True, max_length=6)  # Field name made lowercase.
    tendichvu = models.CharField(db_column='tenDichVu', max_length=30, blank=True, null=True)  # Field name made lowercase.
    img = models.CharField(max_length=100, blank=True, null=True)
    dongia = models.DecimalField(db_column='donGia', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'DichVu'

class Chitietdichvu(models.Model):
    matieccuoi = models.OneToOneField('Phieudattieccuoi', models.DO_NOTHING, db_column='maTiecCuoi', primary_key=True)  # Field name made lowercase. The composite primary key (maTiecCuoi, maDichVu) found, that is not supported. The first column is selected.
    madichvu = models.ForeignKey('Dichvu', models.DO_NOTHING, db_column='maDichVu')  # Field name made lowercase.
    soluong = models.IntegerField(db_column='soLuong', blank=True, null=True)  # Field name made lowercase.
    dongiadichvu = models.DecimalField(db_column='donGiaDichVu', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    thanhtien = models.DecimalField(db_column='thanhTien', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ChiTietDichVu'
        unique_together = (('matieccuoi', 'madichvu'),)

class Loaimonan(models.Model):
    maloaimonan = models.CharField(db_column='maLoaiMonAn', primary_key=True, max_length=6)  # Field name made lowercase.
    tenloaimonan = models.CharField(db_column='tenLoaiMonAn', max_length=30, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'LoaiMonAn'
class Monan(models.Model):
    mamonan = models.CharField(db_column='maMonAn', primary_key=True, max_length=6)  # Field name made lowercase.
    tenmonan = models.CharField(db_column='tenMonAn', max_length=30, blank=True, null=True)  # Field name made lowercase.
    dongia = models.DecimalField(db_column='donGia', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    img = models.CharField(max_length=100, blank=True, null=True)
    maloaimonan = models.ForeignKey(Loaimonan, models.DO_NOTHING, db_column='maLoaiMonAn')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'MonAn'

class Chitietmonan(models.Model):
    mamonan = models.OneToOneField('Monan', models.DO_NOTHING, db_column='maMonAn', primary_key=True)  # Field name made lowercase. The composite primary key (maMonAn, maTiecCuoi) found, that is not supported. The first column is selected.
    matieccuoi = models.ForeignKey('Phieudattieccuoi', models.DO_NOTHING, db_column='maTiecCuoi')  # Field name made lowercase.
    dongiamonan = models.DecimalField(db_column='donGiaMonAn', max_digits=15, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    soluong = models.IntegerField(db_column='soLuong', blank=True, null=True)  # Field name made lowercase.
    ghichu = models.TextField(db_column='ghiChu', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ChiTietMonAn'
        unique_together = (('mamonan', 'matieccuoi'),)