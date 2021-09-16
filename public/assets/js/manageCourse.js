// global store for courses,edit course
(() => {
  const _GLOBAL_NAMESPACE = {
    courses: [],
    course: {},
  };

  const template = document.querySelector('template');
  const courseContainer = document.querySelector('.course-parent-flex');
  const addSection = document.querySelector('.new-coures');
  const name = document.querySelector('.course');
  const description = document.querySelector('.subtitle');
  const createdAt = document.querySelector('.createdAt');
  const instructor = document.querySelector('.instructor');
  const courseCode = document.querySelector('.code');
  const courseLink = document.querySelector('.link');
  const title = document.querySelector('.title');
  const publish = document.querySelector('#publish');
  console.log(publish);

  // Add/Edit course toggle
  function add() {
    console.log('hhhh');
    addSection.classList.remove('none');
  }
  function rem() {
    _GLOBAL_NAMESPACE.course = {};
    clearInput();
    addSection.classList.add('none');
  }

  document.querySelector('.cour').addEventListener('click', () => add());
  document.querySelector('.cross').addEventListener('click', () => rem());

  // append new div
  const createCourseNode = (course) => {
    const clone = template.content.cloneNode(true);
    const data = course.name + course._id;
    clone.querySelector('.course-child-parent').setAttribute('id', data);
    clone.querySelector('h3').textContent = course?.name;
    clone.querySelector('.author').textContent = course?.instructor;
    clone.querySelector('.status').textContent = course?.publish
      ? 'Published'
      : 'Not Published';
    const more = clone.querySelector('.moremenu');
    const smallMenu = clone.querySelector('.small-menu');
    const deleteButton = clone.querySelector('.delete');
    const editButton = clone.querySelector('.edit');

    deleteButton.setAttribute('data-id', course._id);

    editButton.addEventListener('click', () => {
      smallMenu.classList.toggle('none');
      _GLOBAL_NAMESPACE.course = { ...course };
      editModal();
    });
    deleteButton.addEventListener('click', function () {
      deleteCourse(course._id, data);
    });
    more.addEventListener('click', () => smallMenu.classList.toggle('none'));
    courseContainer.appendChild(clone);
  };

  // create node to array of course
  const showCourses = (courses) => {
    console.log(courses);
    if (!courses || !courses.length) return;
    courses.forEach((course) => {
      createCourseNode(course);
    });
  };

  // update ui while deleting course
  const updateUI = () => {
    document.querySelector('.course-parent-flex').innerHTML = '';
    showCourses(_GLOBAL_NAMESPACE.courses);
  };

  async function deleteCourse(id) {
    console.log(id);
    try {
      const res = await fetch(`/api/v1/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'error' || data.status === 'fail') {
        throw new Error(data.message);
      }
      const courses = _GLOBAL_NAMESPACE.courses.filter(
        (course) => course._id !== id
      );
      _GLOBAL_NAMESPACE.courses = [...courses];
      updateUI();
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

  const fetchCourse = async () => {
    try {
      const res = await fetch('/api/v1/courses', { method: 'GET' });
      const courses = await res.json();
      if (courses.status === 'error' || courses.status === 'fail') {
        throw new Error(newCourse.message);
      }
      console.log(courses);
      _GLOBAL_NAMESPACE.courses = courses?.data?.courses;
      return showCourses(_GLOBAL_NAMESPACE.courses);
    } catch (error) {
      console.log(error);
      tempAlert(
        error?.message || 'Something went wrong.Please try again',
        5000,
        true
      );
    }
  };

  fetchCourse();

  const form = document.querySelector('.field-div');
  const error = document.querySelector('.error');

  const printErrorMessage = (e) => (error.textContent = e);
  const addCourse = async (data) => {
    try {
      const res = await fetch('/api/v1/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(data),
      });
      const newCourse = await res.json();
      printErrorMessage('');
      if (newCourse.status === 'error' || newCourse.status === 'fail') {
        throw new Error(newCourse.message);
      }
      _GLOBAL_NAMESPACE.courses = [
        ..._GLOBAL_NAMESPACE.courses,
        newCourse?.data?.course,
      ];
      createCourseNode(newCourse?.data?.course);
      rem();
      tempAlert('Added Course', 3000);
    } catch (error) {
      console.log(error.message);
      printErrorMessage(error.message);
    }
  };

  const editCourse = async (data) => {
    try {
      const res = await fetch(
        `/api/v1/courses/${_GLOBAL_NAMESPACE.course._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      const newCourse = await res.json();
      console.log(newCourse);
      printErrorMessage('');
      if (newCourse.status === 'error' || newCourse.status === 'fail') {
        throw new Error(newCourse.message);
      }
      document.querySelector('.course-parent-flex').innerHTML = '';
      await fetchCourse();
      rem();
      tempAlert('Edited Successfully', 5000);
    } catch (error) {
      console.log(error.message);
      printErrorMessage(error.message);
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const element = form.elements;
    const name = element['course'].value;
    const description = element['subtitle'].value;
    const createdAt = element['createdAt'].value;
    const instructor = element['instructor'].value;
    const courseCode = element['code'].value;
    const courseLink = element['link'].value;
    const publish = element['publish'].checked;
    console.log(publish);
    const data = {
      name,
      description,
      createdAt,
      instructor,
      courseCode,
      courseLink,
      publish,
    };
    if (
      !name ||
      !description ||
      !createdAt ||
      !instructor ||
      !courseCode ||
      !courseLink
    ) {
      error.textContent = 'Please fill all fields';
      return;
    }

    if (_GLOBAL_NAMESPACE.course?.name) {
      editCourse(data);
      return;
    }

    addCourse(data);
  });

  function clearInput() {
    name.value = '';
    description.value = '';
    createdAt.value = '';
    instructor.value = '';
    courseCode.value = '';
    courseLink.value = '';
    title.innerHTML = 'Add Course';
  }

  function editModal() {
    const course = _GLOBAL_NAMESPACE.course;

    name.value = course?.name;
    description.value = course?.description;
    createdAt.value = course?.createdAt && course?.createdAt.split('T')[0];
    instructor.value = course?.instructor;
    courseCode.value = course?.courseCode;
    courseLink.value = course?.courseLink;
    title.innerHTML = 'Edit Course';
    publish.checked = course?.publish;
    add();
  }
})();
