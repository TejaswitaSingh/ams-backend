class StudentUpdateRequest {
    constructor({ firstName, lastName, email, password, phoneNumber, profilePicture, status }) {
        this.firstName = firstName?.trim();
        this.lastName = lastName?.trim();
        this.email = email?.toLowerCase().trim();
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.status = status;
    }

    validate() {
        // First name validation (optional but must be valid if provided)
        if (this.firstName !== undefined) {
            if (typeof this.firstName !== 'string' || this.firstName.length < 2) {
                return { status: 0, message: 'First name must be at least 2 characters if provided.' };
            }
            if (this.firstName.length > 50) {
                return { status: 0, message: 'First name cannot exceed 50 characters.' };
            }
        }

        // Last name validation (optional but must be valid if provided)
        if (this.lastName !== undefined) {
            if (typeof this.lastName !== 'string' || this.lastName.length < 2) {
                return { status: 0, message: 'Last name must be at least 2 characters if provided.' };
            }
            if (this.lastName.length > 50) {
                return { status: 0, message: 'Last name cannot exceed 50 characters.' };
            }
        }

        // Email validation (optional but must be valid if provided)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.email !== undefined && !emailRegex.test(this.email)) {
            return { status: 0, message: 'Invalid email address if provided.' };
        }

        // Password validation (optional but must meet requirements if provided)
        if (this.password !== undefined) {
            if (typeof this.password !== 'string' || this.password.length < 3) {
                return { status: 0, message: 'Password must be at least 3 characters if provided.' };
            }
        }

        // Phone number validation (optional but must be valid if provided)
        if (this.phoneNumber !== undefined && !/^[0-9]{10,15}$/.test(this.phoneNumber)) {
            return { status: 0, message: 'Phone number must be 10-15 digits if provided.' };
        }

        // Profile picture validation (optional but must be valid if provided)
        if (this.profilePicture !== undefined && typeof this.profilePicture !== 'string') {
            return { status: 0, message: 'Invalid profile picture URL if provided.' };
        }

        // Status validation (optional but must be valid if provided)
        const allowedStatuses = ["pending", "active", "inactive"];
        if (this.status !== undefined && !allowedStatuses.includes(this.status)) {
            return { status: 0, message: 'Invalid status value.' };
        }

        // At least one field should be provided
        if (this.firstName === undefined && 
            this.lastName === undefined && 
            this.email === undefined && 
            this.password === undefined &&
            this.phoneNumber === undefined && 
            this.profilePicture === undefined && 
            this.status === undefined) {
            return { status: 0, message: 'At least one field must be provided for update.' };
        }

        return { status: 1, message: 'Validation successful.' };
    }

    // Method to get only the provided fields for update
    toUpdateFormat() {
        const updateData = {};
        
        if (this.firstName !== undefined) updateData.firstName = this.firstName;
        if (this.lastName !== undefined) updateData.lastName = this.lastName;
        if (this.email !== undefined) updateData.email = this.email;
        if (this.password !== undefined) updateData.password = this.password;
        if (this.phoneNumber !== undefined) updateData.phoneNumber = this.phoneNumber;
        if (this.profilePicture !== undefined) updateData.profilePicture = this.profilePicture;
        if (this.status !== undefined) updateData.status = this.status;

        return updateData;
    }
}

export default StudentUpdateRequest;