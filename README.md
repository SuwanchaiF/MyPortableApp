# 🚀 MyPortableApp — Application Portal & Parliament Commute Report System

ระบบเว็บแอปพลิเคชันแบบรวมศูนย์ (**Application Portal**) สำหรับจัดการรายงานภาพแผนที่การเดินทาง ไป-กลับ สภา ประจำเดือน, คลังจัดเก็บโน้ตความรู้ & Code Snippet (**Knowledge Vault**), และตารางฝึกฝนทักษะการพัฒนาซอฟต์แวร์ 60 วัน (**60-Day Learning Hub**) ซิงก์ข้อมูลแบบ Real-time ผ่าน **Firebase Realtime Database** พร้อมระบบสำรองข้อมูลในเครื่องอัตโนมัติด้วย **IndexedDB**

🔗 **เข้าใช้งานระบบจริง (Live Production):** [https://suwanchaif.github.io/MyPortableApp/](https://suwanchaif.github.io/MyPortableApp/)

---

## ✨ ระบบงานหลักภายใน Portal (Core Modules)

### 1. 🗺️ ระบบรายงานภาพแผนที่ การเดินทาง ไป-กลับ สภา (`parliament_commute.html`)
- **ปฏิทิน พ.ศ. ภาษาไทย (`ThaiDatePicker`):** เลือกและกรองช่วงวันที่ในรูปแบบวัน/เดือน/ปี พ.ศ. (`วว/ดด/ปปปป`) พร้อมปุ่มลัด *ทั้งหมด / เดือนนี้ / 7 วันล่าสุด*
- **ดึงวัน-เวลาถ่ายภาพจริงอัตโนมัติ (`EXIF Metadata`):** อ่านวันที่และเวลาจากไฟล์รูปภาพ แยกเที่ยว **ขาไปสภา (เช้า)** และ **ขากลับ/GPS (บ่าย)** พร้อมเรียงลำดับตามเวลาอัตโนมัติ
- **ระบบสแกนระยะทางด้วย AI (`Tesseract.js OCR`) & ตารางกรอกเร็ว (`Fast Table`):** อ่านตัวเลขกิโลเมตรจากภาพแผนที่อัตโนมัติ หรือพิมพ์กรอกระยะทางแบบรวมในตารางเดียว
- **แดชบอร์ดสรุปผลคำนวณ:** คำนวณจำนวนวัน จำนวนเที่ยว ระยะทางรวม (กม.) และยอดเบิกจ่ายค่าน้ำมันตามช่วงวันที่ที่เลือก พร้อมจำค่าเรทและระยะทางเริ่มต้นอัตโนมัติ
- **ออกรายงานทางการ (`PDF Report`):** จัดหน้าตารางภาพแผนที่ 2 คอลัมน์ (ขาไป–ขากลับคู่กัน) พร้อมหัวกระดาษรายงานทางการสำหรับพิมพ์หรือบันทึกเป็น PDF
- **ระบบสำรองข้อมูล 2 ชั้น (`IndexedDB` + `.json` Backup):** ป้องกันปัญหา `localStorage` เต็ม และสามารถส่งออก/กู้คืนไฟล์สำรอง `.json` ได้ในคลิกเดียว

### 2. 💻 คลังโน้ตความรู้ & Code Vault (`index.html?view=notes`)
- จัดเก็บโน้ตสรุปความรู้และชุดคำสั่ง **Code Snippet** แยกตามหมวดหมู่ภาษา (`PHP`, `JavaScript`, `Java`, `SQL`, `Git`, `HTML/CSS`)
- ค้นหา กรองตามหมวดหมู่ และคัดลอกโค้ดไปใช้งานได้ทันที

### 3. 🚀 ตารางฝึกฝน 60 วัน (`bootcamp_master_learning_hub.html`)
- แผนการเรียนรู้ 60 วัน (Day 1 – Day 60) พร้อมเนื้อหาทฤษฎี ตัวอย่างโค้ด ข้อควรระวัง และแบบทดสอบ (Quiz) รายวัน
- บันทึกความคืบหน้าแยกตามบัญชีผู้ใช้งาน

### 4. ⚙️ ระบบส่วนกลางและผู้ดูแลระบบ (`shared-core.js`)
- **Application Portal (`index.html`):** หน้าศูนย์รวมระบบงานหลังล็อกอิน รองรับทั้งหน้าจอคอมพิวเตอร์และมือถือ (Responsive)
- **ตั้งค่าโปรไฟล์ส่วนตัว (`Profile Settings`):** เปลี่ยนชื่อที่แสดง (Display Name), ไอคอนโปรไฟล์ (Avatar), และรหัสผ่านส่วนตัว (เข้ารหัสด้วย `SHA-256`)
- **จัดการผู้ใช้งาน (`User Management`):** ดูรายชื่อสมาชิกทั้งหมด ตั้งรหัสผ่านใหม่ หรือลบบัญชีผู้ใช้
- **ประวัติกิจกรรมในระบบ (`System Activity Logs`):** บันทึกทุกการเพิ่ม แก้ไข ลบ สแกน OCR และออกรายงาน พร้อมระบุชนิดอุปกรณ์ (`📱 Mobile` / `💻 Desktop`) และส่งออกเป็นไฟล์ `.csv`

---

## 📁 โครงสร้างไฟล์หลัก (Project Structure)

```text
MyPortableApp/
├── index.html                          # หน้าเข้าสู่ระบบ (Auth), หน้า Application Portal, และระบบคลังโน้ต
├── parliament_commute.html             # ระบบรายงานภาพแผนที่ การเดินทาง ไป-กลับ สภา (ประจำเดือน)
├── bootcamp_master_learning_hub.html   # ระบบตารางฝึกฝน 60 วัน (60-Day Bootcamp Hub)
├── shared-core.js                      # โมดูลกลาง (Firebase Config, SystemLogger, IndexedDB, User/Profile Manager)
├── firebase.database.rules.json        # กฎความปลอดภัยและโครงสร้างข้อมูล Firebase Realtime Database
├── firebase.json / .firebaserc         # ไฟล์ตั้งค่าโปรเจกต์ Firebase CLI
└── _redirects / netlify.toml           # กฎ Redirect รวมศูนย์จาก Netlify มายัง GitHub Pages
```

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** HTML5, CSS3 (Glassmorphism & Responsive Layout), Vanilla JavaScript (ES6+), FontAwesome 6
- **Database & Storage:** Firebase Realtime Database, Browser `IndexedDB` (`MyPortableAppDB`), `localStorage`
- **Image & AI Processing:** `EXIF-js` (ดึงวันเวลาถ่ายภาพจริง), `Tesseract.js v5` (AI OCR อ่านระยะทางภาษาไทย/อังกฤษ), HTML5 Canvas Image Compression
- **Security:** `Web Crypto API` (`SHA-256` Password Hashing)

---

## 💻 วิธีรันทดสอบในเครื่อง (Local Development)

1. เปิด Terminal ในโฟลเดอร์โปรเจกต์ `C:\MyPortableApp` แล้วรัน Local Web Server:
   ```powershell
   .\PHP\php.exe -S 0.0.0.0:8000
   ```
2. เปิดเบราว์เซอร์ไปที่:
   - หน้า Portal หลัก: `http://localhost:8000/index.html`
   - หน้ารายงานการเดินทางสภา: `http://localhost:8000/parliament_commute.html`
