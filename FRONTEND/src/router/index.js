import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout, 
    children: [
      {
        path: '',
        name: 'home',
        
        component: () => import('../views/HomeView.vue'), 
      },
      {
        path: 'library',
        name: 'library',
        component: () => import('../views/LibraryView.vue'), 
      },
      {
        path: 'book/:id',
        name: 'book-details',
        component: () => import('../views/BookViewDetails.vue'), 
      },
      {
        path: 'terms',
        name: 'terms',
        component: () => import('../views/TermsView.vue'), 
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/LoginView.vue'), 
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/RegisterView.vue'), 
      },
      {
        path: 'my-borrows',
        name: 'my-borrows',
        component: () => import('../views/MyBorrows.vue'), 
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('../views/FavoritesView.vue'),
      }
    ],
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../views/AdminDashboard.vue'),
      },
      {
        path: 'borrows',
        name: 'admin-borrows',
        component: () => import('../views/AdminBorrows.vue'),
      },
      {
        path: 'books',
        name: 'admin-books',
        component: () => import('../views/AdminBooks.vue'),
      },
      {
        path: 'staff',
        name: 'admin-staff',
        component: () => import('../views/AdminStaff.vue'),
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../views/AdminUsers.vue'),
      },
      {
        path: 'publishers',
        name: 'admin-publishers',
        component: () => import('../views/AdminPublishers.vue'),
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return { top: 0 };
  },
});

router.onError((error) => {
  if (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Loading chunk')) {
    window.location.reload();
  }
});

export default router;
