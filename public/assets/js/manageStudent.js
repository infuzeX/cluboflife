const manageStudentButton = document.querySelector('.addModalButton');
const closeButton = document.querySelectorAll('.close');
const addStudentModal = document.querySelector('.addModal');
const editStudentModal = document.querySelector('.editModal');
const editStudentButton = document.querySelector('.editModalButton');
const date = document.querySelectorAll('.date');

function toggleModal(el) {
  console.log(el);
  el.classList.toggle('openModal');
  date.forEach((input) => (input.type = 'text'));
}

manageStudentButton.addEventListener('click', () =>
  toggleModal(addStudentModal)
);

closeButton[0].addEventListener('click', () => toggleModal(addStudentModal));
closeButton[1].addEventListener('click', () => toggleModal(editStudentModal));

editStudentButton.addEventListener('click', () =>
  toggleModal(editStudentModal)
);
