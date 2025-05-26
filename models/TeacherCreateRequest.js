class TeacherCreateRequest {
    constructor({ firstName, lastName, email, password, phoneNumber, subject, role }) {
        this.firstName = firstName?.trim();
        this.lastName = lastName?.trim();
        this.email = email?.toLowerCase().trim();
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.subject = subject?.trim();
        this.role = role; // Optional, if your app allows role-based teachers (like 'teacher', 'headteacher', etc.)
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

        if (!this.phoneNumber || !/^[0-9]{10}$/.test(this.phoneNumber)) {
            return { status: 0, message: 'Invalid phone number.' };
        }

        if (!this.subject || this.subject.length < 2) {
            return { status: 0, message: 'Subject must be at least 2 characters.' };
        }

        const allowedRoles = ['teacher', 'headteacher', 'assistant']; // optional, if you use role-based access
        if (this.role && !allowedRoles.includes(this.role)) {
            return { status: 0, message: 'Invalid role selected for teacher.' };
        }

        return { status: 1, message: 'Validation successful.' };
    }
}

export default TeacherCreateRequest;
