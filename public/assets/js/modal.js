const manageStudentButton = document.querySelector('.addModalButton');
const editStudentModal = document.querySelector('.editModal');

const closeButton = document.querySelectorAll('.close');
const addStudentModal = document.querySelector('.addModal');
const error = document.querySelectorAll('.error');

const toggleModal = (el, cb) => {
  error.forEach((err) => (err.textContent = ''));
  el.classList.toggle('openModal');
};

manageStudentButton.addEventListener('click', () =>
  toggleModal(addStudentModal)
);
closeButton[0].addEventListener('click', () => toggleModal(addStudentModal));
closeButton[1]?.addEventListener('click', () => toggleModal(editStudentModal));
