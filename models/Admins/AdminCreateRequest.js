class AdminCreateRequest {
    constructor({ firstName, lastName, email, password,phoneNumber, role }) {
        this.firstName = firstName?.trim();
        this.lastName = lastName?.trim();
        this.email = email?.toLowerCase().trim();
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    validate() {
        if (!this.firstName || typeof this.firstName !== 'string' || this.firstName.length < 2) {
            return { status: 0, message: 'First name must be at least 2 characters.' };
        }

        if (!this.lastName || typeof this.lastName !== 'string' || this.lastName.length < 2) {
            return { status: 0, message: 'Last name must be at least 2 characters.' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            return { status: 0, message: 'Invalid email address.' };
        }

        if (!this.password || this.password.length < 6) {
            return { status: 0, message: 'Password must be at least 6 characters.' };
        }

        const allowedRoles = ['admin', 'superadmin', 'moderator', 'support'];
        if (!this.role || !allowedRoles.includes(this.role)) {
            return { status: 0, message: 'Invalid role selected.' };
        }

        return { status: 1, message: 'Validation successful.' };
    }
}

export default AdminCreateRequest
