/**
 * home.component.js
 * 
 * The landing component
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */

import Component from '../../component';
import Http from '../../http';
import Utils from '../../utils';
import ConverterService from '../services/converter.service';

function HomeComponent() {
    Component.call();
}

HomeComponent.prototype = Object.create(Component.prototype);
HomeComponent.prototype.constructor = HomeComponent;

HomeComponent.prototype.init = function (props) {
    props = props || {};
    props.root = props.root || ".component#home";
    Component.prototype.init.call(this, props);
    return this;
};

HomeComponent.prototype.getTemplate = function () {
    return `
  <section class="home component" id="home">
  <main class="page-content-wrap">
    <section class="grey-bg text-center" id="inline_converter">
      <div class="container py-4">
        <h2 class="scroll-animated" data-animation="slideInUp">Currency Converter</h2>
        <p class="muted scroll-animated delay-1" data-animation="slideInUp">A simple currency converter supporting offline conversion and history.</p>
        <form class="form-horizontal scroll-animated delay-2" data-animation="fadeIn">
          <div class="form-group">
            <div class="col-md-12">
              <div class="row" style="width:80%; margin-left: auto; margin-right: auto;">
                <label class="control-label col-md-3" for="from_amount">FROM</label>
                <div class="col-md-3">
                  <input class="form-control" type="number" step="any" min="0" name="from_amount" placeholder="Amount to convert from" value="0.00">
                </div>
                <div class="col-md-6">
                  <select class="form-control select required" name="from_currency">
                    <option value="">Loading...</option>
                  </select>
                </div>
                <label class="control-label col-md-3" for="to_amount">TO</label>
                <div class="col-md-3">
                  <input class="form-control" type="number" step="any" min="0" name="to_amount" placeholder="Amount to convert to" value="0.00">
                </div>
                <div class="col-md-6">
                    <select class="form-control select required" name="to_currency">
                        <option value="">Loading...</option>
                    </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
    <!-- How To Use-->
    <section class="blue-green-grad text-center bt-1" id="how_to_use">
      <div class="container py-4">
        <h2 class="scroll-animated" data-animation="slideInUp">How To Use</h2>
        <div class="container mt-3">
          <div class="row">
            <div class="col-md-4 scroll-animated delay-3" data-animation="zoomIn">
              <h5>1. Choose Currencies</h5>
              <p>Select "FROM" and "TO" currencies.</p>
            </div>
            <div class="col-md-4 scroll-animated delay-2" data-animation="zoomIn">
              <h5 data-animation="zoomIn">2. Enter amount</h5>
              <p>Enter the amount you would like to convert..</p>
            </div>
            <div class="col-md-4 scroll-animated" data-animation="zoomIn">
              <h5>3. See result</h5>
              <p>Converted figure displays in bold.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</section>
  `;
};

HomeComponent.prototype.onBind = function () {
    this.initWidgets();
    this.initAnimations();
    this.initCurrencyConverter();
    return this;
};

HomeComponent.prototype.initAnimations = function () {
    var self = this;

    /* Animate on scroll */
    var lastScrollTop = $(document).scrollTop();

    $(document).scroll(function (event) {
        checkAnimation();
        const st = $(document).scrollTop();

        if (st > lastScrollTop) {
            /* scroll down */
            window.context.navbar.unfixTopBar(st);
        } else {
            /* scroll up */
            window.context.navbar.fixTopBar(st);
        }
        lastScrollTop = st;
    });

    if (window.addEventListener) {
        window.addEventListener("DOMMouseScroll", wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;

    const $scrollAnimateds = self.component.find(".scroll-animated");

    /* Check if it's time to start the animation. */
    function checkAnimation() {
        $scrollAnimateds.each(function () {
            const anim = $(this).data("animation");
            const cls = `start animated ${anim}`;
            if (Utils.isElementInViewport($(this))) {
                if (!$(this).hasClass(cls)) {
                    $(this).addClass(cls);
                }
            } else if ($(this).hasClass(cls)) {
                $(this).removeClass(cls);
            }
        });
    }

    function wheel(event) {
        let delta = 0;
        if (event.wheelDelta) delta = event.wheelDelta / 120;
        else if (event.detail) delta = -event.detail / 3;

        handle(delta);
        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
    }

    let goUp = true;
    let end = null;
    let interval = null;

    function handle(delta) {
        const animationInterval = 20; /* lower is faster */
        const scrollSpeed = 20; /* lower is faster */

        if (end == null) {
            end = $(window).scrollTop();
        }
        end -= 20 * delta;
        goUp = delta > 0;

        if (interval == null) {
            interval = setInterval(() => {
                const scrollTop = $(window).scrollTop();
                const step = Math.round((end - scrollTop) / scrollSpeed);
                if (
                    scrollTop <= 0 ||
                    scrollTop >= $(window).prop("scrollHeight") - $(window).height() ||
                    (goUp && step > -1) ||
                    (!goUp && step < 1)
                ) {
                    clearInterval(interval);
                    interval = null;
                    end = null;
                }
                $(window).scrollTop(scrollTop + step);
            }, animationInterval);
        }
    }
}

HomeComponent.prototype.initCurrencyConverter = function () {
    this.initCurrencies();

    const self = this;
    const selectFromCurrency = this.widgets.from_currency;
    const selectToCurrency = this.widgets.to_currency;
    const inputFromAmount = this.widgets.from_amount;
    const inputToAmount = this.widgets.to_amount;

    const inputChangeListener = function (e) {
        /**
         * If same currencies are selected for both "from" and "to" currencies,
         * interchange currencies and avoid it.
         */
        if(selectFromCurrency.val() == selectToCurrency.val()){
            // TODO
        }

        let from_currency = selectFromCurrency.val();
        let from_amount = inputFromAmount.val();
        let to_currency = selectToCurrency.val();
        const to_amount = inputToAmount.val();

        /**
         *  enable cyclic conversion i.e if from_currency is changed, use that as the "FROM" currency
         *  but if to_currency currency changes, use that as the "FRON" currency and from_currency as the to_currency
         *  for smoother user experience
         */
        if(e.target.name == 'to_currency'){
            // const temp = to_currency;
            // from_amount = to_amount
            // from_currency = temp;
            // to_currency = from_currency;
        }
        
        if (from_currency && to_currency) {
            new ConverterService()
                .getConversion({from_currency, to_currency, from_amount})
                .then(response =>
                    self.displayResult(response)
                )
                .catch(xhr => Http.handleError(xhr));
        }
    };
    selectFromCurrency.change(inputChangeListener);
    inputFromAmount.change(inputChangeListener);
    selectToCurrency.change(inputChangeListener);
    inputToAmount.change(inputChangeListener);
    selectFromCurrency.trigger("change");
};

HomeComponent.prototype.displayResult = function(data){
    this.widgets.from_currency.val(data.from_currency);
    this.widgets.from_amount.val(data.from_amount);
    this.widgets.to_currency.val(data.to_currency);
    this.widgets.to_amount.val(data.to_amount);
}

HomeComponent.prototype.initCurrencies = function(){
    new ConverterService()
    .getCurrencies()
    .then(currencies => {
        this.widgets.to_currency.empty();
        this.widgets.from_currency.empty();
        let options = [];
        options.push("<option></option>");
        for (let currency in currencies) {
            options.push(
                `<option value = "${currencies[currency].id}"> ${currencies[currency].currencyName}</option>`
            );
        }
        this.widgets.from_currency
            .append(options)
            .val('USD');
        this.widgets.to_currency
            .append(options)
            .val('NGN')
            .trigger("change");
        
    })
    .catch(xhr => {
        Http.handleError(xhr);
        this.widgets.from_currency.append(
            '<option value = "">' +
            "Error loading currencies. Please try again" +
            "</option>"
        );
        this.widgets.to_currency.append(
            '<option value = "">' +
            "Error loading currencies. Please try again" +
            "</option>"
        );
    });
}

HomeComponent.prototype.onUnbind = function () {
    this.widgets.from_currency.unbind("change");
    this.widgets.to_currency.unbind("change");
    this.widgets.from_amount.unbind("change");
    this.widgets.to_amount.unbind('change');
};

module.exports = HomeComponent;
