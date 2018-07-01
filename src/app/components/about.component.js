/**
 * about.component.js
 * 
 * Displays app info
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import Component from '../../component';

function AboutComponent() {
  Component.call();
}

AboutComponent.prototype = Object.create(Component.prototype);

AboutComponent.prototype.constructor = AboutComponent;

AboutComponent.prototype.init = function (props) {
  props = props || {};
  props.root = props.root || ".component#about";
  props.service = props.service || {};
  Component.prototype.init.call(this, props);
  return this;
};

AboutComponent.prototype.getTemplate = function () {
  return `
    <section class="component" id="about">
      <h1 class="form-title scroll-animated delay-8" data-animation="flip">About</h1>
      <p>Author: <strong>Steven Oderayi &lt;oderay@gmail.com&gt;</strong></p>
      <p>This is my <strong><em>ALC with Google and Udacity Scholarship 2018 Project</em></strong>. </p>
      <p>Use with caution, it's not a to be relied on. 
      Use a more stable and well-proven currency converter systems online instead.</p>
    </section>
  `;
}

module.exports = AboutComponent;


