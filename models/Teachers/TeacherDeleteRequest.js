class TeacherDeleteRequest {
    constructor({ email, id }) {
        this.email = email?.toLowerCase().trim();
        this.id = id;
    }

    validate() {
        // Validate that either email or ID is provided (but not necessarily both)
        if (!this.email && !this.id) {
            return { status: 0, message: 'Either email or ID must be provided for deletion.' };
        }

        // If email is provided, validate its format
        if (this.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                return { status: 0, message: 'Invalid email address provided for deletion.' };
            }
        }

        // If ID is provided, validate it's a non-empty string
        if (this.id && (typeof this.id !== 'string' || this.id.trim().length === 0)) {
            return { status: 0, message: 'Invalid ID provided for deletion.' };
        }

        return { status: 1, message: 'Validation successful.' };
    }
}

export default TeacherDeleteRequest;
