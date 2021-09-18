function tempAlert(msg, duration, err = false) {
  const color = !err ? '#04AA6D' : '#dc3545';
  const alert = document.querySelector('.custom-alert');
  if (alert) {
    alert.style.display = 'none';
  }
  var el = document.createElement('div');
  el.classList.add('custom-alert');
  el.setAttribute(
    'style',
    `position:fixed;bottom:6%;right:6%;background-color:${color};color:white;z-index:10000000;padding:10px;font-family:inherit;border-radius:7px;display:block;`
  );
  // const p = document.createElement('p');
  el.innerText = msg;
  // el.append(p);
  setTimeout(function () {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}
