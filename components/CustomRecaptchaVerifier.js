// CustomRecaptchaVerifier.js

import firebase from 'firebase/compat/app';

class CustomRecaptchaVerifier extends firebase.auth.RecaptchaVerifier {
  constructor() {
    super(null);
    this.type = 'recaptcha';
  }

  async verify() {
    return Promise.resolve('recaptcha_bypassed');
  }

  async render() {
    return Promise.resolve();
  }
}

export default CustomRecaptchaVerifier;
