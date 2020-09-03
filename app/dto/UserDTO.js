class UserDTO {
    constructor(uuid, firstName, lastName, email, password) {
        this.uuid = uuid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password
    }
}

module.exports = UserDTO;