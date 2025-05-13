class AdminLoginRequest {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.email || !this.password) {
      return false;
    } else {
      return true;
    }
  }

  toJSON() {
    return {
      email: this.email,
      // password intentionally excluded for security (optional)
    };
  }
}
