class AdminRegisterRequest {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password; // Note: In a real app, never store raw passwords
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


