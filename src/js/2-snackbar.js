/* eslint-disable prefer-promise-reject-errors */
import { showSuccessToast, showErrorToast } from './utilitis/toasts';

const form = document.querySelector('.form');

// Function to get promise result
function getPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(form);
    const delayValue = Number(formData.get('delay'));
    const stateValue = formData.get('state');

    if (Number.isNaN(delayValue) || delayValue < 0) {
        return showErrorToast('Please enter a valid positive delay value.');
    }
    if (!stateValue) {
        return showErrorToast('Please select a promise state (fulfilled or rejected).');
    }

    getPromise(delayValue, stateValue)
        .then((delay) => {
            showSuccessToast(`Fulfilled promise in ${delay}ms`);
        })
        .catch((delay) => {
            showErrorToast(`Rejected promise in ${delay}ms`);
        });

    evt.target.reset();
    return undefined;
});
