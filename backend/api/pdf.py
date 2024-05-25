import os
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.contrib.staticfiles import finders
import io
# Hai function khởi tạo này được cung cấp bởi tài liệu hướng dẫn của thư diện xhtml2pdf
# Nguồn code: https://xhtml2pdf.readthedocs.io/en/latest/usage.html
def link_callback(uri, rel):
    """
    Chuyển đổi một URI thành đường dẫn hệ thống tệp cục bộ.

    Hàm này chuyển đổi các URI thành các đường dẫn tệp tương ứng trên hệ thống tệp 
    cục bộ. Nó thường được sử dụng trong các trường hợp cần chuyển đổi các URI từ 
    tệp tĩnh hoặc phương tiện thành các đường dẫn thực tế để thực hiện các thao tác 
    tệp như đọc hoặc xử lý các tệp.

    Tham số:
        uri (str): URI cần chuyển đổi thành đường dẫn hệ thống tệp.
        rel (str): Một tham số bắt buộc nhưng không được sử dụng trong triển khai hiện tại.

    Trả về:
        str: Đường dẫn hệ thống tệp đã được giải quyết.

    Ngoại lệ:
        RuntimeError: Nếu URI không bắt đầu với STATIC_URL hoặc MEDIA_URL mong đợi,
                      hoặc nếu tệp được giải quyết không tồn tại.
    """
    result = finders.find(uri)
    if result:
        if not isinstance(result, (list, tuple)):
            result = [result]
            result = list(os.path.realpath(path) for path in result)
            path=result[0]
    else:
        sUrl = settings.STATIC_URL        # Typically /static/
        sRoot = settings.STATIC_ROOT      # Typically /home/userX/project_static/
        mUrl = settings.MEDIA_URL         # Typically /media/
        mRoot = settings.MEDIA_ROOT       # Typically /home/userX/project_static/media/

        if uri.startswith(mUrl):
             path = os.path.join(mRoot, uri.replace(mUrl, ""))
        elif uri.startswith(sUrl):
            path = os.path.join(sRoot, uri.replace(sUrl, ""))
        else:
            return uri

            # make sure that file exists
    if not os.path.isfile(path):
        raise RuntimeError(
                            'media URI must start with %s or %s' % (sUrl, mUrl)
                    )
    return path

def renderPdfView(template_path, context):
    """
    Render một template HTML thành file PDF và trả về dưới dạng HttpResponse.

    Hàm này tìm và render template HTML với context được cung cấp, sau đó chuyển đổi 
    kết quả HTML thành PDF và trả về kết quả dưới dạng một phản hồi HTTP.

    Tham số:
        template_path (str): Đường dẫn tới template HTML cần render.
        context (dict): Từ điển chứa các biến và giá trị cần thiết để render template.

    Trả về:
        HttpResponse: Phản hồi HTTP chứa nội dung PDF được render.

    Ngoại lệ:
        Trả về thông báo lỗi nếu quá trình tạo PDF gặp lỗi.
    """
    # Tạo một phản hồi HTTP với loại nội dung là PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="report.pdf"'
    
    # Tìm template và render nó
    template = get_template(template_path)
    html = template.render(context)
    
    # Tạo PDF
    pisa_status = pisa.CreatePDF(
        io.BytesIO(html.encode('UTF-8')), dest=response, link_callback=link_callback)
    
    # Nếu có lỗi thì hiển thị một view báo lỗi
    if pisa_status.err:
        return HttpResponse('Chúng tôi gặp một số lỗi <pre>' + html + '</pre>')
    
    # Đặt tên file PDF trong Content-Disposition cho hiển thị trạng thái xem trước
    response['Content-Disposition'] = f'inline; filename="report.pdf"'
    
    return response