(() => {
  const __GLOBAL_STUDENTS = {
    students: [],
    student: {},
    filter: [],
  };

  const manageStudentButton = document.querySelector('.addModalButton');
  const closeButton = document.querySelectorAll('.close');
  const addStudentForm = document.querySelector('.addStudent');
  const addStudentModal = document.querySelector('.addModal');
  const editStudentModal = document.querySelector('.editModal');
  // const editStudentButton = document.querySelector('.editModalButton');
  const date = document.querySelectorAll('.date');
  const template = document.querySelector('template');
  const studentDetail = document.querySelector('.studentDetail');
  const error = document.querySelectorAll('.error');
  const name = document.querySelector('.name');
  const email = document.querySelector('.email');
  const createdAt = document.querySelector('.createdAt');
  const editForm = document.querySelector('.editForm');
  const exportCSV = document.querySelector('.export');
  const downloadCSV = document.querySelector('.download');

  console.log(name, email, createdAt);

  function toggleModal(el) {
    console.log(el);
    error.forEach((err) => (err.textContent = ''));
    el.classList.toggle('openModal');
    date.forEach((input) => (input.type = 'text'));
  }

  manageStudentButton.addEventListener('click', () =>
    toggleModal(addStudentModal)
  );

  closeButton[0].addEventListener('click', () => toggleModal(addStudentModal));
  closeButton[1].addEventListener('click', () => toggleModal(editStudentModal));

  // editStudentButton.addEventListener('click', () =>
  //   toggleModal(editStudentModal)
  // );

  const createUserNode = (user, index) => {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.index').textContent = index + 1;
    clone.querySelector('.name').textContent = user?.name;
    clone.querySelector('.email').textContent = user?.email;
    clone.querySelector('.joined').textContent = user?.createdAt
      ? user?.createdAt?.split('T')[0]
      : '';

    clone.querySelector('.editModalButton').addEventListener('click', () => {
      __GLOBAL_STUDENTS.student = { ...user };
      editStudent();
    });

    clone
      .querySelector('.delete')
      .addEventListener('click', () => deleteStudent(user._id));

    clone
      .querySelector('.copy')
      .addEventListener('click', () => copyToClipboard(user?.email));
    studentDetail.append(clone);
  };

  const showUsers = (users) => {
    if (!users || !users.length) return;

    users.forEach((user, idx) => createUserNode(user, idx));
  };

  const updateUI = () => {
    studentDetail.innerHTML = '';
    showUsers(__GLOBAL_STUDENTS.students);
  };

  async function editStudent() {
    const student = __GLOBAL_STUDENTS.student;
    if (!student || !Object.entries(student).length) return;
    name.value = student?.name;
    email.value = student?.email;
    createdAt.value = student?.createdAt
      ? student.createdAt?.split('T')[0]
      : '';
    toggleModal(editStudentModal);
  }

  async function deleteStudent(id) {
    try {
      const res = await fetch(`/api/v1/users/${id}`, { method: 'DELETE' });
      const user = await res.json();
      if (user.status === 'error' || user.status === 'fail') {
        throw new Error(user.message);
      }
      const students = __GLOBAL_STUDENTS.students.filter(
        (student) => student._id !== id
      );
      __GLOBAL_STUDENTS.students = [...students];
      updateUI();
      // exportUser();
      tempAlert('Deleted Successfully', 3000);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/v1/users?role=student');
      const users = await res.json();
      console.log(users);

      if (users.status === 'error' || users.status === 'fail') {
        throw new Error(users.message);
      }
      __GLOBAL_STUDENTS.students = [...users.data.students];
      showUsers(users.data.students);
    } catch (error) {
      console.log(error);
    }
  };
  fetchUser();

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
      __GLOBAL_STUDENTS.students = [
        user.data.user,
        ...__GLOBAL_STUDENTS.students,
      ];
      updateUI();
      toggleModal(addStudentModal);
      // exportUser();
      tempAlert('Added Successfully', 3000);
    } catch (err) {
      console.log(err);
      error[0].textContent = err.message;
    }
  };

  addStudentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const element = addStudentForm.elements;
    const name = element['name'].value;
    const email = element['email'].value;
    const password = element['password'].value;
    const createdAt = element['createdAt'].value;

    if (!name || !email || !password || !createdAt) {
      return (error[0].textContent = 'Please Fill all fields');
    }

    await signup({ name, email, password, createdAt });
  });

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const student = __GLOBAL_STUDENTS.student;
    const element = editForm.elements;
    const name = element['name'].value;
    const email = element['email'].value;
    const createdAt = element['createdAt'].value;
    if (!name || !email || !createdAt) {
      console.log(name, email, createdAt);
      return (error[1].textContent = 'Please Fill all fields');
    }
    try {
      const res = await fetch(`/api/v1/users/${student._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, createdAt }),
      });
      const user = await res.json();
      if (user.status === 'error' || user.status === 'fail') {
        throw new Error(user.message);
      }
      studentDetail.innerHTML = '';

      await fetchUser();
      toggleModal(editStudentModal);
      // exportUser();
      tempAlert('Edited Successfully', 3000);
    } catch (err) {
      return (error[1].textContent = err.message);
    }
  });

  exportCSV.addEventListener('click', () => exportUser());
  function exportUser() {
    fetch('/api/v1/users/export/?role=student')
      .then((res) => res)
      .then(async (res) => {
        res.blob().then((blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          downloadCSV.href = downloadUrl;
          downloadCSV.setAttribute('download', 'user.xlsx');
          downloadCSV.click();
        });
      })
      .catch((e) => console.log(e));
  }

  // exportUser();

  document.querySelector('.search').addEventListener('keyup', () => {
    console.log('hi');
    const searchText = document.querySelector('.search').value.toUpperCase();
    const students = __GLOBAL_STUDENTS.students;
    if (!searchText) return updateUI();
    const filteredStudent = students.filter(
      (student) =>
        student.name.toUpperCase().indexOf(searchText) > -1 ||
        student.email.toUpperCase().indexOf(searchText) > -1
    );
    studentDetail.innerHTML = '';
    console.log(filteredStudent, searchText);
    showUsers(filteredStudent);
  });

  function copyToClipboard(data) {
    navigator.clipboard.writeText(data);
    tempAlert('Copied to clipboard', 5000);
  }
})();
