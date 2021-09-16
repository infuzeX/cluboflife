(() => {
  __GLOBAL_PURCHASE = {
    courses: [],
    users: [],
    purchases: [],
  };

  const addSubscriptionForm = document.querySelector('.addStudent');
  const editStudentModal = document.querySelector('.editModal');
  const userDropdown = document.querySelectorAll('.userDropdown');
  const coursDropdown = document.querySelectorAll('.courseDropdown');
  const userInput = document.querySelector('.userAdd');
  const courseInput = document.querySelector('.courseAdd');
  const boughtInput = document.querySelector('.boughtAtAdd');
  const expiresInput = document.querySelector('.expireAtAdd');
  const user = document.querySelector('#userList');

  const pushToDropdown = (arr, dropdown) => {
    if (!arr || !arr.length) return;
    arr.forEach((item) => {
      const option = document.createElement('option');
      option.setAttribute('data-id', item._id);
      option.textContent = item.name;
      option.value = item.name;
      option.label = item.name;
      option.setAttribute('id', item.name);
      dropdown.forEach((menu) => menu.append(option));
    });
  };

  const fetchSubscription = async () => {};

  const getUsers = async () => {
    try {
      const res = await fetch('/api/v1/users');
      const user = await res.json();
      if (user.status === 'error' || user.status === 'fail') {
        throw new Error(user.message);
      }
      console.log(user?.data?.students);
      pushToDropdown(user?.data?.students, userDropdown);
      __GLOBAL_PURCHASE.users = [...user?.data?.students];
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  };

  const getCourses = async () => {
    try {
      const res = await fetch('/api/v1/courses');
      const course = await res.json();
      if (course.status === 'error' || course.status === 'fail') {
        throw new Error(course.message);
      }
      pushToDropdown(course?.data?.courses, coursDropdown);
      __GLOBAL_PURCHASE.courses = [...course?.data?.courses];
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  };

  getUsers();
  getCourses();

  addSubscriptionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = userInput?.dataset?.id;
    const courseId = courseInput?.dataset?.id;
    const boughtAt = boughtInput?.value;
    const expiresAt = expiresInput?.value;
    console.log(user.options.namedItem('name-list'));
    console.log(
      user.options.namedItem(document.querySelector('#nameList').value)
    );
  });
})();
