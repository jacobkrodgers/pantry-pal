import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Invalid request data or malformed body',
        error: 'Missing required fields',
      });
    }

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
