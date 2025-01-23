'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Gary Wintle',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 114,
};

const account2 = {
  owner: 'Michiyo Arakawa',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 910,
};

const account3 = {
  owner: 'Casey Sota',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 316,
};

const account4 = {
  owner: 'Yasuo Arakawa',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 119,
};

const accounts = [account1, account2, account3, account4];

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

// Adds transaction data to list
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}円</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Adds current balance to the DOM
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}円`;
};

// Displays summary of transactions. In, out, and interest

// In
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}円`;

  // Out
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}円`;

  //Interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}円`;
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
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

//EVENT HANDLERS

//Logging In Functionality
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username.toLowerCase() === inputLoginUsername.value.toLowerCase()
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Update the UI
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = 'Error! Login Invalid :(';
  }
});

// Transfer Money Functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
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
    // Update the UI
    updateUI(currentAccount);
  } else {
    console.log('Error! Not a Valid Transfer...');
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);

console.log(movements.includes(-130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// const lastWithdrawal = movements.findLast(acc => 0 > acc);

// console.log(lastWithdrawal);

// const withdrawalStatement = function () {
//   const lastWithdrawal = movements.findLast(acc => 0 > acc);
//   const lastWithdrawalIndex = movements.findIndex(acc => 0 > acc);
//   return console.log(
//     `Your last withdrawal ($${Math.abs(lastWithdrawal)}) was ${
//       lastWithdrawalIndex + 1
//     } transactions ago.`
//   );
// };

// withdrawalStatement();
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// const deposits = movements.filter(mov => mov > 0);

// console.log(movements);
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);

// console.log('withdrawals', withdrawals);

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movementsUSD);

// const movementsUSDfor = [];

// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);

// console.log('for', movementsUSDfor);

// const movDesc = movements.map(
//   (mov, i) =>
//     `Transaction ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movDesc);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

// const balance = movements.reduce((acc, cur) => acc + cur);

// console.log('Snowball Balance:', balance);

// Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// const max = movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   movements[0]
// );

// console.log(max);

/////////////////////////////////////////////////

//SLICE

// let arr = ['a', 'b', 'c', 'd', 'e'];
// const slicedArr = arr.slice(); //['a', 'b', 'c', 'd', 'e']

// console.log(slicedArr);

//SPLICE

// console.log(arr); //['a', 'b', 'c', 'd', 'e']
// console.log(arr.splice(-1, 2)); //['e']
// console.log(arr); //['a', 'b', 'c', 'd']

// arr.splice(1, 3); //["a", "e"]
// console.log(arr);

// // REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());

// console.log(arr2); //['y', 'x', 'n', 'i', 'j']

// // CONCAT

// const letters = arr.concat(arr2);
// console.log(letters); // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

// console.log(arr2);
// console.log([...arr, ...arr2]); // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

// // JOIN

// console.log(letters.join('/')); // a/b/c/d/e/f/g/h/i/j

// console.log(letters);

// const arr = [23, 11, 64];
// console.log(arr.at(0)); //23

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);

// console.log(arr.at(-1));

// console.log('Casey'.at(0));
// console.log('Casey'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Transaction ${i}: You deposited ${movement}.`);
//   } else {
//     console.log(`Transaction ${i}: You withdrew ${Math.abs(movement)}.`);
//   }
// }

// movements.forEach(function (movement, index, array) {
//   if (movement > 0) {
//     console.log(`Transaction ${index + 1}: You deposited ${movement}.`);
//   } else {
//     console.log(
//       `Transaction ${index + 1}: You withdrew ${Math.abs(movement)}.`
//     );
//   }
// });

// const juliaData = [3, 5, 2, 12, 7];
// const kateData = [4, 1, 15, 8, 3];

// const checkDogs = function () {
//   juliaData
//     .slice(1, -2)
//     .concat(kateData)
//     .forEach(function (doggy, i) {
//       if (doggy >= 3) {
//         console.log(
//           `Doggy number ${i + 1} is an adult, and is ${doggy} years old.`
//         );
//       } else {
//         console.log(
//           `Doggy number ${i + 1} is an puppy, and is ${doggy} years old.`
//         );
//       }
//     });
// };

// checkDogs();

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log('--------------------------');

// const testDataOne = [5, 2, 4, 1, 15, 8, 3];
// const testData2 = [16, 6, 10, 5, 6, 1, 4];

// const calAverageHumanAge = function (dogAges) {
//   // step1. calculate to dog age to human age
//   const humanAge = dogAges.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   // step2. Exclude dogs younger than 18
//   const adultDogs = humanAge.filter(humanAge => humanAge >= 18);
//   //step3. Calc Average human age of all adult dogs
//   const avgAge =
//     adultDogs.reduce((acc, age) => age + acc, 0) / adultDogs.length;
//   return avgAge;
//   // console.log(adultDogs);
//   // return console.log(avgAge);
// };

// console.log(calAverageHumanAge(testDataOne));
// console.log(calAverageHumanAge(testData2));

// const testDataOne = [5, 2, 4, 1, 15, 8, 3];
// const testData2 = [16, 6, 10, 5, 6, 1, 4];

// const calAverageHumanAge = dogAges =>
//   dogAges
//     .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//     .filter(humanAge => humanAge >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// console.log(calAverageHumanAge(testDataOne));
// console.log(calAverageHumanAge(testData2));
