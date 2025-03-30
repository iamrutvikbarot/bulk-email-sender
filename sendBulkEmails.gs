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