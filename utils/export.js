function exportSheet(students, column) {
  const Excel = require('exceljs');
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('students');
  
  worksheet.columns = column;

  students.forEach((student, index) => {
    const data = { ...student };
    data.Index = index + 1;
    if (student?.user) data.user = student.user?.email;
    if (student?.course) data.course = student.course?.name;
    console.log(data);
    worksheet.addRow(data);
  });

  //set hedin to bold
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  return workbook.xlsx;
}

module.exports = exportSheet;
