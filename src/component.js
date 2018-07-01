/**
 * Component.js
 * 
 * Base Component for all other components.
 * Implements component life-cycle, templating etc 
 * like in other modern JS frameworks 
 * like React and Vue albeit weaker though.
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */ 
function Component() {}

Component.prototype.constructor = Component;
Component.prototype.api_root = null;
Component.prototype.component = null;
Component.prototype.renderContainer = null;
Component.prototype.service = null;
Component.prototype.widgets = {};
Component.prototype.currentScreen = null;
Component.prototype.state = {};

Component.prototype.init = function(props) {
  props = props || {};
  this.api_root = props.api_root || window.context.getAPIRoot();
  
  if (typeof this.getTemplate == "function") {
    this.component = $(this.getTemplate());
  } 
  this.service = props.service || null;
  this.initWidgets();
  this.bind();
  this.reset();
  return this;
};

Component.prototype.initWidgets = function() {
  const widgets = this.component.find(":input");
  for (let i = 0; i < widgets.length; i++) {
    let w = $(widgets[i]);
    if (w.attr("id")) {
      this.widgets[w.attr("id")] = w;
    } else if (w.attr("name")) {
      this.widgets[w.attr("name")] = w;
    }
  }
};

Component.prototype.initState = function(_state) {
  Object.assign(this.state, _state);
};

Component.prototype.setState = function(new_state) {
  Object.assign(this.state, new_state);
  this.onStateChanged();
};

Component.prototype.onStateChanged = function() {
  this.refreshView();
};

Component.prototype.refreshView = function() {
  this.unbind();
  this.component = $(this.getTemplate());
  this.render(this.renderContainer);
  this.initWidgets();
  this.bind();
};

Component.getFullScreenTemplate = function() {
  return `
     <div class="container full-screen component" id="full_screen" style="display: none">
        <div class="nav navbar-nav navbar-left pull-left animated">
            <label class="back scroll-animated" data-animation="slideInRight">
                <i class="mdi mdi-arrow-back"></i>
            </label>
        </div>
        <div class="nav navbar-nav navbar-right pull-right animated">
            <label class="close-full-screen">
                <span class="menu-bar"></span>
                <span class="menu-bar"></span>
            </label>
        </div>
        <div class="full-screen-content col-lg-6 col-sm-10"></div>
    </div>
 `;
};

Component.prototype.showAsFullScreen = function() {
  this.showFullScreen(this);
};

Component.prototype.showFullScreen = function(component) {
  var self = this;

  this.currentScreen = component;
  let fscreen = $("body .component.full-screen").first();
  if (!fscreen.length) fscreen = $(Component.getFullScreenTemplate());
  fscreen.find(".full-screen-content").html(component.component);

  /* back */
  const back = fscreen.find(".back");
  back.click(e => {
    this.closeFullScreen();
  });

  /* close sidebar if fullscreen is directly clicked */
  fscreen.click(e => {
    // if user directly clicks on me (fscreen)
    if (e.target == e.currentTarget) {
      this.closeFullScreen();
    }
  });

  /* attach to window / document */
  $("body").append(fscreen);

  /* show */
  fscreen
    .show()
    .addClass("show")
    .addClass("current");

  $("body").css("overflow-y", "hidden");

  if ("function" == typeof component.onRender) {
    component.onRender();
  }
  /**
   * Initialize material design for new view
   */
  $.material.init();

  /* capture 'esc' button to close full screen */
  $(document).keyup(e => {
    if (e.keyCode == 27) {
      this.closeFullScreen();
    }
  });
};

Component.prototype.closeFullScreen = function() {
  $("body").css("overflow-y", "auto");
  const fscreen = $(".full-screen.current, .full-screen.show");

  fscreen
    .hide()
    .removeClass("current")
    .removeClass("show");
  if (null != self.currentScreen) {
    self.currentScreen.unload();
  }

  $(document).unbind("keyup");
  // remove hash
  history.pushState("", document.title, window.location.pathname + window.location.search);
};

Component.prototype.setTemplate = function(template) {
  this.template = template;
};

Component.prototype.bind = function() {
  this.unbind();
  if (typeof this.onBind == "function") {
    this.onBind();
  }
};

Component.prototype.unbind = function() {
  if (typeof this.onUnbind == "function") {
    this.onUnbind();
  }
};

Component.prototype.reset = function() {
  if (typeof this.onReset == "function") {
    this.onReset();
  }
};

Component.prototype.render = function(container) {
  if (!container) {
    this.showAsFullScreen();
  } else {
    this.renderContainer = container;
    container.html(this.component);
  }

  if (typeof this.onRender == "function") {
    this.onRender();
  }
};

Component.prototype.close = function() {
  if (typeof this.onClose == "function") {
    this.onClose();
  }
  
  this.component.hide();
  if(!this.renderContainer){
   this.closeFullScreen(); 
  }
  return this;
};

Component.prototype.unload = function() {
  this.close();
  if (typeof this.onUnload == "function") {
    this.onUnload();
  }
  this.unbind();
  this.component = null;
};

module.exports = Component;
