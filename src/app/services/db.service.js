/**
 * db.service.js
 * 
 * IndexedDB service. 
 * @author Steven Oderayi <oderayi@gmail.com>
 */
// indexedDB library
import idb from 'idb';

const dbName = 'cc-db';
const currenciesTable = 'currencies';
const ratesTable = 'rates';
const dbVersion = 1;

function DBService() {}

DBService.prototype.constructor = DBService;
DBService.prototype.dbHandle = null;

DBService.prototype.openDatabase = function () {
    if (!navigator.serviceWorker) {
        return Promise.resolve();
    }

    this.dbHandle = idb.open(dbName, dbVersion, function (upgradeDb) {
        // create `rates` table
        let ratesStore = upgradeDb.createObjectStore(ratesTable, {
            keyPath: 'pair_codes'
        });

        // create 'by-pair-codes' index
        ratesStore.createIndex('by-pair-codes', 'pair_codes');

        // create currencies table
        upgradeDb.createObjectStore(currenciesTable, {
            keyPath: 'id'
        });
    });

    return this.dbHandle;
}

/**
 * Stores conversion rate for a pair of currencies.
 * A pair is stored as CUR1_CUR2 e.g. NGN_USD along with rate
 * 
 * @param pair 
 */
DBService.prototype.storePair = function (pair) {
    return this.dbHandle.then(function (db) {
        if (!db) return;

        let tx = db.transaction(ratesTable, 'readwrite');
        let store = tx.objectStore(ratesTable);
        return store.put(pair);
    });
}



/**
 * Returns conversion rate for a pair of currencies.
 * A pair is stored as CUR1_CUR2 eng NGN_USD
 * 
 * @param pair_codes
 */
DBService.prototype.getPair = function (pair_codes) {
    return this.dbHandle.then(function (db) {
        if (!db) return;

        let index = db.transaction(ratesTable)
            .objectStore(ratesTable).index('by-pair-codes');

        return index.get(pair_codes);
    });
}

/**
 * Stores  currencies from the api
 * 
 * @param currencies 
 */
DBService.prototype.storeCurrencies = function (currencies) {
    return this.dbHandle.then(function (db) {
        if (!db) return;

        let tx = db.transaction(currenciesTable, 'readwrite');
        let store = tx.objectStore(currenciesTable);

        for(let currency in currencies){
            store.put(currencies[currency]);
        }
        return;
    });
}


/**
 * Returns currencies from the db
 * 
 */
DBService.prototype.getCurrencies = function () {
    return this.dbHandle.then(function (db) {
        if (!db) return;
        return db.transaction(currenciesTable).objectStore(currenciesTable).getAll();
    });
}

module.exports = DBService;
