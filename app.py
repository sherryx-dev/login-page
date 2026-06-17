# وارد کردن کتابخانه‌های لازم
from flask import Flask, request, jsonify
from flask_cors import CORS
import re

# ساخت برنامه Flask
app = Flask(__name__)

# فعال کردن CORS برای اتصال فرانت‌اند به بک‌اند
CORS(app)

# دیتای تستی کاربرها
# بعداً این بخش باید به دیتابیس وصل شود
users = {
    "09123456789": {
        "password": "123456",
        "name": "کاربر تست"
    }
}

# تابع بررسی فرمت شماره موبایل
def is_valid_mobile(mobile):
    pattern = r"^09[0-9]{9}$"
    return re.match(pattern, mobile)


# مسیر تست سلامت بک‌اند
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Backend فعال است"
    })


# مسیر ورود کاربر
@app.route("/login", methods=["POST"])
def login():
    # گرفتن اطلاعات ارسال‌شده از فرانت‌اند
    data = request.get_json()

    # گرفتن شماره موبایل و رمز عبور
    mobile = data.get("mobile")
    password = data.get("password")

    # بررسی خالی نبودن شماره موبایل
    if not mobile:
        return jsonify({
            "success": False,
            "message": "شماره موبایل را وارد کنید"
        }), 400

    # بررسی فرمت شماره موبایل
    if not is_valid_mobile(mobile):
        return jsonify({
            "success": False,
            "message": "شماره موبایل معتبر نیست"
        }), 400

    # بررسی خالی نبودن رمز عبور
    if not password:
        return jsonify({
            "success": False,
            "message": "رمز عبور را وارد کنید"
        }), 400

    # بررسی وجود کاربر
    if mobile not in users:
        return jsonify({
            "success": False,
            "message": "کاربری با این شماره پیدا نشد"
        }), 404

    # بررسی درست بودن رمز عبور
    if users[mobile]["password"] != password:
        return jsonify({
            "success": False,
            "message": "رمز عبور اشتباه است"
        }), 401

    # اگر همه چیز درست بود
    return jsonify({
        "success": True,
        "message": "ورود با موفقیت انجام شد",
        "user": {
            "mobile": mobile,
            "name": users[mobile]["name"]
        }
    }), 200


# مسیر ثبت نام کاربر
@app.route("/register", methods=["POST"])
def register():
    # گرفتن اطلاعات از فرانت‌اند
    data = request.get_json()

    mobile = data.get("mobile")
    password = data.get("password")
    name = data.get("name")

    # بررسی شماره موبایل
    if not mobile or not is_valid_mobile(mobile):
        return jsonify({
            "success": False,
            "message": "شماره موبایل معتبر نیست"
        }), 400

    # بررسی رمز عبور
    if not password or len(password) < 6:
        return jsonify({
            "success": False,
            "message": "رمز عبور باید حداقل ۶ کاراکتر باشد"
        }), 400

    # بررسی تکراری نبودن شماره موبایل
    if mobile in users:
        return jsonify({
            "success": False,
            "message": "این شماره قبلاً ثبت شده است"
        }), 409

    # ذخیره کاربر جدید
    users[mobile] = {
        "password": password,
        "name": name or "کاربر جدید"
    }

    return jsonify({
        "success": True,
        "message": "ثبت نام با موفقیت انجام شد"
    }), 201


# اجرای سرور
if __name__ == "__main__":
    app.run(debug=True)