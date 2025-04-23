import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate;

startBtn.disabled = true;
stopBtn.disabled = true;

// Function to convert milliseconds to days, hours, minutes and seconds
function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000));
// console.log(convertMs(userSelectedDate - Date.now())); // {days: 0, hours: 6 minutes: 42, seconds: 20}

// Function to add leading zero
function pad(value) {
    return value.toString().padStart(2, '0');
}
console.log('Pad:', pad(5));

// Function to get time difference
function getTimeDifference(selectedDate) {
    return selectedDate - Date.now();
}

// Function to update UI
function updateUi({ days, hours, minutes, seconds }) {
    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
}
// function startCountdoun()

// Timer initialization
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minDate: 'today',
    minuteIncrement: 1,
    onClose(selectedDates) {
        console.log(selectedDates[0]);
        userSelectedDate = selectedDates[0];
        if (userSelectedDate < new Date()) {
            window.alert('Please choose a date in the future');
            startBtn.disabled = true;
            stopBtn.disabled = true;
        } else {
            startBtn.disabled = false;
            // stopBtn.disabled = false;
        }
    },
};
flatpickr('#datetime-picker', options);
