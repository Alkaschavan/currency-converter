const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");
const historyList = document.getElementById("historyList");

const API_URL =
"https://open.er-api.com/v6/latest/USD";

const countryList = {
    USD:"US",
    INR:"IN",
    EUR:"EU",
    GBP:"GB",
    AED:"AE",
    KWD:"KW",
    SAR:"SA",
    CAD:"CA",
    AUD:"AU",
    JPY:"JP"
};

let exchangeRates = {};

async function loadCurrencies(){

    try{

        const response = await fetch(API_URL);
        const data = await response.json();

        exchangeRates = data.rates;

        Object.keys(exchangeRates).forEach(currency => {

            const option1 =
            document.createElement("option");

            option1.value = currency;
            option1.innerText = currency;

            const option2 =
            option1.cloneNode(true);

            fromCurrency.appendChild(option1);
            toCurrency.appendChild(option2);

        });

        fromCurrency.value = "USD";
        toCurrency.value = "INR";

        updateFlags();

    }catch(error){
        console.log(error);
    }
}

function updateFlags(){

    const fromCode =
    countryList[fromCurrency.value] || "US";

    const toCode =
    countryList[toCurrency.value] || "IN";

    fromFlag.src =
    `https://flagsapi.com/${fromCode}/flat/64.png`;

    toFlag.src =
    `https://flagsapi.com/${toCode}/flat/64.png`;
}

fromCurrency.addEventListener("change",updateFlags);
toCurrency.addEventListener("change",updateFlags);

async function convertCurrency(){

    const amt = amount.value;

    if(amt === "" || amt <= 0){
        alert("Enter valid amount");
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    const usdAmount =
    amt / exchangeRates[from];

    const converted =
    usdAmount * exchangeRates[to];

    result.innerHTML =
    `${amt} ${from} = ${converted.toFixed(2)} ${to}`;

    saveHistory(result.innerText);
}

document
.getElementById("convertBtn")
.addEventListener("click",convertCurrency);

document
.getElementById("swapBtn")
.addEventListener("click",()=>{

    let temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    updateFlags();
});

function saveHistory(text){

    let history =
    JSON.parse(localStorage.getItem("history"))
    || [];

    history.unshift(text);

    history = history.slice(0,5);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    displayHistory();
}

function displayHistory(){

    const history =
    JSON.parse(localStorage.getItem("history"))
    || [];

    historyList.innerHTML = "";

    history.forEach(item=>{

        const li =
        document.createElement("li");

        li.textContent = item;

        historyList.appendChild(li);
    });
}

document
.getElementById("themeBtn")
.addEventListener("click",()=>{

    document.body.classList.toggle("dark");
});

loadCurrencies();
displayHistory();