export class CredentialsDTO {
  handle: string;
  password: string;
  displayName: string;

  constructor(handle: string = "", password: string = "", displayName: string = "") {
    this.handle = handle;
    this.password = password;
    this.displayName = displayName;
  }
}
