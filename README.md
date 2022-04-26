<img src="https://cheatcode-assets.s3.amazonaws.com/cheatcode-logo-sm.svg" alt="CheatCode">

## Node.js Server Boilerplate (Beta)

Back-end boilerplate for building web applications, based on [Node.js](https://nodejs.org).

[Join the Discord](https://discord.gg/UTy4Fpy)

---

### Table of Contents

0. [Who is This For?](#who-is-this-for)
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [File Structure](#file-structure)
4. [Development Server](#development-server)
   - [Webpack](#webpack)
   - [MongoDB](#mongodb)
5. [Express Server](#express-server)
   - [Middleware](#middleware)
6. [GraphQL Server](#graphql-server)
   - [Server](#server)
   - [Schema](#schema)
   - [MongoDB & GraphQL](#mongodb-graphql)
   - [Fixtures](#fixtures)
7. [Accounts](#accounts)
8. [Settings](#settings)
9. [Fixtures](#fixtures)
10. [FAQ](#faq)
11. [Contributing](#contributing)
12. [License](#license)

### Who is This For?

This boilerplate was created first and foremost as a teaching aid, used in conjunction with tutorials and courses on [CheatCode](https://cheatcode.co)—a site decidated to teaching you how to build full-stack apps with JavaScript and Node.js.

Beyond this, it's also intended as a starting point for your product or service. It's a great fit for developers working on a new startup, or, an app for an existing business.

**It's important to note**: this boilerplate is _back-end only_. It was designed to work in conjunction with a separate front-end. We offer a [Next.js Boilerplate](https://github.com/cheatcode/nextjs-boilerplate) to fill this role for you, providing a working GraphQL client and accounts UI that this Node.js boilerplate is already set up to use. Learn more about this decision [in the FAQ](#faq).

### Introduction

<blockquote>
<h4 style="margin:0 0 10px;">Front-End Agnostic</h4>
<p style="margin:0;">While you can use any front-end you wish with the boilerplate, by default, it's wired to work with the <a href="https://github.com/cheatcode/nextjs-boilerplate">CheatCode Next.js Boilerplate</a>.</p>
</blockquote>

This boilerplate was created to serve as a starting point for the back-end of a web application using Node.js.

To accomplish this, the boilerplate includes:

- A fully-implemented development server
- Automatic startup of a MongoDB server with configured driver
- A fully-implemented HTTP server using Express.js
- Middleware for handling common tasks like body parsing, CORS, and limiting requests by method
- A fully-implemented GraphQL server and schema
- A fully-implemented accounts system using JWT tokens and HTTP-only cookies
- An example GraphQL implementation
- Support for Node.js clustering (disabled by default)

Together, these features give you everything you need for offering a Node.js-based back-end for your application.

### Getting Started

To get started, clone a copy of the boilerplate from Github:

```
git clone git@https://github.com/cheatcode/nodejs-server-boilerplate
```

Once the boilerplate is cloned, `cd` into its folder and run `npm install` to download all of the boilerplate's dependencies:

```
cd nodejs-server-boilerplate && npm install
```

**Note**: You can safely use [Yarn](https://yarnpkg.com/) for this step if you prefer.

#### Next Steps

Once you've cloned the boilerplate and installed all of its dependencies, the next step is to familiarize yourself with the file structure.

### File Structure

The following file tree describes the full structure of this boilerplate:

```
├── /.app
│   ├── development.js
│   ├── environment.js
│   ├── loader.js
│   └──  reset.js
├── /.data
│   └──  /mongodb
├── /api
│   ├── /documents
│   │   ├── /graphql
│   │   │   ├── mutations.js
│   │   │   ├── queries.js
│   │   │   └── types.js
│   │   └── index.js
│   ├── /fixtures
│   │   ├── users.js
│   │   └── index.js
│   ├── /graphql
│   │   ├── schema.js
│   │   └── server.js
│   ├── /users
│   │   ├── /graphql
│   │   │   ├── mutations.js
│   │   │   ├── queries.js
│   │   │   └── types.js
│   │   ├── decryptLoginToken.js
│   │   ├── encryptLoginToken.js
│   │   ├── generateResetToken.js
│   │   ├── getBaseAuthenticationCookie.js
│   │   ├── getExistingUserByEmail.js
│   │   ├── getExistingUserByEmailPassword.js
│   │   ├── hashString.js
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── resetPassword.js
│   │   ├── setAuthenticationCookie.js
│   │   ├── signup.js
│   │   ├── token.js
│   │   ├── unsetAuthenticationCookie.js
│   │   └── validateLoginToken.js
│   └──  index.js
├── /dist
│   └──  index.js
├── /lib
│   ├── /email
│   │   ├── /templates
│   │   │   └── reset-password.html
│   │   └── send.js
│   ├── cluster.js
│   ├── formatErrorString.js
│   ├── generateId.js
│   ├── getSlug.js
│   ├── isDocumentOwner.js
│   ├── logger.js
│   ├── mongodb.js
│   ├── noUserError.js
│   ├── settings.js
│   └── startup.js
├── /middleware
│   ├── bodyParser.js
│   ├── cors.js
│   ├── index.js
│   └── requestMethod.js
├── /node_modules
├── /public
│   └── favicon.ico
├── .babelrc
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
├── README.md
├── settings-development.json
├── settings-production.json
└── webpack.config.js
```

### Development Server

To aid in the development process, the boilerplate includes a fully-implemented development server. The development server is responsible for:

- Running your Node.js app on your local machine
- Running Webpack in watch mode to recompile your code when it changes
- Running a MongoDB server on your local machine for storing data

In addition to this, the development server also manages the lifecycle of these parts, ensuring that they're removed from memory when the server is stopped.

#### Webpack

Webpack is utilized in the boilerplate to enable usage of modern JavaScript _without_ having to worry about Node.js compatibility issues. Though current versions of Node.js can compile modern JavaScript without issue, utilizing Webpack—and by extension, Babel—ensures that you can jump between Node.js versions without headaches.

In respect to builds, when in development (and when running `npm run build` before going to production), Webpack outputs the built copy of the `index.js` file at the root of the project to `/dist/index.js`. If you look at the `package.json` file's `main` field, you will see that this file is used to start the application in production.

#### MongoDB

To aid in rapid development, the development server will automatically start up a MongoDB server instance on your machine. This is a two step process:

1. The development server will check to see if you have MongoDB installed on your machine. If you do not, you will be prompted to install it.
2. If MongoDB is locally detected, a background instance will be started on port `27017`.

Once started, the MongoDB instance will be accessible via any MongoDB admin at `mongodb://127.0.0.1:27017` (no username or password required). Additionally, this instance is already accessible and configured in the application, using the official MongoDB Node.js driver in `/lib/mongodb.js`.

This file exports an object containing the MongoDB database instance as `db`, a helper constructor for adding new collections `Collection`, and the raw MongoDB connection as `connection`.

##### Creating New Collections

Collections can be created using the `Collection` constructor exported by the file in `/lib/mongodb.js`. An example is available in `/api/documents/index.js`:

```
import MongoDB from "../../lib/mongodb";

export default MongoDB.Collection("documents");
```

Here, we call `MongoDB.Collection` passing the name of the collection we'd like to create.

### Express Server

Once the development server is started, an Express.js server is made available at port `5001`. This server is configured in the root `index.js` file of the project.

As part of the startup process, the boilerplate utilizes a `startup()` function that's responsible for two things:

1. Running any code that needs to start _before_ the Express server.
2. Attaching event listeners to the Node.js process to catch errors.

Once this `startup()` process completes a few steps take place:

1. The Express app is created.
2. Middleware handlers are attached.
3. The API middleware
4. Express app is started on port 5001.

When the server starts up, a call to the Node.js `process.send` method is fired, communicating the startup event back to the development server.

#### Middleware

As a convenience, a set of pre-configured middleware are included in the boilerplate to assist with inbound requests. Currently, the boilerplate has middleware for:

- Limiting which request methods are available to the public
- Enabling basic compression for the response body
- Handling favicon requests
- Mapping static assets in the /public directory to the root URL
- Handling CORS configuration (along with limiting access to certain URLs)
- Parsing the request body for both JSON and URL encoded request bodies
- Parsing cookies sent in the request

These middleware methods are called in sequence in the `/middleware/index.js` file. The order is intentional, though, you're welcome to reorder it and extend the list of middlewares present based on your needs.

### GraphQL Server

As part of the startup process, in `index.js`, an `api()` middleware is called which is responible for loading your app's data API.

#### Server

By default, this only includes a handler for a GraphQL API, but this is given a generic name of `api()` to showcase that it can be extended to include a REST or any other API handlers as well.

If you look into `/api/index.js`, you will see this middleware defined, with a singular call to the method exported by the `/api/graphql/server.js` file.

```
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import { isDevelopment } from "../../.app/environment";
import loginWithToken from "../users/token";
import { configuration as corsConfiguration } from "../../middleware/cors";

export default (app) => {
  const server = new ApolloServer({
    schema,
    introspection: isDevelopment,
    playground: isDevelopment,
    context: async ({ req, res }) => {
      const token = req?.cookies["app_login_token"];

      const context = {
        req,
        res,
        user: {},
      };

      const user = token ? await loginWithToken({ token }) : null;

      if (!user?.error) {
        context.user = user;
      }

      return context;
    },
  });

  server.applyMiddleware({
    cors: corsConfiguration,
    app,
    path: "/api/graphql",
  });
};
```

Inside of this file, the GraphQL server is initialized using the Apollo Server library. As part of the configuration, the `context` object (an open-ended object passed to every single GraphQL resolver) is assigned three properties:

- `req` - The Express.js request object.
- `res` - The Express.js response object.
- `user` - If an `app_login_token` cookie is present (signifying a previously logged in user is making the request), the user associated with that token is set on the context for access in your GraphQL resolvers.

In addition to setting the context, the GraphQL schema is also loaded for your app. The configuration for this is located in `/api/graphql/schema.js` and explained in the next section of this documentation.

> **Note**: Although `apollo-server` will technically pass the `typeDefs` and `resolvers` properties that you set in the options passed to `new ApolloServer()` through the `@graphql-tools/schema` package's `makeExecutableSchema()` function, we've used an alternative approach here to add clarity. `makeExecutableSchema` is imported into your `/api/graphql/schema.js` file directly from `@graphql-tools/schema` and used to wrap the schema object at the bottom of the file. Not only does this add clarity, but it also ensures that any GraphQL middleware will be able to utilize your schema, too.

Once the Apollo Server is configured, finally, we attach it to the already running Express server using the Apollo server's `applyMiddleware()` method.

#### Schema

The core part of a GraphQL server is the schema. This defines the types, queries, and mutations that are available for consumption in your app.

To aid in the process of authoring your schema, a basic pattern is implemented for implementing your `typeDefs`, `Queries` resolvers and `Mutations` resolvers. The idea here is that we want to import all of our resolvers and types from external files.

The structure for this is to have directories at the root of the `/api` directory, with each one describing a data resource in your application. For example, by default the boilerplate comes with a `documents` example resource and a `users` example resource.

Inside each directory, a sub-directory exists with the name `graphql` (e.g., `/api/documents/graphql`). Inside, your `types`, `queries`, and `mutations` are separated into individual files (you will see these imported at the top of `/api/graphql/schema.js` for loading into the schema).

Aside from this organizational pattern, no other boilerplate-specifics exist in relation to GraphQL.

#### MongoDB & GraphQL

One thing worth noting is how MongoDB is utilized in relation to GraphQL within the boilerplate. As noted above, a helper `MongoDB.Collection` method is offered for creating MongoDB collections in your app.

The pattern choose for storing the result of calling these functions is to store an `index.js` file at the root of each folder representing a data resource (that also requires a MongoDB collection) in your `/api` folder. Inside of that file, the `Mongo.Collection` method is called, creating the collection, and then is immediately exported.

If you look at the example GraphQL resolvers in `/api/documents/graphql/mutations.js`, you will see the `Documents` collection being imported that was created using this pattern. When we call `Mongo.Collection` we expect it to return us the collection handler directly from the MongoDB driver.

This means that we can call MongoDB collection methods directly on the collection like `Documents.insertOne({ ... })`, instead of having to use the default patern of `mongodb.collection('documents').insertOne({ ... })`.

### Accounts

Accounts are the largest feature of the boilerplate. Instead of relying on a third-party library or service, accounts in the boilerplate are 100% custom. This decision was made intentionally as an official opinion of CheatCode is to [control your user data](https://cheatcode.co/opinions/control-your-user-data).

If you're used to using third-party or framework-level implementations for users, doing a custom implementation can seem scary. In the boilerplate, though, security of data was the primary concern, ensuring that user data is only accessible to who you intend.

#### Authentication Token

In order to handle encryption of your user's JWT tokens (the security mechanism used for handling the authentication of existing user sessions), the boilerplate relies on a unique hex string stored in the `settings-<env>.json` file at the root of this project (in the `authentication.token` field of that file).

```
// settings-development.json

{
  "authentication": {
    "token": "abcdefghijklmnopqrstuvwxyz1234567890"
  },
  [...]
}
```

While this can be anything you'd like, we recommend utilizing [CheatCode's Authentication Token Generator](https://api.cheatcode.co/tools/generate-authentcation-token) which will give you a secure token to use for this.

> **Note**: This generator will only generate a token once and DOES NOT persist it anywhere. Make sure to back up the tokens you use in a password manager like 1Password, LastPass, or other encrypted secrets tool (Hashicorp Vault).

#### Signup

User accounts are created using the following process:

1. From your front-end, a user completes your sign up form, providing an email address and a password they'll use to login later.
2. Over HTTPS (in production), the user's data is sent encrypted to the server.
3. On the server, the uer's password is hashed using bcrypt.
4. The hashed password along with the email address are set in the database.
5. In response to the sign up, the hashed password, email, and new user's ID are passed to the jsonwebtoken library (jwt, or "jot") to create a JWT token.
6. The JWT token is then returned along with an expiration date (default of 30 days from now).
7. The JWT token and expiration are set as HTTP-only, secure-only (in production), domain-specific cookies.
8. The response is sent back to the browser and cookies are set on the browser.

Once this process is complete, two cookies will be present in the browser: `app_login_token` and `app_login_tokenExpiresAt`.

#### Login

The login process has two forms: logging in with an email address and password, or, using the JWT token from the browser. Logging in via email address and password is only necessary if a user has _not_ logged in before, or, their existing JWT token has expired.

When logging in for the first time (or after an expired token), a similar process is followed to steps 6-8 is followed after checking that the email address and password match an existing user. In the event that a user doesn't exist with the provided email address and password, the login process is halted and an error is thrown back to the request origin.

### Account Recovery

In addition to basic signup and login, the boilerplate also adds support for password recovery and reset. This also includes sending an email to the address where that the recovery was initiated for.

To send this email, a wrapper around the `nodemailer` NPM package has been implemented in `/lib/email/send.js`. This wrapper takes a single options object as an argument that accepts [all of the message options allowed by nodemailer](https://nodemailer.com/message/).

In addition to these options, a `template` and `templateVars` object can be passed (boilerplate-specific) to render a custom HTML template, passing it some dynamica data. This is how the password reset email works.

Inside of `/lib/emails/templates/reset-password.html` is a template for this email, using [EJS tags](https://ejs.co/#docs) to aid in replacing dynamic data:

```
<html>
  <head>
    <title>Reset Password</title>
  </head>
  <style>
    body {
      color: #000;
      font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      font-size: 16px;
      line-height: 24px;
    }
  </style>
  <body>
    <p>Hello,</p>
    <p>A password reset was requested for this email address (<%= emailAddress %>). If you requested this reset, click the link below to reset your password:</p>
    <p><a href="<%= resetLink %>">Reset Your Password</a></p>
  </body>
</html>
```

Here, as part of the `sendEmail()` method in `/lib/email/send.js`, tags like `<%= emailAddress %>` are populated dynamically using EJS (in conjunction with the passed `templateVars` object). For example, when sending the password reset email:

```
await sendEmail({
  to: args.emailAddress,
  from: settings?.support?.email,
  subject: "Reset Your Password",
  template: "reset-password",
  templateVars: {
    emailAddress: args.emailAddress,
    resetLink,
  },
});
```

Here, the `templateVars.emailAddress` value is dynamically populated into the `reset-password.html` template where you see the tag `<%= emailAddress %>`. This is automatically handled for you as part of the `/lib/email/send.js` function.

When a password reset is requested, this email is sent to the email typed into front-end of your app. If you'd like to see an example of this, check out the [Recover Password page in the CheatCode Next.js Boilerplate](https://github.com/cheatcode/nextjs-boilerplate/blob/master/pages/recover-password/index.js).

In the email sent to users, a reset URL is included, along with a dynamically generated token that is set on the user temporarily in the database. When they visit this link, they're prompted for two values: a new password and a repeat of that new password. If you'd like to see an example of this, check out the [Recover Password page in the CheatCode Next.js Boilerplate](https://github.com/cheatcode/nextjs-boilerplate/blob/master/pages/recover-password/index.js).

Once these are passed to the server, the user's password is reset with a hashed copy of the password (using bcrypt, same as signup) and updated in the database. Also, similar to signup and login, a JWT token is created and set on the browser's cookies with a new expiration date (30 days from the reset).

### Settings

To assist in the management of client-side settings (things like API keys, configuration, etc.), a helper method and pattern are included in the boilerplate in the `/lib/settings.js` file of the project.

The settings for your application are assumed to be loaded in the environment variables for your app, in the `APP_SETTINGS` variable. If you look in the `webpack.config.js` file at the root of the project, you can see this taking place via the call to `webpack.DefinePlugin.runtimeValue` which ensures this value is set properly in development.

In production, it's your responsibility to ensure that the contents of your settings file are properly set on your hosting infrastructure's environment variables.

> Note: Guidance on how to do this for various platforms will be added over time. If you need instructions for a specific platform, [create a Feature Request issue](https://github.com/cheatcode/nodejs-server-boilerplate) on this project's Github repository explaining the platform you'd like to see documented.

The app contains two settings files:

- `settings-development.json` - A file exporting an object, `settings` that contains the settings for your development environment.
- `settings-production.json` - An assumed file exporting an object, `settings`, that contains the settings for your production environment. This file is assumed because it is _not_ committed to your Git repository as a matter of security (you can change this in the `.gitignore` file at the root of the project).

If you want to use settings in your project, you can import the `/lib/settings.js` file from your settings directory like this:

```
// Example: /lib/mongodb.js

[...]]
import settings from "./settings";

[...]

const getConnectionOptions = () => {
  try {
    const mongodbSettings = settings?.databases?.mongodb;
    const uri = mongodbSettings?.uri;

    [...]
  } catch (exception) {
    cleanupMongoDBProcess();
    console.log(exception);
  }
};

[...]
```

You can customize your settings file however you'd like. If you change names or locations of settings, make sure to update the paths in your source code (e.g., in the MongoDB example above, `settings.databases.mongodb` must be defined in order for your MongoDB connection to work).

### Fixtures

To aid in the development process, the boilerplate includes an example fixture (a function for generating test data in your app) for the users collection. This creates a single user with the email address `admin@admin.com` and a password of `password`.

```javascript
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
```

Fixture functions are imported into `/api/fixtures/index.js`. _This_ file (`/api/fixtures/index.js`) is then imported into the `/lib/startup.js` file to ensure that fixtures run on server startup.

### FAQ

**Does this boilerplate work with Windows?**

Yes. v0.6.0 introduced proper support. The [`cross-env` package](https://npmjs.com/package/cross-env) is used to run the NPM scripts necessary for running the dev server, creating builds, and running tests.

If something you expect to be supported is not on your platform, please [file a bug report on the Github repo](https://github.com/cheatcode/nodejs-server-boilerplate/issues/new).

> **Note**: Current Windows testing is only being done on Windows 10.

### Contributing

<blockquote>
<h4 style="margin:0 0 10px;">Please Follow Instructions</h4>
<p style="margin:0;">If you don't follow these instructions, your proposal will be closed immediately.</p>
</blockquote>

The primary goal of this project is to server as a foundation for tutorials and courses offered on [CheatCode](https://cheatcode.co). In order to offer a relatively consistent API, changes are limited to bug fixes and feature additions. As a result **limited contributions are accepted to this boilerplate**.

While you're welcome to submit a pull request, likelihood of acceptance is limited. **If you have an idea for something you'd like to contribute, it's best to submit a Feature Request issue with a type of `proposal` in the issues tab of this repo**. There we can discuss the idea and any long-term considerations or changes before we greenlight the implementation.

### License

MIT

Copyright © 2021 CheatCode

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
