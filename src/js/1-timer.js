import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import confetti from 'canvas-confetti';

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

//! --- Functions ---

// Pad single digits with a leading zero
function padWithZero(value) {
    return value.toString().padStart(2, '0');
}

// Convert milliseconds to DHMS format
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

// Get time difference in milliseconds
function getMsDifference(selectedDate) {
    return selectedDate - Date.now();
}

// Update the timer display in the UI
function updateUi({ days, hours, minutes, seconds }) {
    daysEl.textContent = padWithZero(days);
    hoursEl.textContent = padWithZero(hours);
    minutesEl.textContent = padWithZero(minutes);
    secondsEl.textContent = padWithZero(seconds);
}

// Manage button and input states
function setTimerState(state) {
    switch (state) {
        case TIMER_STATE_IDLE:
            startBtn.disabled = true;
            stopBtn.disabled = true;
            dateInput.disabled = false;
            break;
        case TIMER_STATE_READY:
            startBtn.disabled = false;
            stopBtn.disabled = true;
            dateInput.disabled = false;
            break;
        case TIMER_STATE_RUNNING:
            startBtn.disabled = true;
            stopBtn.disabled = false;
            dateInput.disabled = true;
            break;
        default:
            console.error(`Unknown timer state: ${state}`);
    }
}

// Reset timer state and UI
function resetTimer() {
    clearInterval(timerId);
    userSelectedDate = null;
    timerId = null;
    setTimerState(TIMER_STATE_IDLE);
    updateUi({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    localStorage.removeItem('countdownDate');
    localStorage.removeItem('isCountdownRunning');
}

// Start the countdown timer
function startCountdown() {
    if (timerId !== null) {
        showWarningToast('Timer is already running');
        return;
    }

    setTimerState(TIMER_STATE_RUNNING);

    timerId = setInterval(() => {
        const msDiff = getMsDifference(userSelectedDate);
        if (msDiff <= 0) {
            console.log('Time is up');
            showSuccessToast('Time is up');
            confetti({
                particleCount: 100,
                spread: 100,
                origin: { y: 0.6 },
            });
            resetTimer();
            return;
        }
        const time = convertMs(msDiff);
        updateUi(time);
    }, 1000);
}

// Stop the countdown timer
function stopCountdown() {
    resetTimer();
    console.log('Timer stopped');
}

// Get saved date from localStorage or current date
function getSetDateOrNow() {
    const localSavedDate = Number(localStorage.getItem('countdownDate'));
    return localSavedDate && Number.isFinite(localSavedDate)
        ? new Date(localSavedDate)
        : new Date();
}

// Check and restore saved state from previous session
function checkForSavedDate() {
    const savedDate = Number(localStorage.getItem('countdownDate'));
    const isCountdownRunning = localStorage.getItem('isCountdownRunning');

    if (savedDate && Number.isFinite(savedDate)) {
        const savedDateObject = new Date(savedDate);
        if (savedDateObject > new Date()) {
            userSelectedDate = savedDateObject;
            setTimerState(TIMER_STATE_READY);
            if (isCountdownRunning === 'true') {
                updateUi(convertMs(userSelectedDate - Date.now()));
                startCountdown();
            }
        } else {
            localStorage.removeItem('countdownDate');
            localStorage.removeItem('isCountdownRunning');
            setTimerState(TIMER_STATE_IDLE);
        }
    } else {
        setTimerState(TIMER_STATE_IDLE);
    }
}

//! --- Initialization ---

// Initial setup of button/input state
setTimerState(TIMER_STATE_IDLE);

// Check for and restore saved timer state
checkForSavedDate();

// Add event listeners to buttons
startBtn.addEventListener('click', () => {
    if (!userSelectedDate || userSelectedDate < new Date()) {
        showWarningToast('Please choose a date in the future');
    } else {
        startCountdown();
        localStorage.setItem('isCountdownRunning', 'true');
        showSuccessToast('Countdown started');
    }
});
stopBtn.addEventListener('click', stopCountdown);

// Flatpickr Options and Initialization
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: getSetDateOrNow(),
    minDate: 'today',
    minuteIncrement: 1, // Flatpickr onClose handler
    onClose(selectedDates) {
        // Use array destructuring for the selected date
        [userSelectedDate] = selectedDates;

        if (userSelectedDate < new Date()) {
            showWarningToast('Please choose a date in the future');
            setTimerState(TIMER_STATE_IDLE);
            localStorage.removeItem('countdownDate');
            localStorage.removeItem('isCountdownRunning');
        } else {
            setTimerState(TIMER_STATE_READY);
            if (Number(localStorage.getItem('countdownDate')) !== userSelectedDate.getTime()) {
                localStorage.setItem('countdownDate', userSelectedDate.getTime());
            }
            localStorage.setItem('isCountdownRunning', 'false');
        }
    },
};

// Initialize Flatpickr on the date input element
flatpickr('#datetime-picker', options);
