const form = document.querySelector('.con-main');
const error = document.querySelector('.error');

const getFormElements = () => {
  const element = form.elements;
  const email = element['email'].value;
  const password = element['password'].value;
  if (!email || !password) {
    return (error.textContent = 'Please fill all fields');
  }

  return { email, password };
};

const login = async (data) => {
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.redirected) {
      window.location = res.url;
      return;
    }
    const user = await res.json();
    if (user.status === 'error' || user.status === 'fail') {
      throw new Error(user.message);
    }
  } catch (err) {
    console.log(error);
    error.textContent = err.message;
  }
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = getFormElements();
  await login(data);
});
