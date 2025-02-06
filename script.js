'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

////////////////////////////////////////////////
// Data

const account1 = {
  owner: 'Gary Wintle',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 114,

  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2024-12-28T09:15:04.904Z',
    '2025-01-01T10:17:24.185Z',
    '2025-01-29T14:11:59.604Z',
    '2025-01-31T17:01:17.194Z',
    '2025-02-03T10:36:17.929Z',
    '2025-02-04T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Michiyo Arakawa',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 910,

  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2025-01-25T14:18:46.235Z',
    '2025-02-05T16:33:06.386Z',
    '2025-04-10T14:43:26.374Z',
    '2025-06-25T18:49:59.371Z',
    '2025-07-26T12:01:20.894Z',
  ],
  currency: 'JPY',
  locale: 'ja-JP',
};

const accounts = [account1, account2];

////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////////
// FUNCTIONS

// Formats the movement dates
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Sets up Intl numbers to App
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Adds transaction data to list
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    // in the future, formatCur will need movement and not mov
    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(obj.movement, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Adds current balance to the DOM
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Displays summary of transactions. In, out, and interest

// In
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // Out
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  //Interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Makes the user's names into usernames(initials)
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//Handles all the UI Updates
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

function clearAndBlurInputs(...inputs) {
  inputs.forEach(input => {
    input.value = '';
    input.blur();
  });
}

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease by 1 second
    time--;
  };

  // Set time to 5 minute
  let time = 120;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

////////////////////////////////////////////
//EVENT HANDLERS

//Logging In Functionality
let currentAccount, timer;

// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Login Button
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username.toLowerCase() === inputLoginUsername.value.toLowerCase()
  );

  console.log(`Logging in... ${currentAccount.owner}...`);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 1;

    //Create current date and time

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    const locale = navigator.language;
    console.log(locale);

    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, '0');
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, '0');
    // const min = `${now.getMinutes()}`.padStart(2, '0');
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    clearAndBlurInputs(inputLoginUsername, inputLoginPin);
    // inputLoginUsername.value = inputLoginPin.value = '';
    // inputLoginUsername.blur();
    // inputLoginPin.blur();

    //Logout Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update the UI
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = 'Error! Login Invalid :(';
  }
});

// Transfer Money Button
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username.toLowerCase() === inputTransferTo.value.toLowerCase()
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update the UI
    updateUI(currentAccount);
  } else {
    console.log('Error! Not a Valid Transfer...');
  }
  // Reset Timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

// Loan Button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';

  // Reset Timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

// Close Account Button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username.toLowerCase() ===
      inputCloseUsername.value.toLowerCase() &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc =>
        acc.username.toLowerCase() === currentAccount.username.toLowerCase()
    );

    // Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

// Sort Button
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23 === 23.0);

// console.log(Number('23')); //23
// console.log(+'23'); //23

// //parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e23', 10)); //NaN

// console.log(Number.parseInt('2.5rem')); //2
// console.log(Number.parseFloat('2.5rem')); //2.5

// console.log(Number.isNaN(20)); //false
// console.log(Number.isNaN('20')); //false
// console.log(Number.isNaN(+'20X')); //true

// console.log(Number.isFinite(20)); //True
// console.log(Number.isFinite('20')); //False
// console.log(Number.isFinite(+'20X')); //False
// console.log(Number.isFinite(20 / 0)); //False

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// console.log(Math.max(5, 4, 1090, 2, 43, 554, 43));

// console.log(Math.min(5, 4, 1090, 2, 43, 554, 43));

//Pimping randomizer
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// console.log(randomInt(10, 20));
// console.log(randomInt(10, 999));
// console.log(randomInt(0, 3));

//Rounding Integers

// console.log(Math.trunc(23.3)); //23

// console.log(Math.round(23.3)); //23
// console.log(Math.round(23.9)); //24

// console.log(Math.ceil(23.3)); //24

// console.log(Math.floor(23.3)); //23

// //Rounding Decimals
// console.log((2.7312312).toFixed(1)); //2.7
// console.log((2.723123).toFixed(2)); //2.72
// console.log(+(2.7123123123).toFixed(3)); //2.712

// console.log(5 % 2); // 1
// console.log(10 % 2); // 0
// console.log(8 % 3); // 2

// console.log(6 % 2);

// const isEven = n => n % 2 === 0;

// console.log(isEven(9)); //false
// console.log(isEven(6)); //true
// console.log(isEven(1)); //false

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = '#dbeaee';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// const diameter = 288_283_458_235;
// console.log(diameter); //288283458235

// const priceCents = 345_99;
// console.log(priceCents); // 34599

// const transferFee1 = 12_00; //1200
// const transferFee2 = 1_200; //1200

// console.log(2 ** 53 - 1);

// console.log(42342304728957295729857205720395729057290752903752390);

// console.log(42342304728957295729857205720395729057290752903752390n);

// const huge = 1234123412341234124123453536456364n;
// const num = 23;
// console.log('huge', huge * BigInt(num));

// const now = new Date('Feb 03 2025 08:31:41');
// console.log(now);

// console.log(new Date('December 25, 1990'));
// console.log(Date('2025-02-03'));
// console.log(new Date(account1.movementsDates[0]));

// const future = new Date(2025, 10, 19, 15, 23);
// console.log(future);

// const future2 = new Date('2028-01-14');
// console.log(future2.getFullYear());

//It's February 3rd today:
// const now = new Date();
// console.log(now.getFullYear()); //2025
// console.log(now.getMonth()); // 1 (array based, it's actually feb)
// console.log(now.getDate()); // 3
// console.log(now.getDay()); // 1 (Monday)
// console.log(now.getHours()); // 12 (it's noon)
// console.log(now.getMinutes()); //39
// console.log(now.getSeconds()); //18
// console.log(now.getMilliseconds()); //35

// console.log(now.toISOString()); //2025-02-03T04:00:43.531Z

// console.log(new Date(1738555497876)); //Mon Feb 03 2025 13:04:57 GMT+0900 (Japan Standard Time)

// now.setHours(2);
// console.log(now); //Tue Feb 03 2099 13:08:27 GMT+0900 (Japan Standard Time)

// console.log(
//   `What time's it? Ah, about ${now.getMinutes()} minutes after ${
//     now.getHours() > 12 ? now.getHours() - 12 + 'pm' : now.getHours() + 'am'
//   }...`
// );

// const future = new Date(2025, 10, 19, 15, 23);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const days1 = calcDaysPassed(new Date(2023, 2, 16), new Date(2025, 1, 4));

// console.log(`Casey is ${days1} days old!`);

// const num = 24234.32;

// const options = {
//   style: 'currency',
//   currency: 'JPY',
//   // useGrouping: false,
// };

// console.log('USA:   ', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
// console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('Japan:', new Intl.NumberFormat('ja-JP', options).format(num));

// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

// setTimeout(() => console.log("Here's your 'za! 🍕"), 3000);

//setTimeout
// const ingredients = ['olives', 'spinach'];

// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here's your 'za 🍕 with ${ing1} and ${ing2}!`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting...');

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//setTimeout

// setInterval(function () {
//   const now = new Date();
//   let seconds = now.getSeconds();
//   let minutes = now.getMinutes();
//   let hours = now.getHours();

//   return console.log(`${(hours += 1)}:${(minutes += 1)}:${(seconds += 1)}`);
// }, 1000);
//It's February 3rd today:
// const now = new Date();
// console.log(now.getFullYear()); //2025
// console.log(now.getMonth()); // 1 (array based, it's actually feb)
// console.log(now.getDate()); // 3
// console.log(now.getDay()); // 1 (Monday)
// console.log(now.getHours()); // 12 (it's noon)
// console.log(now.getMinutes()); //39
// console.log(now.getSeconds()); //18
// console.log(now.getMilliseconds()); //35

// const timer = function () {};

// function checkAge(age) {
//   if (age >= 18) {
//     return `You are a ${age} year old adult.`;
//   } else {
//     return `You are a ${age} year old minor.`;
//   }
// }

// console.log(checkAge(20)); // "You are an adult."
// console.log(checkAge(15)); // "You are a minor."
