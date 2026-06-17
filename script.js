// گرفتن فرم ورود از صفحه
const loginForm = document.querySelector("form");

// گرفتن فیلد شماره موبایل
const mobileInput = document.querySelector('input[name="mobile"]');

// گرفتن فیلد رمز عبور
const passwordInput = document.querySelector('input[name="password"]');

// گرفتن دکمه ورود
const loginButton = document.querySelector('button[type="submit"]');


// ساختن باکس پیام برای خطا یا موفقیت
const messageBox = document.createElement("div");
messageBox.className = "message-box";

// اضافه کردن باکس پیام به فرم
loginForm.appendChild(messageBox);


// تابع نمایش پیام
function showMessage(text, type) {
  messageBox.textContent = text;

  if (type === "error") {
    messageBox.style.color = "#d93025";
  }

  if (type === "success") {
    messageBox.style.color = "#0f4a43";
  }

  messageBox.style.marginTop = "15px";
  messageBox.style.textAlign = "center";
  messageBox.style.fontSize = "13px";
  messageBox.style.fontWeight = "bold";
}


// تابع بررسی فرمت شماره موبایل ایران
function isValidMobile(mobile) {
  const mobilePattern = /^09[0-9]{9}$/;
  return mobilePattern.test(mobile);
}


// زمانی که کاربر روی دکمه ورود کلیک می‌کند
loginForm.addEventListener("submit", async function (event) {
  // جلوگیری از رفرش شدن صفحه
  event.preventDefault();

  // گرفتن مقدار شماره موبایل
  const mobile = mobileInput.value.trim();

  // گرفتن مقدار رمز عبور
  const password = passwordInput.value.trim();

  // بررسی خالی نبودن شماره موبایل
  if (mobile === "") {
    showMessage("لطفاً شماره موبایل خود را وارد کنید.", "error");
    mobileInput.focus();
    return;
  }

  // بررسی درست بودن فرمت شماره موبایل
  if (!isValidMobile(mobile)) {
    showMessage("شماره موبایل باید با 09 شروع شود و 11 رقم باشد.", "error");
    mobileInput.focus();
    return;
  }

  // بررسی خالی نبودن رمز عبور
  if (password === "") {
    showMessage("لطفاً رمز عبور خود را وارد کنید.", "error");
    passwordInput.focus();
    return;
  }

  // بررسی حداقل طول رمز عبور
  if (password.length < 6) {
    showMessage("رمز عبور باید حداقل ۶ کاراکتر باشد.", "error");
    passwordInput.focus();
    return;
  }

  // تغییر حالت دکمه هنگام ارسال اطلاعات
  loginButton.textContent = "در حال بررسی...";
  loginButton.disabled = true;

  try {
    // ارسال اطلاعات فرم به بک‌اند Flask
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mobile: mobile,
        password: password
      })
    });

    // گرفتن جواب بک‌اند
    const result = await response.json();

    // اگر ورود موفق بود
    if (result.success === true) {
      showMessage(result.message, "success");
      
     // پاک کردن mobile و password از URL
  window.history.replaceState({}, document.title, window.location.pathname);


      // اینجا بعداً می‌توانی کاربر را به صفحه پنل منتقل کنی
      // window.location.href = "dashboard.html";
    } else {
      showMessage(result.message, "error");
    }

  } catch (error) {
    // اگر ارتباط با بک‌اند برقرار نشد
    showMessage("اتصال به سرور برقرار نشد.", "error");
  }

  // برگرداندن دکمه به حالت عادی
  loginButton.textContent = "ورود";
  loginButton.disabled = false;
});