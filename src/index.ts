import { latestAsync, historicRatesAsync } from "./exchangeratesapi";
import { calculate, calculateReverse } from "./calculate";
import { ResponseHistoricRates } from "./exchangeratesapi.d";
import { map } from "./number";

(async function () {

  const currencyCode1 = document.querySelector<HTMLSelectElement>("#currency_code1");
  const currencyCode2 = document.querySelector<HTMLSelectElement>("#currency_code2");

  const number1 = document.querySelector<HTMLInputElement>("#number1");
  const number2 = document.querySelector<HTMLInputElement>("#number2");

  const canvas = document.querySelector<HTMLCanvasElement>("#canvas");

  if (currencyCode1 && currencyCode2 && number1 && number2 && canvas) {
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

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('context not found');

    const w = canvas.width;
    const h = canvas.height;

    let hr = localStorage.getItem('historic');
    let historicRates: ResponseHistoricRates[];
    if (hr) {
      historicRates = JSON.parse(hr);
    } else {
      historicRates = await historicRatesAsync({ dateOffset: 15 });
      localStorage.setItem('historic', JSON.stringify(historicRates));
    }

    function drawHistoricalRates(ctx: CanvasRenderingContext2D, langCode: string) {
      ctx.clearRect(0, 0, w, h);

      const max = Math.max(...historicRates.map(h => h.rates[langCode]));
      const min = Math.min(...historicRates.map(h => h.rates[langCode]));
      const offsetX = 75;

      ctx.font = "14px Arial";
      ctx.textAlign = 'start';
      ctx.textBaseline = 'top';
      ctx.fillText(max.toString(), 8, 8, offsetX);

      ctx.textBaseline = 'bottom';
      ctx.fillText(min.toString(), 8, h - 50, offsetX);

      const ox = (w - offsetX) / historicRates.length;

      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.strokeStyle = 'black';

      ctx.beginPath();
      for (let i = 0; i < historicRates.length; i++) {
        const x = offsetX + (ox / 2) + (i * ox);
        const y = map(historicRates[i].rates[langCode], min, max, 16, h - 58) - 4;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        ctx.strokeRect(x - 3, y - 3, 6, 6);
        ctx.fillText(historicRates[i].date, x, h - 10 - (i % 2) * 20, ox);
      }

      ctx.strokeStyle = 'red';
      ctx.stroke();
    }

    currencyCode2.addEventListener('change', function () {
      number2!.value = calculate(number1!.value, this.value);
      drawHistoricalRates(ctx!, this.options[this.selectedIndex].text);
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