import { latestAsync } from "./exchangeratesapi";
import { calculate, calculateReverse } from "./calculate";

(async function () {
  const currencyCode1 = document.querySelector<HTMLSelectElement>("#currency_code1");
  const currencyCode2 = document.querySelector<HTMLSelectElement>("#currency_code2");

  const number1 = document.querySelector<HTMLInputElement>("#number1");
  const number2 = document.querySelector<HTMLInputElement>("#number2");

  if (currencyCode1 && currencyCode2 && number1 && number2) {
    const latest = await latestAsync();
    for (var rate in latest.rates) {
      const option1 = new Option(rate, latest.rates[rate].toString());
      if (rate === latest.base) {
        option1.selected = true;
      }
      currencyCode1.add(option1);

      const option2 = new Option(rate, latest.rates[rate].toString());
      currencyCode2.add(option2);
    }

    currencyCode2.addEventListener('change', function () {
      number2!.value = calculate(number1!.value, this.value);
    });

    // dispatch change event to trigger the initial default calculation
    currencyCode2.dispatchEvent(new Event("change"));

    number1.addEventListener('change', function () {
      number2!.value = calculate(this.value, currencyCode2.options[currencyCode2.selectedIndex].value);
    });

    number2.addEventListener('change', function () {
      number1!.value = calculateReverse(this.value, currencyCode2.options[currencyCode2.selectedIndex].value);
    });
  }
})();