<div align="center">

# UniBorrow - Smart University Library & AI-Powered Borrowing System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![API Docs](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D.svg?logo=swagger&logoColor=black)

### Built With

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
<br>
![Pinia](https://img.shields.io/badge/Pinia-%23FFE066.svg?style=for-the-badge&logo=vue.js&logoColor=black)
![Groq](https://img.shields.io/badge/Groq%20AI-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-%23039BE5.svg?style=for-the-badge&logo=firebase&logoColor=white)
![ApexCharts](https://img.shields.io/badge/ApexCharts-008FFB?style=for-the-badge&logo=salesforce&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)

</div>

---

**UniBorrow** là nền tảng quản lý thư viện và mượn trả sách thông minh dành cho môi trường đại học. Hệ thống giải quyết toàn diện bài toán số hóa quy trình quản lý tài liệu học thuật, theo dõi vòng đời mượn - trả sách, kiểm soát tình trạng tồn kho theo thời gian thực và tự động nhắc nợ quá hạn. Đặc biệt, UniBorrow tiên phong tích hợp **Trợ lý thủ thư ảo AI Librarian (Groq Llama 3.3 70B)** có khả năng hiểu ngữ cảnh kho sách thực tế, tìm kiếm bằng giọng nói (**Voice Search**) và bảng điều khiển phân tích số liệu trực quan (**ApexCharts**).

---

## 1. Problem & Solution

**The Problem:**

- **Quy trình quản lý thủ công & thất thoát tài liệu:** Nhiều thư viện đại học vẫn phụ thuộc vào ghi chép sổ sách hoặc các phần mềm cũ kỹ, dẫn đến sai sót số liệu tồn kho, thất lạc sách và mất nhiều thời gian kiểm kê định kỳ.
- **Trải nghiệm tìm kiếm & mượn sách hạn chế:** Sinh viên gặp khó khăn khi tìm kiếm tựa sách phù hợp theo chuyên ngành, thiếu thông tin về tình trạng còn/hết thực tế trong kho và không được tư vấn định hướng tài liệu đọc.
- **Kiểm soát hạn trả & nhắc nợ kém hiệu quả:** Việc theo dõi hạn trả thủ công làm tỷ lệ sách quá hạn tăng cao; thủ thư tốn nhiều công sức đối soát và gửi thông báo nhắc nhở riêng lẻ đến từng độc giả.
- **Thiếu bức tranh dữ liệu tổng quan cho ban quản lý:** Thủ thư và ban quản trị không có công cụ trực quan hóa biến động mượn trả, phân bổ trạng thái phiếu mượn và tỷ lệ đọc giả hoạt động theo thời gian thực.

**The Solution:**

- **Số hóa toàn diện quy trình mượn - trả:** Xây dựng hệ thống Client-Server phân quyền 2 tầng chuyên biệt (Độc giả & Quản trị viên/Thủ thư), tự động trừ/cộng số lượng sách theo vòng đời phiếu mượn và kiểm soát chặt chẽ quy định mượn tối đa 5 cuốn/người.
- **Trợ lý ảo AI Librarian & Tìm kiếm thông minh:** Tích hợp mô hình ngôn ngữ lớn **Llama 3.3 70B** thông qua **Groq Cloud API** để tư vấn, tóm tắt và gợi ý sách 24/7 theo dữ liệu thực của thư viện. Hỗ trợ tìm kiếm bằng giọng nói qua **Web Speech API**.
- **Tự động hóa cảnh báo quá hạn:** Hệ thống kết hợp **Node-cron** và dịch vụ gửi thư điện tử **Nodemailer** để tự động quét trạng thái sách quá hạn mỗi ngày, gửi email thông báo kèm hạn trả và mức phạt đến hộp thư của độc giả.
- **Bảng điều khiển trực quan hóa dữ liệu (Admin Dashboard):** Tích hợp biểu đồ tròn tương tác **ApexCharts** phản ánh tức thời tỷ trọng phiếu mượn (Chờ duyệt, Đang mượn, Quá hạn) cùng hệ thống KPI quản trị trực quan. Chuẩn hóa tài liệu kỹ thuật qua **Swagger/OpenAPI 3.0**.

---

## 2. Core Features

### Business Logic & User Portals

#### 🎓 Phân hệ Độc giả (Sinh viên & Giảng viên)
- **Đăng ký & Đăng nhập linh hoạt:**
  - Xác thực truyền thống an toàn bằng mật khẩu mã hóa (Bcrypt) và JSON Web Token (JWT).
  - Đăng nhập nhanh bằng mạng xã hội (Google & GitHub) tích hợp **Firebase Authentication**.
- **Tra cứu & Khám phá kho sách:**
  - Tìm kiếm toàn văn (Full-text search) theo tên sách, tác giả.
  - Tìm kiếm rảnh tay bằng giọng nói (**Voice Recognition Search**).
  - Bộ lọc chuyên sâu theo Thể loại, Nhà xuất bản, Trạng thái còn sách và Sắp xếp (mới nhất, giá tăng/giảm).
  - Danh mục sách mới cập nhật và top sách được mượn nhiều nhất.
- **Đăng ký mượn & Theo dõi phiếu mượn:**
  - Đăng ký mượn sách trực tuyến với các ràng buộc nghiệp vụ: tối đa 5 cuốn, không có sách quá hạn chưa thanh toán, số lượng kho $> 0$.
  - Hủy phiếu mượn linh hoạt khi yêu cầu đang ở trạng thái *Chờ duyệt*.
  - Theo dõi chi tiết lịch sử và tiến độ mượn trả cá nhân (Chờ duyệt, Đang mượn, Quá hạn, Đã trả).
- **Bộ sưu tập sách yêu thích (Wishlist):** Lưu trữ các tựa sách quan tâm vào danh sách riêng để dễ dàng theo dõi và mượn sau.

#### 🛡️ Phân hệ Ban Quản trị & Thủ thư (Admin & Staff)
- **Dashboard phân tích số liệu thời gian thực:**
  - Biểu đồ Donut tương tác (**ApexCharts**) biểu diễn phân bố trạng thái các phiếu mượn.
  - Thẻ thống kê tổng số đầu sách trong kho, số phiếu cần duyệt và số lượt quá hạn.
- **Quản lý mượn trả & Duyệt phiếu:**
  - Tiếp nhận và phê duyệt/từ chối phiếu mượn sách trực tuyến.
  - Khi duyệt phiếu: tự động giảm tồn kho, thiết lập hạn trả 7 ngày và gửi email thông báo thành công đến độc giả.
  - Tiếp nhận trả sách: tự động hoàn trả số lượng vào kho và lưu vết ngày trả thực tế.
  - Xác nhận thu phí phạt cho các trường hợp trễ hạn.
- **Công cụ quét & Cảnh báo quá hạn một chạm:**
  - Nút bấm quét thủ công tức thì danh sách phiếu mượn vi phạm hạn trả.
  - Tự động chuyển trạng thái thành `QuaHan` và gửi email cảnh báo tự động qua **Nodemailer**.
- **Quản lý kho sách (Books Management):**
  - Đầy đủ tính năng Thêm mới, Chỉnh sửa, Xóa đầu sách (CRUD).
  - Quản lý chi tiết: Tên sách, Tác giả, Thể loại, Năm xuất bản, Đơn giá, Số quyển, Mô tả và Ảnh bìa.
- **Quản lý Nhà xuất bản (Publishers Management):** Quản lý danh bạ đối tác NXB, địa chỉ liên hệ và liên kết với các tựa sách.
- **Quản lý Độc giả (Users Management):** Tra cứu danh sách sinh viên, xem thông tin liên hệ và thao tác Khóa/Mở khóa tài khoản khi vi phạm nội quy.
- **Quản lý Nhân viên (Staff Management):** Cấp tài khoản nội bộ cho thủ thư và nhân viên vận hành hệ thống.

---

### AI & Automation Engine

- **Trợ lý thủ thư ảo AI Librarian (Groq Cloud API):**
  - Tận dụng sức mạnh mô hình **Llama 3.3 70B Versatile** với độ trễ phản hồi cực thấp.
  - Trích xuất toàn bộ ngữ cảnh kho sách thực tế (tên sách, tác giả, thể loại, số lượng khả dụng, giá mượn) để đưa vào System Prompt.
  - Khả năng tư vấn chọn sách phù hợp với nhu cầu nghiên cứu, gợi ý tác phẩm tương đương và giải đáp thể lệ mượn trả thư viện.
  - Giao diện bong bóng chat thả nổi (Floating Action Button), hỗ trợ kéo thả tự do trên màn hình và định dạng câu trả lời bằng **Markdown**.
- **Công nghệ nhận diện giọng nói (Voice Recognition Engine):**
  - Tích hợp **Web Speech Recognition API** trên trình duyệt, cho phép người dùng đọc tên sách/tác giả để hệ thống tự động nhận diện và truy vấn.
- **Dịch vụ tự động hóa gửi thông báo (Automated Email & Cron Service):**
  - Sử dụng **Nodemailer** với giao thức SMTP bảo mật để gửi thư xác nhận duyệt mượn và thông báo trễ hạn.
  - Tích hợp **Node-cron** phục vụ tác vụ chạy nền định kỳ để rà soát hạn mượn của độc giả.

---

## 3. Technology Stack Details

### Frontend (Client Application)

- **Framework & Core:** [Vue 3](https://vuejs.org/) (Composition API với `<script setup>`).
- **Build Tool:** [Vite 8](https://vitejs.dev/) (tốc độ khởi động máy chủ phát triển và đóng gói tối ưu).
- **State Management:** [Pinia 3](https://pinia.vuejs.org/) (quản lý state module hóa: `authStore`, `bookStore`, `adminStore`, `notificationStore`).
- **Routing:** [Vue Router 5](https://router.vuejs.org/) (cấu trúc layout phân cấp: `MainLayout` cho độc giả và `AdminLayout` cho ban quản trị).
- **Styling & Icons:** [Bootstrap 5.3](https://getbootstrap.com/), [Bootstrap Icons](https://icons.getbootstrap.com/).
- **Data Visualization:** [ApexCharts](https://apexcharts.com/) kết hợp `vue3-apexcharts`.
- **Authentication Service:** [Firebase](https://firebase.google.com/) (Google & GitHub OAuth).
- **Markdown Parser:** [Marked](https://marked.js.org/) (hiển thị câu trả lời có định dạng của AI Librarian).
- **HTTP Client:** [Axios](https://axios-http.com/) kèm Request Interceptor tự động đính kèm Bearer JWT Token.

### Backend (RESTful API & Services)

- **Platform:** [Node.js](https://nodejs.org/) (Runtime môi trường máy chủ).
- **Web Framework:** [Express 5](https://expressjs.com/) (xây dựng kiến trúc REST API).
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) với [Mongoose 9](https://mongoosejs.com/) (quản lý schema và quan hệ tham chiếu `populate`).
- **Authentication & Security:** [JSON Web Token (JWT)](https://jwt.io/), [Bcryptjs](https://github.com/dcodeIO/bcrypt.js) (băm mật khẩu 10 rounds salt), [CORS](https://github.com/expressjs/cors).
- **AI Integration:** [Groq SDK](https://github.com/groq/groq-typescript) (kết nối Llama 3.3 70B Versatile), `@google/generative-ai`.
- **Email Delivery:** [Nodemailer 8](https://nodemailer.com/) (gửi email HTML thông báo tự động).
- **Task Scheduling:** [Node-cron](https://github.com/node-cron/node-cron) (lập lịch công việc nền tự động).
- **API Documentation:** [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) kết hợp [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc) chuẩn OpenAPI 3.0.

### DevOps, Code Quality & Tools

- **Source Control:** Git, GitHub ([phuctran1501/UniBorrow](https://github.com/phuctran1501/UniBorrow.git)).
- **Code Quality & Formatting:** ESLint, Prettier.
- **Server Development Watcher:** Nodemon.
- **Testing & API Inspection:** Swagger UI (`/api-docs`), Postman.

---

## 4. System Architecture & Folder Structure

Dự án được tách biệt rõ ràng giữa tầng máy chủ API Backend và tầng giao diện Frontend:

```text
UniBorrow/
├── BACKEND/                         # Máy chủ API Node.js & Express
│   ├── config/                      # Cấu hình kết nối cơ sở dữ liệu & Swagger
│   │   ├── db.js                    # Kết nối cơ sở dữ liệu MongoDB
│   │   └── swagger.js               # Khởi tạo Swagger UI & định nghĩa OpenAPI 3.0
│   ├── controllers/                 # Tầng xử lý logic nghiệp vụ (Business Logic)
│   │   ├── aiController.js          # Xử lý hội thoại với Groq AI Librarian (Llama 3.3)
│   │   ├── docGiaController.js      # Xác thực, đăng ký, đăng nhập & quản lý độc giả
│   │   ├── nhaXuatBanController.js  # Nghiệp vụ quản lý Nhà xuất bản
│   │   ├── nhanVienController.js    # Xác thực nhân viên & số liệu thống kê Dashboard
│   │   ├── sachController.js        # Quản lý kho sách, mượn sách, duyệt mượn & trả sách
│   │   └── yeuThichController.js    # Quản lý danh mục sách yêu thích (Wishlist)
│   ├── middlewares/                 # Middleware kiểm tra xác thực & phân quyền
│   │   └── authMiddleware.js        # Kiểm tra JWT Token & vai trò người dùng (DocGia/NhanVien)
│   ├── models/                      # Tầng mô hình dữ liệu Mongoose Schemas
│   │   ├── DocGia.js                # Schema Độc giả (Họ tên, Email, Mật khẩu, Trạng thái)
│   │   ├── NhaXuatBan.js            # Schema Nhà xuất bản (Tên NXB, Địa chỉ)
│   │   ├── NhanVien.js              # Schema Nhân viên thư viện (Họ tên, Chức vụ, Mật khẩu)
│   │   ├── Sach.js                  # Schema Sách (Tên, Đơn giá, Số quyển, Tác giả, Năm XB, Ảnh)
│   │   ├── TheoDoiMuonSach.js       # Schema Phiếu mượn (Độc giả, Sách, Ngày mượn/trả, Trạng thái)
│   │   └── YeuThich.js              # Schema Danh mục yêu thích
│   ├── routes/                      # Định tuyến RESTful API endpoints & Swagger docs
│   │   ├── aiRoutes.js              # Endpoint /api/ai
│   │   ├── docGiaRoutes.js          # Endpoint /api/docgia
│   │   ├── nhaXuatBanRoutes.js      # Endpoint /api/nhaxuatban
│   │   ├── nhanVienRoutes.js        # Endpoint /api/nhanvien
│   │   ├── sachRoutes.js            # Endpoint /api/sach
│   │   └── yeuThichRoutes.js        # Endpoint /api/yeuthich
│   ├── utils/                       # Các hàm tiện ích hỗ trợ
│   │   ├── cronJobs.js              # Tự động quét và cập nhật trạng thái phiếu mượn quá hạn
│   │   ├── emailService.js          # Dịch vụ gửi email thông báo qua Nodemailer
│   │   └── generateToken.js         # Khởi tạo chuỗi mã hóa JSON Web Token
│   ├── .eslintrc.json               # Quy chuẩn kiểm tra mã nguồn Backend
│   ├── .prettierrc                  # Quy chuẩn định dạng mã nguồn
│   ├── package.json                 # Khai báo dependencies & scripts Backend
│   └── server.js                    # File khởi chạy chính của máy chủ Express
│
├── FRONTEND/                        # Ứng dụng giao diện người dùng Vue 3 + Vite
│   ├── public/                      # Tài nguyên tĩnh
│   ├── src/                         # Mã nguồn ứng dụng giao diện
│   │   ├── assets/                  # Hình ảnh và đồ họa giao diện
│   │   ├── components/              # Các thành phần giao diện Vue Components
│   │   │   ├── AIChatBot.vue        # Trợ lý ảo thủ thư AI Librarian (Draggable Chatbox)
│   │   │   ├── BookDisplayCard.vue  # Thẻ hiển thị thông tin và bìa sách
│   │   │   └── Shared/              # Components tái sử dụng (Navbar, Footer, SearchBox, Filters...)
│   │   ├── composables/             # Các hàm Composable dùng chung (useVoiceRecognition...)
│   │   ├── config/                  # Cấu hình Firebase Authentication
│   │   ├── layouts/                 # Bố cục giao diện phân tầng (MainLayout & AdminLayout)
│   │   ├── router/                  # Cấu hình điều hướng Vue Router
│   │   ├── services/                # Cấu hình Axios Client & Interceptor
│   │   ├── store/                   # Quản lý State toàn cục với Pinia (auth, book, admin...)
│   │   ├── views/                   # Các trang màn hình chính của hệ thống
│   │   │   ├── AdminBooks.vue       # Màn hình quản lý danh mục sách
│   │   │   ├── AdminBorrows.vue     # Màn hình duyệt mượn trả & quét trễ hạn
│   │   │   ├── AdminDashboard.vue   # Màn hình bảng điều khiển thống kê ApexCharts
│   │   │   ├── AdminPublishers.vue  # Màn hình quản lý Nhà xuất bản
│   │   │   ├── AdminStaff.vue       # Màn hình quản trị nhân sự thư viện
│   │   │   ├── AdminUsers.vue       # Màn hình quản lý độc giả sinh viên
│   │   │   ├── BookViewDetails.vue  # Màn hình chi tiết sách & đăng ký mượn
│   │   │   ├── FavoritesView.vue    # Màn hình danh mục sách yêu thích
│   │   │   ├── HomeView.vue         # Trang chủ giới thiệu, tin tức & tìm kiếm giọng nói
│   │   │   ├── LibraryView.vue      # Thư viện sách với bộ lọc đa tiêu chí
│   │   │   ├── LoginView.vue        # Màn hình đăng nhập (Email + Google/GitHub)
│   │   │   ├── MyBorrows.vue        # Màn hình quản lý phiếu mượn của cá nhân
│   │   │   ├── RegisterView.vue     # Màn hình đăng ký thành viên mới
│   │   │   └── TermsView.vue        # Màn hình điều khoản và quy chế thư viện
│   │   ├── App.vue                  # Root Vue Component
│   │   ├── main.js                  # Điểm khởi tạo ứng dụng Vue
│   │   └── style.css                # CSS tùy chỉnh giao diện
│   ├── index.html                   # HTML Entry point
│   ├── package.json                 # Khai báo dependencies & scripts Frontend
│   └── vite.config.js               # Cấu hình máy chủ phát triển Vite
│
└── README.md                        # Tài liệu hướng dẫn dự án
```

---

## 5. Cài đặt và Khởi chạy

### Yêu cầu hệ thống

- **Node.js**: Phiên bản 18.x trở lên (khuyên dùng Node.js LTS).
- **NPM** hoặc **Yarn / Bun**: Trình quản lý gói phụ thuộc.
- **MongoDB**: Cơ sở dữ liệu MongoDB cục bộ (Local MongoDB Community Server) hoặc phiên bản đám mây [MongoDB Atlas](https://www.mongodb.com/atlas).
- **Khóa dịch vụ bên thứ ba (Tùy chọn cho tính năng nâng cao):**
  - Groq API Key (để sử dụng AI Librarian).
  - Firebase Project Credentials (để sử dụng Social Login Google / GitHub).
  - Tài khoản Gmail & Mật khẩu ứng dụng (App Password) cho Nodemailer.

---

### Các bước thực hiện

#### Bước 1: Tải mã nguồn dự án

```bash
git clone https://github.com/phuctran1501/UniBorrow.git
cd UniBorrow
```

---

#### Bước 2: Thiết lập và Khởi chạy BACKEND

1. **Di chuyển vào thư mục BACKEND:**

   ```bash
   cd BACKEND
   ```

2. **Cài đặt các gói phụ thuộc:**

   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường (`.env`):**

   Tạo tệp `.env` trong thư mục `BACKEND` với nội dung như sau:

   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/uniborrow
   JWT_SECRET=your_super_secret_jwt_key_here

   # Cấu hình Groq AI (Llama 3.3)
   GROQ_API_KEY=your_groq_api_key_here

   # Cấu hình Email gửi thông báo (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

4. **Khởi chạy máy chủ Backend:**

   ```bash
   # Chế độ phát triển (tự động reload khi có thay đổi)
   npm start
   ```

   Máy chủ sẽ khởi chạy tại: `http://localhost:3000`
   
   Tài liệu API Swagger tương tác trực quan khả dụng tại: `http://localhost:3000/api-docs`

---

#### Bước 3: Thiết lập và Khởi chạy FRONTEND

1. **Mở một cửa sổ dòng lệnh mới và di chuyển vào thư mục FRONTEND:**

   ```bash
   cd FRONTEND
   ```

2. **Cài đặt các gói phụ thuộc:**

   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường (`.env`):**

   Tạo tệp `.env` trong thư mục `FRONTEND` để kết nối với Firebase Authentication:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Khởi chạy máy chủ giao diện Frontend:**

   ```bash
   npm run dev
   ```

   Ứng dụng web sẽ được mở tại: `http://localhost:5173` (hoặc cổng hiển thị trên Terminal của Vite).

---

#### Bước 4: Trải nghiệm hệ thống

- **Dành cho Độc giả:** Mở trình duyệt truy cập `http://localhost:5173`, đăng ký tài khoản mới hoặc đăng nhập bằng Google/GitHub để tìm sách, thử giọng nói để tìm kiếm, trò chuyện cùng AI Librarian và gửi yêu cầu mượn sách.
- **Dành cho Quản trị viên:** Đăng nhập vào trang quản trị tại `/admin` để duyệt các phiếu mượn vừa tạo, cập nhật kho sách và theo dõi các chỉ số thống kê trên Dashboard.