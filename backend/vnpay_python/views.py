from backend.settings import *
from vnpay_python.vnpay import vnpay
from datetime import datetime
from django.http import JsonResponse

def payment(request):
    """
    Tạo URL thanh toán.

    Tham số:
    - request: Đối tượng HttpRequest chứa thông tin yêu cầu HTTP.
    + order_id (str): Mã hoá đơn thanh toán.
    + amount (int): Số tiền thanh toán.

    Trả về:
    - JsonResponse: URL thanh toán.
    """
    order_type = "billpayment"
    order_id = request.POST.get('order_id')
    amount =int(request.POST.get('amount'))
    order_desc = f"Thanh toán hoá đơn {order_id}"
    bank_code = 'VNPAYQR'
    language = "vn"
    ipaddr = get_client_ip(request)
    # Build URL Payment
    vnp = vnpay()
    vnp.requestData['vnp_Version'] = '2.1.0'
    vnp.requestData['vnp_Command'] = 'pay'
    vnp.requestData['vnp_TmnCode'] = VNPAY_TMN_CODE
    vnp.requestData['vnp_Amount'] = amount * 100
    vnp.requestData['vnp_CurrCode'] = 'VND'
    vnp.requestData['vnp_TxnRef'] = order_id
    vnp.requestData['vnp_OrderInfo'] = order_desc
    vnp.requestData['vnp_OrderType'] = order_type
    # Check language, default: vn
    if language and language != '':
        vnp.requestData['vnp_Locale'] = language
    else:
        vnp.requestData['vnp_Locale'] = 'vn'
    # Check bank_code, if bank_code is empty, customer will be selected bank on VNPAY
    if bank_code and bank_code != "":
        vnp.requestData['vnp_BankCode'] = bank_code

    vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')  # 20150410063022
    vnp.requestData['vnp_IpAddr'] = ipaddr
    vnp.requestData['vnp_ReturnUrl'] = VNPAY_RETURN_URL
    vnpay_payment_url = vnp.get_payment_url(VNPAY_PAYMENT_URL, VNPAY_HASH_SECRET_KEY)
    print(vnpay_payment_url)   
    return JsonResponse({'payment_url': vnpay_payment_url})

#Đây là code mẫu trên là code đã được chỉnh sửa để phù hợp với hệ thống
# def payment(request):

#     if request.method == 'POST':
#         # Process input data and build url payment
#         form = PaymentForm(request.POST)
#         if form.is_valid():
#             order_type = form.cleaned_data['order_type']
#             order_id = form.cleaned_data['order_id']
#             amount = form.cleaned_data['amount']
#             order_desc = form.cleaned_data['order_desc']
#             bank_code = form.cleaned_data['bank_code']
#             language = form.cleaned_data['language']
#             ipaddr = get_client_ip(request)
#             # Build URL Payment
#             vnp = vnpay()
#             vnp.requestData['vnp_Version'] = '2.1.0'
#             vnp.requestData['vnp_Command'] = 'pay'
#             vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
#             vnp.requestData['vnp_Amount'] = amount * 100
#             vnp.requestData['vnp_CurrCode'] = 'VND'
#             vnp.requestData['vnp_TxnRef'] = order_id
#             vnp.requestData['vnp_OrderInfo'] = order_desc
#             vnp.requestData['vnp_OrderType'] = order_type
#             # Check language, default: vn
#             if language and language != '':
#                 vnp.requestData['vnp_Locale'] = language
#             else:
#                 vnp.requestData['vnp_Locale'] = 'vn'
#                 # Check bank_code, if bank_code is empty, customer will be selected bank on VNPAY
#             if bank_code and bank_code != "":
#                 vnp.requestData['vnp_BankCode'] = bank_code

#             vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')  # 20150410063022
#             vnp.requestData['vnp_IpAddr'] = ipaddr
#             vnp.requestData['vnp_ReturnUrl'] = settings.VNPAY_RETURN_URL
#             vnpay_payment_url = vnp.get_payment_url(settings.VNPAY_PAYMENT_URL, settings.VNPAY_HASH_SECRET_KEY)
#             print(vnpay_payment_url)
#             return redirect(vnpay_payment_url)
#         else:
#             print("Form input not validate")
#     else:
#         return render(request, "payment.html", {"title": "Thanh toán"})
    
def get_client_ip(request):
    """
    Trích xuất địa chỉ IP của client từ yêu cầu HTTP.

    Tham số:
    - request: Đối tượng HttpRequest chứa thông tin yêu cầu HTTP.

    Trả về:
    - str: Địa chỉ IP của client.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
