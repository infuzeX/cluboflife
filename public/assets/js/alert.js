function tempAlert(msg, duration, err = false) {
  const color = !err ? '#04AA6D' : '#dc3545';
  var el = document.createElement('div');
  el.setAttribute(
    'style',
    `position:absolute;top:6%;right:5%;background-color:${color};color:white;z-index:10000000;padding:10px;font-family:inherit;border-radius:7px;`
  );
  el.innerHTML = msg;
  setTimeout(function () {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}
