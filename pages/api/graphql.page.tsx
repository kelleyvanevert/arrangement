import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ApolloServer, gql } from "apollo-server-micro";
import { Pool } from "pg";
import { pool } from "./lib/database";

const secret = process.env.SECRET!;
if (!secret) {
  throw new Error("SECRET not provided");
}

type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
};

type Context = {
  pool: Pool;
  user?: User;
};

const typeDefs = gql`
  type Query {
    me: User
    serverTime: Int!
  }
  type Mutation {
    login(email: String!, password: String!): AuthResult!
  }
  type AuthResult {
    token: String!
  }
  type User {
    id: Int!
    email: String!
    name: String!
  }
`;

const resolvers = {
  Query: {
    async me(parent: any, args: any, { pool, user }: Context) {
      return user;
    },
    serverTime() {
      return Date.now();
    },
  },
  Mutation: {
    async login(parent: any, { email, password }: any, { pool }: Context) {
      const passwordHash = crypto
        .createHash("md5")
        .update(password)
        .digest("hex");

      const res = await pool.query(
        `select * from "users" where "email" = $1 and "password_hash" = $2`,
        [email, passwordHash]
      );

      const user = res.rows[0];
      if (!user) {
        throw new Error("Email/password combo not known");
      }

      return {
        token: jwt.sign({ userId: user.id }, secret),
      };
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  async context({
    req,
    res,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
  }): Promise<Context> {
    let user: User | undefined;

    const auth = req.headers["authorization"];
    if (auth) {
      try {
        const { userId } = jwt.verify(
          auth.replace(/bearer[ ]*/, ""),
          secret
        ) as any;
        const res = await pool.query(`select * from "users" where "id" = $1`, [
          userId,
        ]);
        user = res.rows[0];
        if (!user) {
          throw new Error();
        }
      } catch (error) {
        throw new Error("Invalid or expired token.");
      }
    }

    return {
      pool,
      user,
    };
  },
});

const apolloHandlerPromise = apolloServer.start().then(async () => {
  return apolloServer.createHandler({
    path: "/api/graphql",
  });
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Accept-Language, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await (
    await apolloHandlerPromise
  )(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
