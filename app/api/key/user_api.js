// Review: File should be located in app/api/users
// Review: Route handlers must be named route.tsx

// Review: Prisma should not be used anywhere except models
// Review: Prisma generates UUID keys automatically, see default values in @/prisma/schema/user.prisma
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Review: Don't make your own prisma client, import the singleton from @/prisma/dbClient.ts (see @/model/userModel.ts for example)
const prisma = new PrismaClient();

// Review: Functions in a route handler file should be named after the HTTP action they handle. See @/app/api/key/route.ts for example
// Review: Make sure you are using TypeScript annotations
// Review: Keep styling consistent with other route handlers (curly braces on new line, etc)
// Review: Add docstring with function information as seen in other route handlers
// Review: Response should not be passed into the handler function
export default async function handler(req, res) {
  if (req.method === 'POST') {

    // Review: This will throw an error if the body contains syntax errors.
    // See @/app/api/key/route.ts for proper request parsing.
    const { username, email, password } = req.body;

    // Review: See @/app/api/key/route.ts for the proper way to send a response.
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Invalid request data or malformed body',
        error: 'Missing required fields',
      });
    }

    // Review: Do not make database calls in the api route handler
    // Review: Ensure data is validated before being passed to the database.
    // See @/app/api/key/route.ts for proper validation using a JOI object.
    try {
      // Create user in the database
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password, // Ideally, hash the password before saving
          apiKey: uuidv4(),
        },
      });

      return res.status(201).json({
        code: 201,
        payload: {
          ApiKey: {
            schema: {
              apiKey: user.apiKey,
              userId: user.id,
            },
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  return res.status(401).json({
    message: 'Unauthorized',
    error: 'Invalid request method',
  });
}
