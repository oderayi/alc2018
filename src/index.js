/**
 * index.js
 * 
 * Bootstraps the app.
 *  
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import App from "./app/app";

window.addEventListener("load", () => {
  var app = new App();
  window.context = app;
  app.init();
});
