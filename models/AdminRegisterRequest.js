class AdminRegisterRequest {
  constructor(rawData) {
    if (typeof rawData !== 'object' || rawData === null) {
      throw new Error("Invalid input: Expected an object");
    }

    const { firstName, lastName, email, password } = rawData;

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password; // In a real app, never store plain passwords
  }


  validate(){
        if(!this.firstName || !this.lastName || !this.email || !this.password){
                        return false
  }else{
    return true
  }
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      // password is excluded for security (optional)
    
    };
  }
}

module.exports = AdminRegisterRequest;
