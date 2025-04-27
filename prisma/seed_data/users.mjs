import { hashSync } from "bcrypt";


export const users = [
  {
    username: "new@new.new",
    email: "new@new.new",
    password: hashSync("new@new.new", 10),
  },
  {
    username: "test@test.test",
    email: "test@test.test",
    password: hashSync("test@test.test", 10),
  },
  {
    username: "dev@dev.tesdev",
    email: "dev@dev.dev",
    password: hashSync("dev@dev.dev", 10),
  },
  {
    username: "comp@comp.comp",
    email: "comp@comp.comp",
    password: hashSync("comp@comp.comp", 10),
    status: "18"
  },
];
