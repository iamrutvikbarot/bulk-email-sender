# 📩 Bulk Email Sender  

## 🚀 Overview  
This script automates sending personalized bulk emails using Gmail and Google Sheets. It reads recipient details from a Google Sheet, personalizes each message using placeholders, and logs the email delivery status.  

## 🔹 Features  
✅ **Bulk Email Sending** – Sends multiple emails with one execution  
✅ **Dynamic Placeholders** – Uses `{{name}}`, `{{city}}`, etc., for personalization  
✅ **Email Logging** – Tracks status ("Sent", "Failed", "Pending")  
✅ **Error Handling** – Skips invalid emails and logs failures  
✅ **Automation** – Can be scheduled with Google Apps Script triggers  

---

## 📑 Google Sheets Format  

Create a Google Sheet named **"Emails"**, structured as follows:  

| Name      | Email               | City      | Status  |
|-----------|--------------------|-----------|---------|
| John Doe  | john@example.com   | New York  | Pending |
| Alice Lee | alice@example.com  | Chicago   | Pending |
| Bob Smith | bob@example.com    | LA        | Pending |

## 📅 Automating the Process
1.	Open Apps Script Editor (Extensions → Apps Script).
2.	Click the Clock Icon (Triggers).
3.	Click Add Trigger → Choose processSheetData.
4.	Set trigger to Time-driven (Daily at 9 AM) or any preferred frequency.
5.	Click Save and authorize the script.


## 📜 Script Code (`sendBulkEmails.gs`)  

```javascript
function sendBulkEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Emails");
  if (!sheet) {
    Logger.log("❌ Error: Sheet 'Emails' not found.");
    return;
  }

  var data = sheet.getDataRange().getValues();
  var subject = "📢 Exciting News for {{name}}!";
  var template = "Hello {{name}},\n\nWe are excited to invite you to our event in {{city}}.\n\nBest, Your Company";

  var sentCount = 0, failedCount = 0;

  for (var i = 1; i < data.length; i++) {
    var name = data[i][0], email = data[i][1], city = data[i][2], status = data[i][3];

    if (status === "Sent") continue; // Skip already sent emails

    var message = template.replace("{{name}}", name).replace("{{city}}", city);

    try {
      if (validateEmail(email)) {
        MailApp.sendEmail(email, subject, message);
        sheet.getRange(i + 1, 4).setValue("Sent ✅");
        sentCount++;
      } else {
        throw new Error("Invalid email format");
      }
    } catch (error) {
      sheet.getRange(i + 1, 4).setValue("Failed ❌: " + error.message);
      failedCount++;
    }
  }

  Logger.log(`✅ Emails Sent: ${sentCount}, ❌ Failed Emails: ${failedCount}`);
}

function validateEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}