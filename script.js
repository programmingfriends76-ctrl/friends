/* ============================================
   ملف JavaScript الرئيسي لموقع "طموح"
   
   ما هو JavaScript؟
   JavaScript هي لغة برمجة تجعل الصفحة تتفاعل.
   HTML = الهيكل | CSS = الشكل | JS = التفاعل
   
   المبدأ الأساسي:
   1. نختار عنصرًا من HTML
   2. نراقب حدثًا (ضغطة، تمرير، كتابة...)
   3. نغير شيئًا في الصفحة
   ============================================ */


/* ============================================
   الدالة الرئيسية
   
   DOMContentLoaded: ينتظر حتى تتحمل الصفحة كاملًا
   قبل تشغيل الكود. هذا مهم لأن الكود يحتاج
   أن تكون عناصر HTML موجودة قبل التعامل معها.
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
  
  // استدعاء كل الوظائف عند تحميل الصفحة
  setupHamburgerMenu();   // زر الجوال
  setupTabSwitching();    // تبويبات المشاريع
  setupCountdowns();      // العدادات التنازلية
  setupContactForm();     // التحقق من النموذج
  setupScrollReveal();    // تأثير الكشف عند التمرير
  highlightActiveNav();   // تحديد الرابط النشط
  
});


/* ============================================
   1. زر الهامبرغر (القائمة الجانبية للجوال)
   ============================================ */
function setupHamburgerMenu() {
  
  // نختار العناصر من HTML باستخدام ID
  // getElementById('hamburger') = العنصر الذي id="hamburger"
  var hamburger = document.getElementById('hamburger');
  var sidebar   = document.getElementById('sidebar');
  var overlay   = document.getElementById('sidebarOverlay');
  
  // إذا لم تجد أي عنصر، اخرجي من الدالة
  if (!hamburger || !sidebar || !overlay) return;
  
  // عند الضغط على زر الهامبرغر:
  hamburger.addEventListener('click', function() {
    // toggle = إضافة الكلاس إذا لم يكن موجودًا، وحذفه إذا كان موجودًا
    sidebar.classList.toggle('is-open');
    overlay.classList.toggle('is-active');
  });
  
  // عند الضغط على الطبقة الداكنة: إغلاق القائمة
  overlay.addEventListener('click', function() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-active');
  });
  
  // عند الضغط على رابط في القائمة: إغلاقها (للجوال)
  // querySelectorAll: يختار كل العناصر المطابقة (أكثر من عنصر)
  var navLinks = document.querySelectorAll('.sidebar__nav a');
  navLinks.forEach(function(link) {
    // forEach: نطبق نفس الكود على كل رابط
    link.addEventListener('click', function() {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-active');
    });
  });
}


/* ============================================
   2. التبويبات (Tabs) — المشاريع الكبرى
   
   المنطق:
   - المستخدم يضغط على تبويب
   - نخفي كل اللوحات
   - نُظهر اللوحة المرتبطة بالتبويب فقط
   ============================================ */
function setupTabSwitching() {
  
  // اختيار كل أزرار التبويبات
  var tabs   = document.querySelectorAll('.seasonal-tab');
  // اختيار كل اللوحات
  var panels = document.querySelectorAll('.seasonal-panel');
  
  if (!tabs.length) return; // إذا لم توجد تبويبات، اخرجي
  
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      
      // 1. إزالة الكلاس النشط من جميع التبويبات
      tabs.forEach(function(t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      
      // 2. إخفاء جميع اللوحات
      panels.forEach(function(p) {
        p.classList.remove('is-active');
      });
      
      // 3. تفعيل التبويب الذي ضُغط عليه
      // this = العنصر الذي تم الضغط عليه
      this.classList.add('is-active');
      this.setAttribute('aria-selected', 'true');
      
      // 4. إظهار اللوحة المناسبة
      // dataset.season = الخاصية data-season في HTML
      var season = this.dataset.season;
      // 'panel-' + season = مثلاً 'panel-theline'
      var targetPanel = document.getElementById('panel-' + season);
      if (targetPanel) {
        targetPanel.classList.add('is-active');
      }
    });
  });
}


/* ============================================
   3. العد التنازلي
   
   المنطق:
   - نأخذ تاريخ الافتتاح من HTML (data-target)
   - نحسب الفرق بين اليوم والتاريخ المستقبلي
   - نحوّل الفرق لأيام وساعات ودقائق وثواني
   - نحدّث الأرقام كل ثانية
   ============================================ */
function setupCountdowns() {
  
  // تعريف المشاريع وأوقاتها
  // كل مشروع له: تاريخ افتتاح، وأكواد HTML لتحديثها
  var projects = [
    {
      targetDate: '2030-01-01', // تاريخ الافتتاح
      prefix: 'theline'         // بداية كود id في HTML
    },
    {
      targetDate: '2027-06-01',
      prefix: 'qiddiya'
    },
    {
      targetDate: '2026-12-01',
      prefix: 'trojena'
    }
  ];
  
  // نشغّل عداد لكل مشروع
  projects.forEach(function(project) {
    startCountdown(project.targetDate, project.prefix);
  });
}

// دالة بدء العد التنازلي لمشروع واحد
function startCountdown(targetDateStr, prefix) {
  
  // دالة التحديث — تُشغّل كل ثانية
  function updateTimer() {
    // الوقت الحالي بالمللي ثانية
    var now = new Date().getTime();
    
    // الوقت المستهدف بالمللي ثانية
    var target = new Date(targetDateStr).getTime();
    
    // الفرق = كم مللي ثانية متبقية
    var diff = target - now;
    
    // إذا انتهى الوقت
    if (diff <= 0) {
      // نعرض أصفار
      setCountdownDisplay(prefix, 0, 0, 0, 0);
      return; // نوقف الحساب
    }
    
    // تحويل المللي ثانية لوحدات مفهومة:
    // الأيام = الفرق الكلي ÷ (ألف × 60 ثانية × 60 دقيقة × 24 ساعة)
    var days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // الساعات المتبقية بعد حساب الأيام
    // Math.floor: يأخذ الجزء الصحيح فقط (بدون كسور)
    // % 24: الباقي من القسمة على 24
    var hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // تحديث الأرقام في HTML
    setCountdownDisplay(prefix, days, hours, minutes, seconds);
  }
  
  // تشغيل التحديث فورًا ثم كل 1000 مللي ثانية (= ثانية)
  updateTimer();
  setInterval(updateTimer, 1000);
  // setInterval: يشغّل الدالة بشكل متكرر كل X مللي ثانية
}

// دالة تحديث الأرقام في HTML
function setCountdownDisplay(prefix, days, hours, minutes, seconds) {
  // getElementById: نختار العنصر بكود id محدد
  var daysEl = document.getElementById(prefix + '-days');
  var hoursEl = document.getElementById(prefix + '-hours');
  var minsEl  = document.getElementById(prefix + '-mins');
  var secsEl  = document.getElementById(prefix + '-secs');
  
  // تحديث النص فقط إذا وجد العنصر
  if (daysEl)  daysEl.textContent  = days;
  if (hoursEl) hoursEl.textContent = padZero(hours);
  if (minsEl)  minsEl.textContent  = padZero(minutes);
  if (secsEl)  secsEl.textContent  = padZero(seconds);
}

// إضافة صفر إذا كان الرقم أحادي (مثل: 5 تصبح 05)
function padZero(num) {
  // إذا كان الرقم أقل من 10، أضف صفر قبله
  return num < 10 ? '0' + num : num;
}


/* ============================================
   4. التحقق من صحة نموذج التواصل
   
   المنطق:
   - عند الضغط على إرسال
   - نتحقق من كل حقل
   - إذا فيه خطأ: نوقف الإرسال ونعرض رسالة الخطأ
   - إذا كل شيء صحيح: نعرض رسالة النجاح
   ============================================ */
function setupContactForm() {
  
  // اختيار النموذج
  var form = document.getElementById('contactForm');
  if (!form) return;
  
  // عند تقديم النموذج (الضغط على زر الإرسال)
  form.addEventListener('submit', function(event) {
    
    // event.preventDefault(): يوقف السلوك الافتراضي (إرسال الصفحة)
    // هذا يعطينا وقتًا للتحقق أولًا
    event.preventDefault();
    
    // التحقق من كل حقل
    var isValid = true; // نفترض أن كل شيء صحيح في البداية
    
    // --- التحقق من حقل الاسم ---
    var nameInput = document.getElementById('name');
    var nameError = document.getElementById('name-error');
    
    // إزالة أي خطأ سابق
    clearError(nameInput, nameError);
    
    // شرط: يجب ألا يكون فارغًا
    // .value = ما كتبته في الحقل
    // .trim() = إزالة المسافات من البداية والنهاية
    // .length = عدد الحروف
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, nameError);
      isValid = false; // وجدنا خطأ
    }
    
    // --- التحقق من حقل البريد ---
    var emailInput = document.getElementById('email');
    var emailError = document.getElementById('email-error');
    clearError(emailInput, emailError);
    
    // validateEmail: دالة مخصصة للتحقق من صيغة البريد
    if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, emailError);
      isValid = false;
    }
    
    // --- التحقق من حقل الرسالة ---
    var messageInput = document.getElementById('message');
    var messageError = document.getElementById('message-error');
    clearError(messageInput, messageError);
    
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, messageError);
      isValid = false;
    }
    
    // --- إذا كل شيء صحيح ---
    if (isValid) {
      // إظهار رسالة النجاح
      var successMsg = document.getElementById('formSuccess');
      successMsg.classList.add('show');
      
      // إعادة تعيين النموذج (مسح الحقول)
      form.reset();
      
      // إخفاء رسالة النجاح بعد 5 ثوانٍ
      setTimeout(function() {
        // setTimeout: ينفذ الكود بعد X مللي ثانية
        successMsg.classList.remove('show');
      }, 5000); // 5000 مللي ثانية = 5 ثوانٍ
    }
  });
  
  // عند الكتابة في الحقل: إزالة رسالة الخطأ فورًا
  var inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(function(input) {
    input.addEventListener('input', function() {
      // input event: يُشغّل عند كل حرف تكتبينه
      var errorId = this.id + '-error'; // مثلاً: 'name-error'
      var errorEl = document.getElementById(errorId);
      clearError(this, errorEl);
    });
  });
}

// دالة إظهار رسالة الخطأ
function showError(inputEl, errorEl) {
  inputEl.classList.add('error'); // تلوين الحقل بالأحمر
  if (errorEl) errorEl.classList.add('show'); // إظهار رسالة الخطأ
}

// دالة إخفاء رسالة الخطأ
function clearError(inputEl, errorEl) {
  inputEl.classList.remove('error');
  if (errorEl) errorEl.classList.remove('show');
}

// التحقق من صيغة البريد الإلكتروني
function validateEmail(email) {
  // RegEx (التعبير النمطي): نمط يصف شكل البريد الصحيح
  // يجب أن يحتوي على: نص @ نص . نص
  // test(): يتحقق إذا كان البريد يطابق النمط
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


/* ============================================
   5. تأثير الكشف عند التمرير (Scroll Reveal)
   
   المنطق:
   - نراقب إذا وصل العنصر لمنطقة الرؤية
   - عند الوصول: نضيف كلاس "is-revealed"
   - CSS يتعامل مع باقي التأثير
   ============================================ */
function setupScrollReveal() {
  
  // اختيار كل العناصر التي نريد إظهارها
  var reveals = document.querySelectorAll('.reveal');
  
  // IntersectionObserver: يراقب متى يدخل/يخرج عنصر منطقة الرؤية
  // هذا أفضل من استخدام scroll event لأنه لا يبطئ الصفحة
  var observer = new IntersectionObserver(
    function(entries) {
      // entries: مصفوفة بكل العناصر التي تغيرت حالتها
      entries.forEach(function(entry) {
        // isIntersecting = هل العنصر داخل الشاشة؟
        if (entry.isIntersecting) {
          // أضف الكلاس لتشغيل الحركة في CSS
          entry.target.classList.add('is-revealed');
          // بعد الظهور، لا داعي لمراقبته أكثر
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,   // يُشغَّل عندما يظهر 10% من العنصر
      rootMargin: '0px 0px -50px 0px' // يبدأ 50px قبل الوصول
    }
  );
  
  // مراقبة كل عنصر
  reveals.forEach(function(el) {
    observer.observe(el);
  });
}


/* ============================================
   6. تحديد الرابط النشط في التنقل
   
   عند التمرير: نحدد أي قسم نحن فيه
   ونجعل رابطه في القائمة مميزًا (active)
   ============================================ */
function highlightActiveNav() {
  
  // اختيار كل الأقسام (section) التي لها id
  var sections = document.querySelectorAll('section[id]');
  
  // مراقبة كل قسم
  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // id القسم الحالي
          var id = entry.target.getAttribute('id');
          
          // إزالة "active" من جميع الروابط
          document.querySelectorAll('.sidebar__nav a').forEach(function(a) {
            a.classList.remove('active');
          });
          
          // إضافة "active" للرابط المناسب
          // 'a[href="#' + id + '"]' = نبحث عن رابط يشير لهذا القسم
          var activeLink = document.querySelector('.sidebar__nav a[href="#' + id + '"]');
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    },
    {
      threshold: 0.3 // عندما يكون 30% من القسم مرئيًا
    }
  );
  
  sections.forEach(function(section) {
    observer.observe(section);
});
}
    // ============================================
// نافذة الصور المنبثقة للمشاريع
// ============================================
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.modal-close');
const projectCards = document.querySelectorAll('.project-grid-card');

projectCards.forEach(card => {
  card.addEventListener('click', function() {
    const imageUrl = this.getAttribute('data-image');
    modalImg.src = imageUrl;
    modal.classList.add('show');
  });
});

closeBtn.addEventListener('click', function() {
  modal.classList.remove('show');
});

modal.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// --- عداد المربع الجديد (إضافة المشروع الرابع) ---
const murabbaDate = new Date("December 31, 2030 23:59:59").getTime();

const murabbaTimer = setInterval(function() {
    const now = new Date().getTime();
    const diff = murabbaDate - now;

    // حساب الأيام والساعات والدقائق والثواني
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    // عرض النتيجة في العناصر التي أضفناها في HTML
    const daysEl = document.getElementById("murabba-days");
    const hoursEl = document.getElementById("murabba-hours");
    const minsEl = document.getElementById("murabba-mins");
    const secsEl = document.getElementById("murabba-secs");

    if (daysEl) daysEl.innerText = d;
    if (hoursEl) hoursEl.innerText = h;
    if (minsEl) minsEl.innerText = m;
    if (secsEl) secsEl.innerText = s;

    // إذا انتهى الوقت
    if (diff < 0) {
        clearInterval(murabbaTimer);
        if (daysEl) daysEl.parentElement.parentElement.innerHTML = "<h3>تم الافتتاح!</h3>";
    }
}, 1000);

/* إصلاح تشغيل الفيديو في Safari */
var bgVideo = document.getElementById('bg-video');
if (bgVideo) {
  bgVideo.play().catch(function() {
    document.addEventListener('click', function() { bgVideo.play(); }, { once: true });
    document.addEventListener('touchstart', function() { bgVideo.play(); }, { once: true });
    document.addEventListener('scroll', function() { bgVideo.play(); }, { once: true });
  });
}
