import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Function to show a success toast
export const showSuccessToast = (message) => {
    iziToast.success({
        title: '✅',
        // backgroundColor: '#a6a2e4',
        message,
        position: 'bottomRight',
        transitionIn: 'bounceInRight',
        transitionOut: 'fadeOut',
        progressBar: true,
        theme: 'light',
        animateInside: true,
        timeout: 5000,
    });
};

// Function to show an error toast
export const showErrorToast = (message) => {
    iziToast.error({
        title: '❌',
        message,
        position: 'bottomRight',
        transitionIn: 'bounceInRight',
        transitionOut: 'fadeOut',
        progressBar: true,
        theme: 'light',
        animateInside: true,
        timeout: 5000,
    });
};

// Function to show a warning toast
export const showWarningToast = (message) => {
    iziToast.warning({
        title: '',
        message,
        backgroundColor: '#a6a2e4',
        position: 'bottomRight',
        transitionIn: 'bounceInRight',
        transitionOut: 'fadeOut',
        progressBar: true,
        theme: 'light',
        animateInside: true,
        timeout: 5000,
    });
};
