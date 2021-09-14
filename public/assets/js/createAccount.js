const form = document.querySelector('.con-main');
const error = document.querySelector('.error');

const signup = async (data) => {
  try {
    const res = await fetch('/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(res);
    const user = await res.json();
    console.log(user);
    if (user.status === 'error' || user.status === 'fail') {
      throw new Error(user.message);
    }
    window.location.href = '/login';
  } catch (err) {
    console.log(err);
    error.textContent = err.message;
  }
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const element = form.elements;
  const name = element['name'].value;
  const email = element['email'].value;
  const password = element['password'].value;
  const confirmPassword = element['confirmPassword'].value;

  if (!name || !email || !password || !confirmPassword) {
    return (error.textContent = 'Please fill all fields');
  }
  if (password !== confirmPassword) {
    console.log(true);
    return (error.textContent = 'Passwords does not match');
  }

  const data = { name, email, password };
  await signup(data);
});
