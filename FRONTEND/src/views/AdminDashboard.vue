<template>
  <div class="container-fluid py-4 animate__animated animate__fadeIn">
    <div class="row g-4">
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">Trạng thái phiếu mượn</h5>
          </div>
          <div class="position-relative" style="min-height: 350px">
            <div
              v-if="loading"
              class="d-flex justify-content-center align-items-center h-100 position-absolute w-100"
              style="z-index: 2"
            >
              <div
                class="spinner-border text-primary opacity-50"
                role="status"
              ></div>
            </div>
            <div v-show="!loading" class="chart-container">
              <apexchart
                chart-id="admin-donut-chart"
                height="350"
                type="donut"
                :options="chartOptions"
                :series="chartSeries"
              ></apexchart>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100 shadow-hover">
          <h5 class="fw-bold mb-4">Hoạt động hệ thống</h5>

          <div class="list-group list-group-flush">
            <div class="mb-4">
              <h6 class="fw-bold mb-1">Tổng kho sách</h6>
              <p class="text-muted small mb-0">
                Thư viện hiện có {{ stats.totalBooks }} đầu sách khác nhau.
              </p>
            </div>
            <div class="mb-4">
              <h6 class="fw-bold mb-1">Đang chờ xử lý</h6>
              <p class="text-muted small mb-0">
                Có {{ stats.pendingCount }} phiếu mượn mới cần được nhân viên
                duyệt.
              </p>
            </div>
            <div class="mb-4">
              <h6 class="fw-bold mb-1">Cảnh báo quá hạn</h6>
              <p class="text-muted small mb-0">
                Phát hiện {{ stats.overdueCount }} trường hợp quá hạn cần nhắc
                nhở.
              </p>
            </div>
          </div>

          <div class="mt-auto pt-4 text-center">
            <router-link
              to="/admin/borrows"
              class="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm"
            >
              Quản lý phiếu mượn <i class="bi bi-arrow-right ms-2"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();
const stats = ref({
  totalBooks: 0,
  pendingCount: 0,
  borrowingCount: 0,
  overdueCount: 0,
});
const loading = ref(false);

const statsCards = computed(() => [
  {
    title: "Đầu sách",
    value: stats.value.totalBooks,
    icon: "bi-book",
    color: "primary",
  },
  {
    title: "Chờ duyệt",
    value: stats.value.pendingCount,
    icon: "bi-hourglass-split",
    color: "warning",
  },
  {
    title: "Đang mượn",
    value: stats.value.borrowingCount,
    icon: "bi-basket",
    color: "info",
  },
  {
    title: "Quá hạn",
    value: stats.value.overdueCount,
    icon: "bi-exclamation-triangle",
    color: "danger",
  },
]);

const chartSeries = computed(() => [
  stats.value.pendingCount,
  stats.value.borrowingCount,
  stats.value.overdueCount,
]);

const chartOptions = {
  chart: { type: "donut", fontFamily: "Inter, sans-serif" },
  labels: ["Đang chờ duyệt", "Đang mượn", "Quá hạn"],
  colors: ["#0d6efd", "#0bb5ff", "#dc3545"],
  legend: { position: "bottom", fontSize: "14px", fontWeight: 500 },
  dataLabels: { enabled: true, dropShadow: { enabled: false } },
  stroke: { width: 4 },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Tổng đơn",
            color: "#000000",
            fontSize: "16px",
            fontWeight: 700,
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
          },
        },
      },
    },
  },
};

const fetchStats = async () => {
  loading.value = true;
  try {
    const res = await axios.get(
      "http://localhost:3000/api/nhanvien/dashboard-stats",
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    stats.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải thống kê dashboard:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStats);
</script>

<style scoped>
.ls-1 {
  letter-spacing: 1px;
}

.bg-gradient-primary {
  background: linear-gradient(45deg, #0d6efd, #0bb5ff);
}
.bg-gradient-warning {
  background: linear-gradient(45deg, #ffc107, #ffdb71);
}
.bg-gradient-info {
  background: linear-gradient(45deg, #0dcaf0, #33f3ff);
}
.bg-gradient-danger {
  background: linear-gradient(45deg, #dc3545, #ff5c6c);
}

.timeline::before {
  content: "";
  position: absolute;
  left: 0;
  top: 5px;
  bottom: 5px;
  width: 2px;
  background: #f1f3f5;
}

.timeline-point {
  position: absolute;
  left: -24px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px currentColor;
  z-index: 1;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin {
  animation: spin 0.8s linear infinite;
}
</style>
