(() => {
  const __GLOBAL_STUDENTS = {
    students: [],
    student: {},
    filter: [],
    changePasswordId: '',
  };
  const addStudentForm = document.querySelector('.addStudent');
  const addStudentModal = document.querySelector('.addModal');
  const editStudentModal = document.querySelector('.editModal');
  const template = document.querySelector('template');
  const studentDetail = document.querySelector('.studentDetail');
  const error = document.querySelectorAll('.error');
  const name = document.querySelector('.name');
  const email = document.querySelector('.email');
  const createdAt = document.querySelector('.createdAt');
  const editForm = document.querySelector('.editForm');
  const exportCSV = document.querySelector('.export');
  const downloadCSV = document.querySelector('.download');
  const copyModal = document.querySelector('.copyModal');
  const copyData = document.querySelector('.copy-data');
  const editPasswordModal = document.querySelector('.editPasswordModal');
  const editPasswordForm = document.querySelector('.editPasswordForm');
  const autoGen = document.querySelector('.autoGen');
  const populatePassword = document.querySelector('.inputLabel');

  console.log(name, email, createdAt);

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

    clone.querySelector('.editPassword').addEventListener('click', () => {
      document.querySelector('.editPasswordEmail').value = user?.email;
      __GLOBAL_STUDENTS.changePasswordId = user?._id;
      toggleModal(editPasswordModal);
    });
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

  function generatePassword() {
    let length = 8,
      charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
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
      tempAlert(
        error?.message || 'Something went wrong.Please try again',
        5000,
        true
      );
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
      tempAlert(
        error?.message || 'Something went wrong.Please try again',
        5000,
        true
      );
    }
  };
  fetchUser();

  const signup = async (data) => {
    const res = await fetch('/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(res);
    const user = await res.json();
    console.log(user.status);
    if (["error", "fail"].includes(user.status)) {
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
    /*} catch (err) {
      console.log(err);
      error[0].textContent = err.message;
    }*/
  };

  addStudentForm.addEventListener('submit', async (e) => {
    try {
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
        /*clear value*/
        element['name'].value = "";
        element['email'].value = "";
        element['password'].value = "";
        element['createdAt'].value = "";
        /*clear value*/
      toggleCopy({ name, email, password, joined: createdAt });
    } catch (err) {
      tempAlert(err?.message || "Something went wrong!", 3000, true);
    }
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
        if (res.status === 500 || res.status === 404) {
          return tempAlert('No data found', 3000, true);
        }
        res.blob().then((blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          downloadCSV.href = downloadUrl;
          downloadCSV.setAttribute('download', 'user.xlsx');
          downloadCSV.click();
        });
      })
      .catch((e) => {
        tempAlert(e?.message || 'Something went wrong', 5000, true);
      });
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
    tempAlert('Copied to clipboard', 1000);
  }

  function toggleCopy(data) {
    copyData.innerHTML = ""
    if (!data || !data?.email) return;
    Object.entries(data).map(([key, value]) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${key}</span>-${value}`;
      copyData.append(li);
    });
    toggleModal(copyModal);
  }

  document.querySelector('.btn-copy')?.addEventListener('click', () => {
    const li = copyData.querySelectorAll('li');
    console.log(li, li?.length);
    if (!li || !li?.length) {
      return tempAlert('No data to copy', 2000, true);
    }
    let data = '';
    li.forEach((item) => (data += `${item.textContent},${' '}`));
    window.navigator.clipboard.writeText(data);
    tempAlert('Copied', 2000);
  });

  document
    .querySelector('.btn-close')
    .addEventListener('click', () => toggleModal(copyModal));

  editPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = editPasswordForm.elements['password'].value;
    if (!password) return tempAlert('Password is required', 4000, true);
    try {
      const res = await fetch(
        `/api/v1/auth/editPassword/${__GLOBAL_STUDENTS.changePasswordId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      tempAlert('Password Edited', 3000);
      toggleModal(editPasswordModal);
      toggleCopy({
        email: data?.user?.email,
        name: data?.user?.name,
        joined: data?.user?.createdAt && data?.user?.createdAt?.split('T')[0],
        password,
      });
    } catch (error) {
      return tempAlert(error?.message, 3000, true);
    }
  });

  autoGen.addEventListener('click', () => {
    populatePassword.value = generatePassword();
  });
})();
