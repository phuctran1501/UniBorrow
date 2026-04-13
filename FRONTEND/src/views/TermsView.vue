<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-3 d-none d-lg-block sticky-top" style="top: 100px; height: fit-content;">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header bg-primary text-white text-center py-3 fw-bold border-0">
            Mục lục
          </div>
          <div class="list-group list-group-flush small">
            <a href="#rules" class="list-group-item list-group-item-action py-3 px-4 border-bottom">
              1. Quy định chung
            </a>
            <a href="#process" class="list-group-item list-group-item-action py-3 px-4 border-bottom">
              2. Quy trình mượn trả
            </a>
            <a href="#responsibilities" class="list-group-item list-group-item-action py-3 px-4 border-bottom">
              3. Trách nhiệm độc giả
            </a>
            <a href="#penalties" class="list-group-item list-group-item-action py-3 px-4 border-0">
              4. Xử lý vi phạm
            </a>
          </div>
        </div>
      </div>

      <div class="col-lg-9 ps-lg-5 doc-flow">
        <h1 class="fw-bold text-primary mb-5 display-5 tracking-tight">Điều khoản mượn sách</h1>
        
        <section id="rules" class="mb-5">
          <h4 class="fw-bold mb-4 text-primary">1. Quy định chung</h4>
          <p class="leading-relaxed text-dark mb-4">
            Mọi sinh viên và cán bộ thuộc trường đều có quyền sử dụng thư viện và mượn sách sau khi đã đăng ký tài khoản thành công trên hệ thống UniBorrow.
          </p>
          <p class="text-dark leading-relaxed">
            Hệ thống UniBorrow được thiết kế để tối ưu hóa việc phân bổ tài nguyên học thuật. Độc giả cần tuân thủ các quy định về thời gian và số lượng sách để đảm bảo tính công bằng cho toàn bộ cộng đồng. Mỗi độc giả được mượn tối đa 5 cuốn sách cùng lúc.
          </p>
        </section>

        <section id="process" class="mb-5">
          <h4 class="fw-bold mb-4 text-primary">2. Quy trình mượn trả</h4>
          <div class="mb-4" v-for="step in steps" :key="step.title">
            <strong class="text-dark d-block mb-1 fs-5">{{ step.title }}</strong>
            <p class="text-dark leading-relaxed mb-0">{{ step.desc }}</p>
          </div>
        </section>

        <section id="responsibilities" class="mb-5">
          <h4 class="fw-bold mb-4 text-primary">3. Trách nhiệm của độc giả</h4>
          <div class="mb-4">
            <div class="mb-4">
              <strong class="text-dark d-block mb-1 fs-5">Bảo quản tài liệu</strong>
              <p class="text-dark leading-relaxed mb-0">Độc giả có trách nhiệm giữ gìn sách cẩn thận, không làm rách, ướt, hoặc viết vẽ lên sách.</p>
            </div>
            <div class="mb-4">
              <strong class="text-dark d-block mb-1 fs-5">Thời gian mượn trả</strong>
              <p class="text-dark leading-relaxed mb-0">Trả sách đúng hạn quy định. Thời gian mượn mặc định là 7 ngày kể từ ngày nhận sách.</p>
            </div>
            <div class="mb-4">
              <strong class="text-dark d-block mb-1 fs-5">Bồi thường hư hại</strong>
              <p class="text-dark leading-relaxed mb-0">Chịu trách nhiệm bồi thường theo quy định nếu làm mất hoặc hư hỏng tài liệu của thư viện.</p>
            </div>
          </div>
        </section>

        <section id="penalties" class="mb-5">
          <h4 class="fw-bold mb-4 text-primary">4. Xử lý vi phạm</h4>
          <div class="mb-4">
            <strong class="text-dark d-block mb-1 fs-5">Trả sách quá hạn</strong>
            <p class="text-dark leading-relaxed mb-4">
              Phạt tiền theo số ngày quá hạn ( 10000 VNĐ/cuốn/ngày ) và tạm khóa quyền mượn sách trên hệ thống cho đến khi hoàn tất thanh toán
            </p>
          </div>

          <div class="mb-4">
            <strong class="text-dark d-block mb-1 fs-5">Làm mất hoặc hư hại tài liệu nghiêm trọng</strong>
            <p class="text-dark leading-relaxed mb-0">
              Độc giả có trách nhiệm bồi thường 200% theo đơn giá sách và bị thu hồi quyền sử dụng dịch vụ thư viện
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const steps = [
  { title: 'Tìm kiếm', desc: 'Khám phá kho sách đa dạng và chọn đầu sách mục tiêu thông qua thanh tìm kiếm thông minh.' },
  { title: 'Đăng ký', desc: 'Nhấn mượn sách để tạo yêu cầu mượn. Yêu cầu của bạn sẽ được nhân viên thư viện phê duyệt nhanh chóng.' },
  { title: 'Nhận sách', desc: 'Sau khi yêu cầu được duyệt, bạn có 24 giờ để đến thư viện nhận sách trực tiếp.' },
  { title: 'Trả sách', desc: 'Hoàn trả lại sách nguyên vẹn cho thư viện trong thời gian quy định (mặc định 7 ngày).' }
];
</script>

<style scoped>
.leading-relaxed { line-height: 1.8; }
.tracking-tight { letter-spacing: -0.02em; }


section { scroll-margin-top: 120px; }

.list-group-item-action:hover {
  background-color: rgba(var(--primary-rgb), 0.05);
  color: var(--primary-color);
}

.doc-flow h4 {
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 0.75rem;
}

.bg-danger-subtle { background-color: rgba(220, 53, 69, 0.1); }
</style>
