class AdminLoginRequest {
  
  constructor(rawData) {
    if (typeof rawData !== 'object' || rawData === null) {
      throw new Error("Invalid input: Expected an object");
    }

    const { email, password } = rawData;

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

module.exports = AdminLoginRequest;