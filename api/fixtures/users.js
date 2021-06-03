import Users from "../users";
import signup from "../users/signup";

const users = [
  {
    emailAddress: "admin@admin.com",
    password: "password",
    name: {
      first: "Thomas",
      last: "Sowell",
    },
  },
];

export default async () => {
  let i = 0;

  while (i < users.length) {
    const userToInsert = users[i];
    const existingUser = await Users.findOne({
      emailAddress: userToInsert.emailAddress,
    });

    if (!existingUser) {
      await signup(userToInsert);
    }

    i += 1;
  }
};
