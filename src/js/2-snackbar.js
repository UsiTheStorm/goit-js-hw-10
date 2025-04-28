import { showSuccessToast, showErrorToast } from './utilitis/toasts';

const form = document.querySelector('.form');

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(form);
    const delayValue = formData.get('delay');
    const stateValue = formData.get('state');

    console.log('Delay:', delayValue);
    console.log('State:', stateValue);
});
// const promise = ()
