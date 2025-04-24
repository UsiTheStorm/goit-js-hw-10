import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Function to show a success toast
export const showSuccessToast = (message) => {
    iziToast.success({
        title: 'Ok',
        // backgroundColor: '#6e65e1',
        // color: '#ea5252',
        message: message,
        position: 'topRight',
        transitionIn: 'bounceInRight', // Анімація входу (аналогічно bounceInRight класу)
        transitionOut: 'fadeOut', // Анімація виходу
        progressBar: true,
        theme: 'light',
        animateInside: true,
    });
};
