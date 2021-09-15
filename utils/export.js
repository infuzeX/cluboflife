function exportSheet(students) {
  console.log(students);
  const Excel = require('exceljs');
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('students');

  worksheet.columns = [
    { header: 'Index', key: 'Index', width: 10 },
    { header: 'Name', key: 'name', width: 15 },
    { header: 'Email', key: 'email', width: 30 },
    // { header: 'Username', key: 'username', width: 12 },
    { header: 'Joined', key: 'createdAt', width: 15 },
    // { header: 'Subscription', key: 'subscription', width: 15 },
  ];

  students.forEach((student, index) => {
    student.Index = index + 1;
    worksheet.addRow(student);
  });

  //set hedin to bold
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  return workbook.xlsx;
}

module.exports = exportSheet;
