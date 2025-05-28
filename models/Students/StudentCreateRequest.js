class StudentCreateRequest {
    constructor({ firstName, lastName, email, password, phoneNumber, profilePicture }) {
        this.firstName = firstName?.trim();
        this.lastName = lastName?.trim();
        this.email = email?.toLowerCase().trim();
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.userType = 'student'; // Default value
        this.status = 'pending'; // Default value
    }

    validate() {
        // Validate firstName
        if (!this.firstName || typeof this.firstName !== 'string' || this.firstName.length < 2) {
            return { status: 0, message: 'First name must be at least 2 characters.' };
        }

        if (this.firstName.length > 50) {
            return { status: 0, message: 'First name cannot exceed 50 characters.' };
        }

        // Validate lastName
        if (!this.lastName || typeof this.lastName !== 'string' || this.lastName.length < 2) {
            return { status: 0, message: 'Last name must be at least 2 characters.' };
        }

        if (this.lastName.length > 50) {
            return { status: 0, message: 'Last name cannot exceed 50 characters.' };
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            return { status: 0, message: 'Invalid email address.' };
        }

        // Validate password
        if (!this.password || typeof this.password !== 'string') {
            return { status: 0, message: 'Please provide password.' };
        }

        // Validate phoneNumber (optional but must be valid if provided)
        if (this.phoneNumber && !/^[0-9]{10,15}$/.test(this.phoneNumber)) {
            return { status: 0, message: 'Phone number must be 10-15 digits.' };
        }

        // Validate profilePicture URL if provided
        if (this.profilePicture && typeof this.profilePicture !== 'string') {
            return { status: 0, message: 'Invalid profile picture URL.' };
        }

        return { status: 1, message: 'Validation successful.' };
    }

    // Optional: Method to get the data ready for database insertion
    toDatabaseFormat() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            phoneNumber: this.phoneNumber,
            profilePicture: this.profilePicture,
            userType: this.userType,
            status: this.status
        };
    }
}

export default StudentCreateRequest;