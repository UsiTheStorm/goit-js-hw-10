import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');

const dateInput = document.querySelector('#datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;
const savedDate = localStorage.getItem('countdownDate');

startBtn.disabled = true;
stopBtn.disabled = true;

// Function to check if there is svaed date from previous
function checkForSavedDate() {
    if (savedDate && Number.isFinite(Number(savedDate))) {
        let parsedDate = new Date(Number(savedDate));
        if (parsedDate > new Date()) {
            userSelectedDate = parsedDate;
            updateUi(convertMs(userSelectedDate - Date.now()));
            startCountdown();
        } else {
            localStorage.removeItem('countdownDate');
        }
    }
}
checkForSavedDate();

startBtn.addEventListener('click', () => {
    if (!userSelectedDate || userSelectedDate < new Date()) {
        window.alert('Please choose a date in the future');
    } else {
        startCountdown();
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
function pad(value) {
    return value.toString().padStart(2, '0');
}

// Function to get time difference in milliseconds
function getMsDifference(selectedDate) {
    return selectedDate - Date.now();
}

// Function to update UI
function updateUi({ days, hours, minutes, seconds }) {
    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
}
// Function to reset timer
function resetTimer() {
    clearInterval(timerId);
    userSelectedDate = null;
    timerId = null;
    startBtn.disabled = true;
    stopBtn.disabled = true;
    dateInput.disabled = false;
    updateUi({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    localStorage.removeItem('countdownDate');
}

// Function to start countdown
function startCountdown() {
    startBtn.disabled = true;
    stopBtn.disabled = false;

    if (timerId !== null) {
        console.log('Timer alredy run');
        return;
    }

    dateInput.disabled = true;

    timerId = setInterval(() => {
        let msDiff = getMsDifference(userSelectedDate);
        let time = convertMs(msDiff);
        updateUi(time);
        if (msDiff <= 0) {
            console.log('Time is up');
            window.alert('Time is up');
            resetTimer();
        }
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
    onClose(selectedDates) {
        console.log(selectedDates[0]);
        userSelectedDate = selectedDates[0];
        if (userSelectedDate < new Date()) {
            window.alert('Please choose a date in the future');
            startBtn.disabled = true;
            stopBtn.disabled = true;
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            localStorage.setItem('countdownDate', userSelectedDate.getTime());
        }
    },
};

flatpickr('#datetime-picker', options);
