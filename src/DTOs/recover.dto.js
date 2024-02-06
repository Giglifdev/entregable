export default class RecoverDTO {
  constructor(user) {
    this.email = user.email;
    this.password = user.password;
  }
}
