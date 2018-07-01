/**
 * converter.service.js
 * 
 * Currency converter service
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import Http from "../../http";

/**
 *  ConverterService
 *
 */
function ConverterService(options) {
    const opts = options || {};
    this.api_root = opts.api_root || "https://free.currencyconverterapi.com/api/v5";
}

ConverterService.prototype.constructor = ConverterService;

/**
 * get currencies
 */
ConverterService.prototype.getCurrencies = function () {
    return new Promise((resolve, reject) => {
        Http.get(`${this.api_root}/currencies`)
            .done(response => resolve(response.results))
            .fail(xhr => reject(xhr));
    });
};

/**
 * get conversion
 *
 * @params { from_currency, to_currency, from_amount }
 * @return { data: { from_currency, from_amount, to_currency, to_amount } }
 */
ConverterService.prototype.getConversion = function (params) {
    const api_params = `${params.from_currency}_${params.to_currency}` 
    return new Promise((resolve, reject) => {
        Http.get(`${this.api_root}/convert`, {q: api_params, compact: 'ultra'})
            .done(response => {
                const response_price = parseFloat(response[Object.keys(response)[0]]);
                const to_amount = parseFloat(params.from_amount) * response_price;
                const data = {
                    from_currency: params.from_currency,
                    from_amount: params.from_amount,
                    to_currency: params.to_currency,
                    to_amount: to_amount
                };
                resolve(data);
            })
            .fail(xhr => reject(xhr));
    });
};

module.exports = ConverterService;
