var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
var chromeDriverPath = require("chromedriver").path;
var { setWorldConstructor } = require("cucumber");
// constants
var USER_LOGIN = "ecse428-15@protonmail.com";
var USER_PASSWORD = "pastasaucemakesmefeelwhole";

("use strict");

chrome.setDefaultService(new chrome.ServiceBuilder(chromeDriverPath).build());

class SeliniumActions {
  /** Initialize Chrome web driver */
  constructor() {
    this.driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();

    this.driver
      .manage()
      .timeouts()
      .implicitlyWait(20000);
  }

  /**
   * Login to ProtonMail web client to see inbox
   */
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

    return (await renderConfirmation.getSize()) !== 0;
  }

  /**
   * Open ProtonMail's modal to compose a new message
   */
  async openNewMessageModal() {
    await this.driver
      .findElement(
        webdriver.By.className("compose pm_button sidebar-btn-compose")
      )
      .click();

    const renderConfirmation = await this.driver.findElement(
      webdriver.By.id("uid1")
    );

    return (await renderConfirmation.getSize()) !== 0;
  }

  /**
   * Add the address of the recipient in the "to" field of the email's form
   * @param {string} email
   */
  async addRecipient(email) {
    if (!email) {
      return false;
    }

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

  /**
   * Attach an image to the email by using the "insert picture" option provided by ProtonMail
   * @param {string} url
   */
  async addImageUrl(url) {
    if (!url) {
      return false;
    }

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

    return (await renderConfirmation.getSize()) !== 0;
  }

  /**
   * Attach an image to the email by using the file uploader provided by ProtonMail
   * @param {string} file
   */
  async addImageAttachment(file) {
    if (!file) {
      return false;
    }

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

    return (await renderConfirmation.getSize()) !== 0;
  }

  /**
   * Add a subject to the email form inside of the "Subject" field
   * @param {string} subject
   */
  async addSubject(subject) {
    if (!subject) {
      return false;
    }

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

  /**
   * Press "SEND" button to send an email to the desired recipient
   */
  async attemptToSendEmail() {
    await this.driver
      .findElement(
        webdriver.By.className(
          `pm_button primary mobileFull composer-btn-send btnSendMessage-btn-action`
        )
      )
      .click();
  }

  /**
   * Send an email assuming that there are no errors in any of the fields and the
   * email has valid content
   */
  async sendCorrectEmail() {
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

    return (await renderConfirmation.getSize()) !== 0;
  }

  /**
   * Opens up the first email in the list of "Sent" emails which corresponds to a given subject
   * @param {string} subject
   */
  async openEmailWithSubject(subject) {
    if (!subject) {
      return false;
    }

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

  /**
   * Check that the contents of the email match what was sent through ProtonMail's compose email modal with a given image URL
   * @param {string} address
   * @param {string} imageUrl
   * @param {string} subject
   */
  async confirmEmailSentByImageUrl(address, imageUrl, subject) {
    if (!address || !imageUrl || !subject) {
      return false;
    }

    await this.openEmailWithSubject(subject);

    await this.driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.className("displayContentBtn-button pm_button")
        ),
        5000
      )
      .then(el => el.click());

    const renderConfirmation = await this.driver.findElement(
      webdriver.By.xpath(`//img[contains(@src,'${imageUrl}')]`)
    );

    return (await renderConfirmation.getSize()) !== 0;
  }

  /**
   * Check that the contents of the email match what was sent through ProtonMail's compose email modal with a given attached image from disk
   * @param {string} address
   * @param {string} filename
   * @param {string} subject
   */
  async confirmEmailSentByImageFromDisk(address, filename, subject) {
    if (!address || !filename || !subject) {
      return false;
    }

    await this.openEmailWithSubject(subject);

    const renderConfirmation = await (await this.driver.findElement(
      webdriver.By.xpath(`//*[contains(text(), '${filename}')]`)
    )).getSize();

    return renderConfirmation !== 0;
  }

  /**
   * Send an email knowing that the email is badly formatted
   * @param {string} address
   */
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
        `//*[contains(text(), 'The following addresses are not valid: ${address.toLowerCase()}')]`
      )
    );

    return (await renderConfirmation.getSize()) !== 0;
  }

  /**
   * Go back to the initial "Given" state for when the user is not in the inbox but is logged in
   */
  async restoreInitial() {
    await this.driver.get("https://mail.protonmail.com/inbox");
    return this.openNewMessageModal();
  }

  /**
   * Go back to the initial "Given" state for when the user still has the "Compose" modal open but was not allowed
   * to send an email because of an error
   */
  async restoreInitialFromError() {
    await this.driver
      .wait(
        webdriver.until.elementLocated(
          webdriver.By.className("autocompleteEmails-btn-remove fa fa-times")
        ),
        5000
      )
      .then(el => el.click());

    await (await this.driver.findElement(
      webdriver.By.xpath('//*[@title="Subject"]')
    )).clear();

    await (await this.driver.findElement(
      webdriver.By.className("composerAttachments-header")
    )).click();

    await (await this.driver.findElement(
      webdriver.By.className("progressLoader-btn-remove progressionBtn-btn")
    )).click();

    const renderConfirmation = await this.driver
      .findElement(webdriver.By.xpath('//*[@title="Subject"]'))
      .getAttribute("value");

    return !renderConfirmation;
  }

  /** Method to confirm that we are indeed at the expected initial state */
  async confirmInitialState() {
    const renderInboxConfirmation = (await this.driver.findElement(
      webdriver.By.className("navigationItem-title")
    )).getCssValue("font-weight");

    if (renderInboxConfirmation < 700) {
      return false;
    }

    const renderMessageModalConfirmation = await this.driver.findElement(
      webdriver.By.xpath(`//*[contains(text(), 'New message')]`)
    );

    return (await renderMessageModalConfirmation.getSize()) !== 0;
  }

  /**
   * Quit Chrome
   */
  async quitDriver() {
    await this.driver.quit();
  }
}

setWorldConstructor(SeliniumActions);
