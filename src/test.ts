import { hashPassword } from "@shared/password/password";

const password = hashPassword("12345");
console.log(password);
