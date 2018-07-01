/**
 * converter.service.js
 * 
 * Currency converter service
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */

import Http from "../../http";
import DBService from "./db.service";

/**
 *  ConverterService
 *
 */
function ConverterService(options) {
    const opts = options || {};
    this.api_root = opts.api_root || "https://free.currencyconverterapi.com/api/v5";
    this.dbService = new DBService();
    this.dbService.openDatabase();
}

ConverterService.prototype.constructor = ConverterService;
ConverterService.prototype.dbService = null;

/**
 * get currencies
 */
ConverterService.prototype.getCurrencies = function () {
    const self = this;
    // Try reading the currencies from offline db first (offline first), 
    // if no currency is stored yet, then go online and then store
    return new Promise((resolve, reject) => {
        this.dbService.getCurrencies().then(function (currencies) {
            if (currencies.length > 0) {
                resolve(currencies);
                return;
            }
            Http.get(`${self.api_root}/currencies`)
                .done(response => {
                    self.dbService.storeCurrencies(response.results);
                    resolve(response.results);
                })
                .fail(xhr => reject(xhr));
        })
    });
};

/**
 * get conversion
 *
 * @params { from_currency, to_currency, from_amount }
 * @return { data: { from_currency, from_amount, to_currency, to_amount } }
 */
ConverterService.prototype.getConversion = function (params) {
    /**
     * This shouldn't be offline first because currency rates change rather frequently.
     * So we check online first, it we succeed, we cache the result in db.
     * If connection failes, we look into the db if we have a cache of the pair and return that
     */
    const self = this;
    const pair_codes = `${params.from_currency}_${params.to_currency}`;
    const api_params = pair_codes;
    return new Promise((resolve, reject) => {
        Http.get(`${this.api_root}/convert`, { q: api_params, compact: 'ultra' })
            .done(response => {
                const rate = parseFloat(response[Object.keys(response)[0]]).toFixed(2);
                const to_amount = (parseFloat(params.from_amount) * rate).toFixed(2);
                const data = {
                    from_currency: params.from_currency,
                    from_amount: params.from_amount,
                    to_currency: params.to_currency,
                    to_amount: to_amount
                };
                // cache result in db
                self.dbService.storePair({ pair_codes, rate });
                resolve(data);
            })
            .fail(xhr => {
                this.dbService.getPair(pair_codes).then(function (pair) {
                    if (pair) {
                        const rate = parseFloat(pair.rate).toFixed(2);
                        const to_amount = (parseFloat(params.from_amount) * rate).toFixed(2);
                        const data = {
                            from_currency: params.from_currency,
                            from_amount: params.from_amount,
                            to_currency: params.to_currency,
                            to_amount: to_amount
                        };
                        resolve(data);
                        return;
                    }
                    reject();

                }).catch((e) => reject(e));
            });
    });
};

module.exports = ConverterService;
