var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
var chromeDriverPath = require("chromedriver").path;
var { setWorldConstructor } = require("cucumber");
// constants
var USER_LOGIN = "ecse428-4@protonmail.com";
var USER_PASSWORD = "test123456";

("use strict");

chrome.setDefaultService(new chrome.ServiceBuilder(chromeDriverPath).build());

class SeliniumActions {
  constructor() {
    this.driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();

    this.driver
      .manage()
      .timeouts()
      .implicitlyWait(20000);
  }

  async loginProtonMail() {
    this.driver.get("https://mail.protonmail.com/login");

    await this.driver
      .findElement(webdriver.By.id("username"))
      .sendKeys(USER_LOGIN);

    await this.driver
      .findElement(webdriver.By.id("password"))
      .sendKeys(USER_PASSWORD);

    await this.driver.findElement(webdriver.By.id("login_btn")).click();

    await this.driver.wait(
      webdriver.until.elementLocated(webdriver.By.id("ptSidebar")),
      5000
    );

    const renderConfirmation = await this.driver.findElement(
      webdriver.By.id("ptSidebar")
    );

    return renderConfirmation.getSize() !== 0;
  }

  async openNewMessageModal() {
    await this.driver
      .findElement(
        webdriver.By.className("compose pm_button sidebar-btn-compose")
      )
      .click();

    const renderConfirmation = await this.driver.findElement(
      webdriver.By.id("uid1")
    );

    return renderConfirmation.getSize() !== 0;
  }

  async addRecipient(email) {
    await this.driver
      .findElement(
        webdriver.By.className("autocompleteEmails-input no-outline")
      )
      .sendKeys(email);

    const renderConfirmation = await this.driver
      .findElement(
        webdriver.By.className("autocompleteEmails-input no-outline")
      )
      .getAttribute("value");

    return email === renderConfirmation;
  }

  async addImageUrl(url) {
    await this.driver
      .findElement(webdriver.By.className("squireToolbar-action-image image"))
      .click();

    await this.driver
      .wait(webdriver.until.elementLocated(webdriver.By.id("address")), 5000)
      .then(el => el.sendKeys(url));

    await this.driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.className(
            "pm_button primary modal-footer-button addFile-insert-button"
          )
        ),
        5000
      )
      .then(el => el.click());

    await this.driver.wait(
      webdriver.until.elementLocated(webdriver.By.tagName("img")),
      5000
    );

    const renderConfirmation = await this.driver.findElement(
      webdriver.By.tagName("img")
    );

    return renderConfirmation.getSize() !== 0;
  }

  async addImageAttachment(file) {
    await this.driver
      .findElement(webdriver.By.className("dz-hidden-input"))
      .sendKeys(`${__dirname}/data/${file}`);

    await this.driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.className(
            "pm_button primary composerAskEmbdded-btn-attachment"
          )
        ),
        5000
      )
      .then(el => el.click());

    await this.driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.xpath("//*[contains(text(), 'file attached')]")
      ),
      5000
    );

    const renderConfirmation = await this.driver.findElement(
      webdriver.By.xpath("//*[contains(text(), 'file attached')]")
    );

    return renderConfirmation.getSize() !== 0;
  }

  async addSubject(subject) {
    await this.driver
      .findElement(
        webdriver.By.className(
          "flex subject no-outline ng-pristine ng-untouched ng-empty ng-invalid ng-invalid-required"
        )
      )
      .sendKeys(subject);

    const renderConfirmation = await this.driver
      .findElement(webdriver.By.xpath('//*[@title="Subject"]'))
      .getAttribute("value");

    return subject === renderConfirmation;
  }

  async attemptToSendEmail() {
    await this.driver
      .findElement(
        webdriver.By.className(
          `pm_button primary mobileFull composer-btn-send btnSendMessage-btn-action`
        )
      )
      .click();
  }

  async semdCorrectEmail() {
    await this.attemptToSendEmail();

    await this.driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.className(
          "proton-notification-template cg-notify-message notification-success cg-notify-message-center"
        )
      ),
      5000
    );

    const renderConfirmation = await this.driver.findElement(
      webdriver.By.xpath("//*[contains(text(), 'Message sent')]")
    );

    return renderConfirmation.getSize() !== 0;
  }

  async openEmailWithSubject(subject) {
    await this.driver.get("https://mail.protonmail.com/sent");

    await this.driver.wait(
      webdriver.until.elementLocated(webdriver.By.className("fa fa-send")),
      5000
    );

    await this.driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.xpath(`//*[contains(text(), '${subject}')]`)
        ),
        5000
      )
      .then(el => el.click());
  }

  async confirmEmailSentByImageUrl(address, imageUrl, subject) {
    await this.openEmailWithSubject(subject);

    await this.driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.className("displayContentBtn-button pm_button")
        ),
        5000
      )
      .then(el => el.click());

    return Promise.all([
      this.driver.findElement(
        webdriver.By.xpath(`//*[contains(text(), '${address}')]`)
      ),
      this.driver.findElement(
        webdriver.By.xpath(`//img[contains(@src,'${imageUrl}')]`)
      )
    ]).then(values => values.map(el => el.getSize() !== 0).every(el => true));
  }

  async confirmEmailSentByImageFromDisk(address, filename, subject) {
    await this.openEmailWithSubject(subject);

    return Promise.all([
      this.driver.findElement(
        webdriver.By.xpath(`//*[contains(text(), '${filename}')]`)
      ),
      this.driver.findElement(
        webdriver.By.xpath(`//*[contains(text(), '${address}')]`)
      )
    ]).then(values => values.map(el => el.getSize() !== 0).every(el => true));
  }

  async sendEmailWithWrongAddress(address) {
    await this.attemptToSendEmail();

    await this.driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.className(
          "proton-notification-template cg-notify-message notification-danger cg-notify-message-center"
        )
      ),
      5000
    );

    const renderConfirmation = await this.driver.findElement(
      webdriver.By.xpath(
        `//*[contains(text(), 'The following addresses are not valid: ${address}')]`
      )
    );

    return renderConfirmation.getSize() !== 0;
  }

  async restoreInitial() {
    await this.driver.get("https://mail.protonmail.com/sent");
    return this.openNewMessageModal();
  }

  async restoreInitialFromError() {
    await this.driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.className("autocompleteEmails-btn-remove fa fa-times")
        ),
        5000
      )
      .then(el => el.click());

    await this.driver
      .findElement(webdriver.By.xpath('//*[@title="Subject"]'))
      .clear();

    const renderConfirmation = await this.driver
      .findElement(webdriver.By.xpath('//*[@title="Subject"]'))
      .getAttribute("value");

    return !renderConfirmation;
  }

  async quitDriver() {
    await this.driver.quit();
  }
}

setWorldConstructor(SeliniumActions);
