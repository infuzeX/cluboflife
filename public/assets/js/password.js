const passwordIcons = document.querySelectorAll('.password-icon');

function togglePassword(passwordIcon) {
  const input = passwordIcon?.previousElementSibling;
  if (!input) return;
  if (input.type === 'password') {
    passwordIcon.classList.remove('fa-eye-slash');
    passwordIcon.classList.add('fa-eye');
    input.type = 'text';
  } else {
    passwordIcon.classList.remove('fa-eye');
    passwordIcon.classList.add('fa-eye-slash');
    input.type = 'password';
  }
}

passwordIcons.forEach((item) => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    togglePassword(item);
  });
});
