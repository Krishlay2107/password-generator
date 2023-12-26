const inputslider = document.querySelector("[data-lengthslide]");
const lengthshow = document.querySelector("[data-lengthnum]");
const passwordDisplay = document.querySelector("[data-passworddisplay]");
const message = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copybtn]");
const uppercasecheck = document.querySelector("#upper");
const lowercasecheck = document.querySelector("#lower");
const symbolcheck = document.querySelector("#symbol");
const numbercheck = document.querySelector("#num");
const generateBtn = document.querySelector("[data-generatebtn]");
const indicator = document.querySelector("[data-indicator]");
const symbols = "@#$%^&*()-_~+*[{}<]>?/";

let password = "";
let checkcount = 0;
let passwordLength = 10;

handleslider();

function handleslider() {
  inputslider.value = passwordLength;
  lengthshow.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRNDinteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomnumber() {
  return getRNDinteger(0, 10);
}

function generateUppercase() {
  return String.fromCharCode(getRNDinteger(65, 91));
}

function generateLowercase() {
  return String.fromCharCode(getRNDinteger(97, 123));
}

function generateSymbols() {
  const rndnum = getRNDinteger(0, symbols.length);
  return symbols.charAt(rndnum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSymbol = false;

  if (uppercasecheck.checked) hasUpper = true;
  if (lowercasecheck.checked) hasLower = true;
  if (numbercheck.checked) hasNum = true;
  if (symbolcheck.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if ((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    message.innerText = "Copied";
  } catch (e) {
    message.innerText = "Failed";
  }

  message.classList.add("active");
  setTimeout(() => {
    message.classList.remove("active");
  }, 2000);
}

inputslider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleslider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

function handleCheckboxChange() {
  checkcount = 0;
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) checkcount++;
  });

  if (passwordLength < checkcount) {
    passwordLength = checkcount;
    handleslider();
  }
}

const checkboxes = document.querySelectorAll("input[type=checkbox]");
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckboxChange);
});

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generateBtn.addEventListener('click', () => {
  if (checkcount <= 0) return;

  if (passwordLength < checkcount) {
    passwordLength = checkcount;
    handleslider();
  }

  password = "";

  const funArr = [];

  if (uppercasecheck.checked) {
    funArr.push(generateUppercase);
  }

  if (lowercasecheck.checked) {
    funArr.push(generateLowercase);
  }

  if (numbercheck.checked) {
    funArr.push(generateRandomnumber);
  }

  if (symbolcheck.checked) {
    funArr.push(generateSymbols);
  }

  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  for (let i = 0; i < passwordLength - funArr.length; i++) {
    const randIndex = getRNDinteger(0, funArr.length);
    password += funArr[randIndex]();
  }

  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});
