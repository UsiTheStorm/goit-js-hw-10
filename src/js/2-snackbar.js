/* eslint-disable prefer-promise-reject-errors */
import { showSuccessToast, showErrorToast } from './utilitis/toasts';

const form = document.querySelector('.form');

// Function to get promise result
function getPromise(delay, state) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                res(`Fulfilled promise in ${delay}ms`);
            } else {
                rej(`Rejected promise in ${delay}ms`);
            }
        }, delay);
    });
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(form);
    const delayValue = Number(formData.get('delay'));
    const stateValue = formData.get('state');

    getPromise(delayValue, stateValue)
        .then((message) => {
            showSuccessToast(message);
        })
        .catch((message) => {
            showErrorToast(message);
        });
});
