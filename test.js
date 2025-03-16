console.log(new Date().getFullYear())


let accountNumber = "";


for (let i = 0; i < 11; i++) {
    const randNumber = String(Math.floor(Math.random() * 9) + 1);
    accountNumber = accountNumber.concat(randNumber);
}

accountNumber = Number(accountNumber);

console.log(accountNumber);