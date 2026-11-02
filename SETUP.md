# إعدادات قاعدة البيانات المشتركة

## الخطوة 1: إنشاء Google Sheet
1. اذهب إلى: https://sheets.google.com
2. اضغط "Create a new spreadsheet"
3. سمّيها: "زفاف غاليه - المهام"
4. أضف عمود واحد بعنوان: "tasks" في الخلية A1

## الخطوة 2: نسخ رابط الـ Sheet
1. اضغط Share (الزر الأزرق في الأعلى)
2. اختر "Anyone with the link"
3. انسخ الرابط

## الخطوة 3: استخدام Apps Script
1. في Google Sheet، اضغط: Extensions > Apps Script
2. استبدل الكود بـ:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([JSON.stringify(data), new Date()]);
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getRange("A2:A").getValues();
  const tasks = data.map(row => {
    try {
      return JSON.parse(row[0]);
    } catch(e) {
      return null;
    }
  }).filter(t => t);
  return ContentService.createTextOutput(JSON.stringify(tasks));
}
```

3. Deploy as: Web app
4. Copy the URL
