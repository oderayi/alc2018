/**
 * history.component.js
 * 
 * Displays conversion history
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import Component from '../../component';
import Http from '../../http';
import Utils from '../../utils';

function OrdersComponent() {
  Component.call();
}

OrdersComponent.prototype = Object.create(Component.prototype);

OrdersComponent.prototype.constructor = OrdersComponent;

OrdersComponent.prototype.init = function(props) {
  props = props || {};
  props.service = props.service || new OrdersService();
  Component.prototype.init.call(this, props);
  return this;
};

OrdersComponent.prototype.getTemplate = function() {
  return `
    <section class="orders component" id="orders">
      <h1 class="mb-1">My Transactions</h1>
      <div class="table-responsive">
      <table class="table">
        <thead>
        </thead>
        <tbody>
        </tbody>
        <tfoot class="text-left">
          <tr scope="row">
            <td class="text-center" colspan="100%">You have not placed any order yet.</td>
          </tr>
        </tfoot>
      </table>
      </div>
    </section>
  `;
};

OrdersComponent.prototype.setTitle = function(title) {
  this.component
    .find("h1")
    .first()
    .html(title);
  return this;
};

OrdersComponent.prototype.onBind = function() {
  $(window).on(
    "sell_transaction_completed converter_transaction_completed",
    (e, data) => {
      this.loadOrders();
    }
  );

  this.loadOrders();
};

OrdersComponent.prototype.loadOrders = function() {
  let table = this.component.find("table");
  return new Promise((resolve, reject) => {
    this.service
      .getOrders()
      .then(res => {
        if (res.orders.length < 1) {
          resolve([]);
          return;
        }
        let tableHead = `
      <tr scope="row">
        <th width="10%">Ref. #</th>
        <th width="20%">Date</th>
        <th>Action</th>
        <th>Units</th>
        <th>Price</th>
        <th>Status</th>
      </tr>`;
        table.find("thead").html(tableHead);
        let tableRows = "";
        for (let i = 0; i < res.orders.length; i++) {
          const row = res.orders[i];
          tableRows += `
				<tr scope="row">
        <td>${row.ref}</td>
				<td>${Utils.formatDateTime(row.created_at)}</td>
				<td>${row.order_type == "converter"
          ? '<span class = "text-success">Bought</span>'
          : '<span class = "text-warning">Sold</span>'}</td>
				<td>${row.crypto_amount} ${row.crypto_code}</td>
				<td>${Utils.formatCurrencyLocal(row.total)}</td>
        <td>${Utils.capitalize(row.status)}</td>
				</tr>`;
        }
        if (tableRows) {
          table.find("tbody").html(tableRows);
        }
        table.find("tfoot").html(
          `<tr scope="row"><td colspan="100%">Total: 
          <strong>${res.orders.length} transaction${res.orders.length > 1
            ? "s"
            : ""}</strong>.</td></tr>`
        );
      })
      .catch(xhr => {Http.handleError(xhr); reject(xhr)});
  });
};

OrdersComponent.prototype.onUnbind = function() {
  this.component.find("table body, table foot").html("");
};

/**
*  OrdersService
*
*/
function OrdersService(options) {
  const opts = options || {};
  this.api_root = opts.api_root || window.context.getAPIRoot();
}

OrdersService.prototype.constructor = OrdersService;

/**
* get all orders data
*/
OrdersService.prototype.getOrders = function() {
  return new Promise((resolve, reject) => {
    Http.get(`${this.api_root}/orders`)
      .done(data => resolve(data))
      .fail(xhr => reject(xhr));
  });
};

module.exports = OrdersComponent;
