import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { showSuccessToast, showWarningToast } from './utilitis/toasts';

const TIMER_STATE_IDLE = 'idle';
const TIMER_STATE_READY = 'ready';
const TIMER_STATE_RUNNING = 'running';

const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');

const dateInput = document.querySelector('#datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;
let savedDate = Number(localStorage.getItem('countdownDate'));

setTimerState(TIMER_STATE_IDLE);

// Function to check if there is saved date from previous
function checkForSavedDate() {
    if (savedDate && Number.isFinite(savedDate)) {
        const savedDateObject = new Date(savedDate);
        if (savedDateObject > new Date()) {
            userSelectedDate = savedDateObject;
            updateUi(convertMs(userSelectedDate - Date.now()));
            startCountdown();
        } else {
            localStorage.removeItem('countdownDate');
            setTimerState(TIMER_STATE_IDLE);
        }
    } else {
        setTimerState(TIMER_STATE_IDLE);
    }
}
checkForSavedDate();

// Function to change timer and buttons state
function setTimerState(state) {
    switch (state) {
        // Timer is waiting for date input / Stopped
        case TIMER_STATE_IDLE:
            startBtn.disabled = true;
            stopBtn.disabled = true;
            dateInput.disabled = false;
            break;
        // Timer is ready for running
        case TIMER_STATE_READY:
            startBtn.disabled = false;
            stopBtn.disabled = true;
            dateInput.disabled = false;
            break;
        // Timer is running
        case TIMER_STATE_RUNNING:
            startBtn.disabled = true;
            stopBtn.disabled = false;
            dateInput.disabled = true;
            break;
        default:
            console.error(`Unknown timer state: ${state}`);
    }
}

startBtn.addEventListener('click', () => {
    if (!userSelectedDate || userSelectedDate < new Date()) {
        showWarningToast('Please choose a date in the future');
    } else {
        startCountdown();
        showSuccessToast('Countdown started');
    }
});
stopBtn.addEventListener('click', stopCountdown);

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

// Function to add leading zero
function padWithZero(value) {
    return value.toString().padStart(2, '0');
}

// Function to get time difference in milliseconds
function getMsDifference(selectedDate) {
    return selectedDate - Date.now();
}

// Function to update UI
function updateUi({ days, hours, minutes, seconds }) {
    daysEl.textContent = padWithZero(days);
    hoursEl.textContent = padWithZero(hours);
    minutesEl.textContent = padWithZero(minutes);
    secondsEl.textContent = padWithZero(seconds);
}
// Function to reset timer
function resetTimer() {
    clearInterval(timerId);
    userSelectedDate = null;
    timerId = null;
    setTimerState('idle');
    updateUi({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    localStorage.removeItem('countdownDate');
}

// Function to start countdown
function startCountdown() {
    if (timerId !== null) {
        showWarningToast('Timer is already running');
        return;
    }

    setTimerState(TIMER_STATE_RUNNING);

    timerId = setInterval(() => {
        let msDiff = getMsDifference(userSelectedDate);
        if (msDiff <= 0) {
            console.log('Time is up');
            showSuccessToast('Time is up');
            resetTimer();
            return;
        }
        let time = convertMs(msDiff);
        updateUi(time);
    }, 1000);
}

// Function to stop countdown
function stopCountdown() {
    resetTimer();
    console.log('Timer stopped');
}

// Timer initialization
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minDate: 'today',
    minuteIncrement: 1,
    // This function is triggered when the date picker is closed.
    // It validates the selected date and updates the timer state accordingly.
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (userSelectedDate < new Date()) {
            showWarningToast('Please choose a date in the future');
            setTimerState('idle');
        } else {
            setTimerState(TIMER_STATE_READY);
            if (localStorage.getItem('countdownDate') !== userSelectedDate.getTime().toString()) {
                localStorage.setItem('countdownDate', userSelectedDate.getTime());
            }
        }
    },
};

flatpickr('#datetime-picker', options);
