import { JwtPayload } from "jsonwebtoken";

/* This code snippet is extending the `Express` namespace in TypeScript to add a new property `user` to
the `Request` interface. The `user` property is defined to have the type `JwtPayload`, which is
typically used to store the decoded information from a JSON Web Token (JWT). By adding this property
to the `Request` interface, it allows you to access the decoded JWT payload directly from the
`Request` object in your Express routes without having to manually cast it each time. */

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
