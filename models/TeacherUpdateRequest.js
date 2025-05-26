class TeacherUpdateRequest {
    constructor({ firstName, lastName, email, password, phoneNumber, subject, role, status }) {
        this.firstName = firstName?.trim();
        this.lastName = lastName?.trim();
        this.email = email?.toLowerCase().trim();
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.subject = subject?.trim();
        this.role = role;
        this.status = status;
    }

    validate() {
        // First name validation (optional but must be valid if provided)
        if (this.firstName && (typeof this.firstName !== 'string' || this.firstName.length < 2)) {
            return { status: 0, message: 'First name must be at least 2 characters if provided.' };
        }

        // Last name validation (optional but must be valid if provided)
        if (this.lastName && (typeof this.lastName !== 'string' || this.lastName.length < 2)) {
            return { status: 0, message: 'Last name must be at least 2 characters if provided.' };
        }

        // Email validation (optional but must be valid if provided)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.email && !emailRegex.test(this.email)) {
            return { status: 0, message: 'Invalid email address.' };
        }

        // Password validation (optional but must meet requirements if provided)
        if (this.password && this.password.length < 6) {
            return { status: 0, message: 'Password must be at least 6 characters if provided.' };
        }

        // Phone number validation (optional but must be valid if provided)
        if (this.phoneNumber && !/^[0-9]{10}$/.test(this.phoneNumber)) {
            return { status: 0, message: 'Phone number must be 10 digits if provided.' };
        }

        // Subject validation (optional but must be valid if provided)
        if (this.subject && this.subject.length < 2) {
            return { status: 0, message: 'Subject must be at least 2 characters if provided.' };
        }

        // Role validation (optional)
        const allowedRoles = ['teacher', 'headteacher', 'assistant'];
        if (this.role && !allowedRoles.includes(this.role)) {
            return { status: 0, message: 'Invalid role selected.' };
        }

        // Status validation (optional boolean)
        if (this.status !== undefined && typeof this.status !== 'boolean') {
            return { status: 0, message: 'Status must be a boolean value.' };
        }

        // At least one field should be provided
        if (!this.firstName && !this.lastName && !this.email && !this.password &&
            !this.phoneNumber && !this.subject && !this.role && this.status === undefined) {
            return { status: 0, message: 'At least one field must be provided for update.' };
        }

        return { status: 1, message: 'Validation successful.' };
    }
}

export default TeacherUpdateRequest;
