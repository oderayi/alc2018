/**
 * history.component.js
 * 
 * Displays conversion history
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import Component from '../../component';
import Http from '../../http';

function HistoryComponent() {
  Component.call();
}

HistoryComponent.prototype = Object.create(Component.prototype);

HistoryComponent.prototype.constructor = HistoryComponent;

HistoryComponent.prototype.init = function(props) {
  props = props || {};
  props.service = props.service || new HistoryService();
  Component.prototype.init.call(this, props);
  return this;
};

HistoryComponent.prototype.getTemplate = function() {
  return `
    <section class="history component" id="history">
      <h1 class="mb-1">History</h1>
      <div class="table-responsive">
      <table class="table">
        <thead>
        </thead>
        <tbody>
        </tbody>
        <tfoot class="text-left">
          <tr scope="row">
            <td class="text-center" colspan="100%">Empty :-( </td>
          </tr>
        </tfoot>
      </table>
      </div>
    </section>
  `;
};

HistoryComponent.prototype.setTitle = function(title) {
  this.component
    .find("h1")
    .first()
    .html(title);
  return this;
};

HistoryComponent.prototype.onBind = function() {
  // TODO: loadHistory from indexed DB
  return;
  $(window).on(
    "conversion_completed",
    (e, data) => {
      this.loadHistory();
    }
  );

  this.loadHistory();
};

HistoryComponent.prototype.loadHistory = function() {
  let table = this.component.find("table");
  return new Promise((resolve, reject) => {
    this.service
      .getHistory()
      .then(res => {
        if (res.history.length < 1) {
          resolve([]);
          return;
        }
        let tableHead = `
      <tr scope="row">
        <th>From Currency</th>
        <th>From Amount</th>
        <th>To Currency</th>
        <th>To Amount</th>
      </tr>`;
        table.find("thead").html(tableHead);
        let tableRows = "";
        for (let i = 0; i < res.history.length; i++) {
          const row = res.history[i];
          tableRows += `
        <tr scope="row">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
				</tr>`;
        }
        if (tableRows) {
          table.find("tbody").html(tableRows);
        }
      })
      .catch(xhr => {Http.handleError(xhr); reject(xhr)});
  });
};

HistoryComponent.prototype.onUnbind = function() {
  this.component.find("table body").html("");
};

/**
*  HistoryService
*
*/
function HistoryService(options) {
  const opts = options || {};
  this.api_root = opts.api_root || window.context.getAPIRoot();
}

HistoryService.prototype.constructor = HistoryService;

/**
* get all history data
*/
HistoryService.prototype.getHistory = function() {
  return new Promise((resolve, reject) => {
    //TODO
    resolve({});
    // Http.get(`${this.api_root}/history`)
    //   .done(data => resolve(data))
    //   .fail(xhr => reject(xhr));
  });
};

module.exports = HistoryComponent;
