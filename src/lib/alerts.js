import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showConfirmDelete = (t) => {
  return MySwal.fire({
    title: t('sweetalert.confirm_delete_title'),
    text: t('sweetalert.confirm_delete_text'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e', // rose-500
    cancelButtonColor: '#94a3b8', // slate-400
    confirmButtonText: t('sweetalert.confirm_button'),
    cancelButtonText: t('sweetalert.cancel_button'),
    background: document.documentElement.classList.contains('dark') ? '#1e1a1b' : '#fff',
    color: document.documentElement.classList.contains('dark') ? '#ede0df' : '#1a1517',
    borderRadius: '1.25rem',
  });
};

export const showSuccess = (t, type = 'save') => {
  return MySwal.fire({
    title: t('sweetalert.success_title'),
    text: type === 'delete' ? t('sweetalert.success_delete') : t('sweetalert.success_save'),
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    background: document.documentElement.classList.contains('dark') ? '#1e1a1b' : '#fff',
    color: document.documentElement.classList.contains('dark') ? '#ede0df' : '#1a1517',
    borderRadius: '1.25rem',
  });
};

export const showError = (t, message) => {
  return MySwal.fire({
    title: t('sweetalert.error_title'),
    text: message || t('sweetalert.error_text'),
    icon: 'error',
    background: document.documentElement.classList.contains('dark') ? '#1e1a1b' : '#fff',
    color: document.documentElement.classList.contains('dark') ? '#ede0df' : '#1a1517',
    borderRadius: '1.25rem',
  });
};
