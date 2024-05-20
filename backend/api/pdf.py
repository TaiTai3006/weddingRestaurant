import os
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.contrib.staticfiles import finders
import io

def link_callback(uri, rel):
    """
    Convert HTML URIs to absolute system paths so xhtml2pdf can access those
    resources
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
    # Tạo một đối tượng HttpResponse của Django, và xác định content_type là pdf
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
    
    response['Content-Disposition'] = f'inline; filename="report_${id}.pdf"'
    
    return response