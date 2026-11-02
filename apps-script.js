// Google Apps Script for Wedding Tasks - Google Sheet Backend
// التعليمات:
// 1. اذهبي إلى https://script.google.com/
// 2. انسخي هذا الكود
// 3. عرّفي متغير SHEET_ID بـ ID الـ spreadsheet
// 4. اضغطي Deploy > New Deployment > Web app
// 5. أعطيها execute access واحصلي على الرابط

const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // استبدليها بـ ID الـ spreadsheet

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('tasks');
  const data = sheet.getDataRange().getValues();

  const tasks = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      tasks[row[0]] = {
        type: row[1],
        name: row[2],
        price: row[3],
        deposit: row[4],
        person: row[5]
      };
    }
  }

  return ContentService.createTextOutput(JSON.stringify(tasks))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('tasks');
  const payload = JSON.parse(e.postData.contents);

  sheet.clearContents();
  sheet.appendRow(['id', 'type', 'name', 'price', 'deposit', 'person']);

  for (const [id, task] of Object.entries(payload)) {
    sheet.appendRow([id, task.type, task.name, task.price, task.deposit, task.person]);
  }

  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
