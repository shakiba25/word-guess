// src/api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from './config';


const api = axios.create({
  baseURL: BASE_URL,
});

// Flag برای اینکه یکبار فقط رفرش توکن بزنی
let isRefreshing = false;
// صفی برای نگه‌داشتن درخواست‌ها در زمان رفرش توکن
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// درخواست قبل ارسال: اضافه کردن توکن به هدر
api.interceptors.request.use(
  config => {
    const access = localStorage.getItem('access');
    if (access) {
      config.headers['Authorization'] = 'Bearer ' + access;
    }
    return config;
  },
  error => Promise.reject(error)
);

// پاسخ دریافت شده: مدیریت خطای 401 و رفرش توکن
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    // اگر پاسخ 401 بود و این درخواست قبلا رفرش نشده
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("refresh token")
      if (isRefreshing) {
        // اگر الان داره رفرش می‌کنه، درخواست رو تو صف می‌ذاریم
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem('refresh');

      if (!refresh) {
        // توکن رفرش نداریم، هدایت به صفحه لاگین
        localStorage.clear();
        history.push('/login'); // یا navigate اگر داری از React Router استفاده می‌کنی
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        axios
          .post(BASE_URL + 'refresh/', { refresh })
          .then(({ data }) => {
            localStorage.setItem('access', data.access);
            api.defaults.headers.common['Authorization'] = 'Bearer ' + data.access;
            originalRequest.headers['Authorization'] = 'Bearer ' + data.access;
            processQueue(null, data.access);
            resolve(api(originalRequest));
          })
          .catch(err => {
            processQueue(err, null);
            localStorage.clear();
            history.push('/login'); // هدایت به صفحه ورود
            toast.error('لطفا دوباره وارد شوید');
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;



// import api from './api';

// async function createMultiPlayerGame(difficulty) {
//   try {
//     const response = await api.post('/games/create/multi-player', {
//       difficulty: difficulty // 'easy' یا 'medium' یا 'hard'
//     });
//     console.log('بازی ایجاد شد:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('خطا در ایجاد بازی:', error);
//     // اینجا می‌تونی خطاها رو هندل کنی (مثلاً نمایش پیغام به کاربر)
//   }
// }
