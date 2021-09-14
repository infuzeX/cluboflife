const manageStudentButton = document.querySelector('.manageStudentModal');
const closeButton = document.querySelectorAll('.close');
const addStudentModal = document.querySelector('.addStudent');
const editStudentModal = document.querySelector('.editStudent');
const editStudentButton = document.querySelector('.edit');

function toggleModal(el) {
  console.log(el);
  el.classList.toggle('openModal');
}

manageStudentButton.addEventListener('click', () =>
  toggleModal(addStudentModal)
);

closeButton[0].addEventListener('click', () => toggleModal(addStudentModal));
closeButton[1].addEventListener('click', () => toggleModal(editStudentModal));

editStudentButton.addEventListener('click', () =>
  toggleModal(editStudentModal)
);
