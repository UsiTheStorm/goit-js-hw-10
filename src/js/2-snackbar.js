/* eslint-disable prefer-promise-reject-errors */
import { showSuccessToast, showErrorToast } from './utilitis/toasts';

const form = document.querySelector('.form');

// Function to get promise result
function getPromise(delay, state) {
    return new Promise((res, rej) => {
        if (state === 'fullfilled') {
            res(`Fulfilled promise in ${delay}ms`);
        } else {
            rej(`Rejected promise in ${delay}ms`);
        }
    });
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(form);
    const delayValue = Number(formData.get('delay'));
    const stateValue = formData.get('state');

    console.log('Delay:', delayValue);
    console.log('State:', stateValue);
});
