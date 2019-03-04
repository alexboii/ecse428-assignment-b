// index.js
var { Given, When, Then, setDefaultTimeout } = require("cucumber");
var { expect } = require("chai");
setDefaultTimeout(60 * 1000);

Given(
  "that I am a valid user logged in on my ProtonMail inbox page",
  async function() {
    expect(await this.loginProtonMail(), true);
    expect(await this.openNewMessageModal(), true);
  }
);

When("I send an email to {string}", async function(address) {
  expect(await this.addRecipient(address), true);
});

When("the URL {string} is inserted", async function(imageUrl) {
  expect(await this.addImageUrl(imageUrl), true);
});

When("the image {string} is attached from disk", async function(file) {
  expect(await this.addImageAttachment(file), true);
});

When("{string} is the subject", async function(subject) {
  expect(await this.addSubject(subject), true);
});

Then(
  `the email should appear as a sent email with address {string}, image url {string} and subject {string}`,
  async function(address, imageUrl, subject) {
    expect(await this.sendCorrectEmail(), true);

    expect(
      await this.confirmEmailSentByImageUrl(address, imageUrl, subject),
      true
    );

    expect(await this.restoreInitial(), true);
  }
);

Then(
  `the email should appear as a sent email with address {string}, image from disk {string} and subject {string}`,
  async function(address, filename, subject) {
    expect(await this.sendCorrectEmail(), true);

    expect(
      await this.confirmEmailSentByImageFromDisk(address, filename, subject),
      true
    );

    expect(await this.restoreInitial(), true);
  }
);

Then(
  "an error message should notify me that the email {string} I have just entered is invalid",
  async function(address) {
    expect(await this.sendEmailWithWrongAddress(address), true);

    expect(await this.restoreInitialFromError(), true);
  }
);
