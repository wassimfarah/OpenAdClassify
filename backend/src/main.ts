import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser'; // Import body-parser

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    credentials: true, // Allow sending credentials (cookies) with requests
    // Note: Using '*' for 'origin' is not allowed when 'credentials' is true.
    //       This is because browsers enforce that 'Access-Control-Allow-Origin'
    //       cannot be a wildcard '*' when credentials (cookies, HTTP authentication) are included.
  });

  // Global validation pipe to validate and transform incoming request payloads
  app.useGlobalPipes(new ValidationPipe());

  // Middleware to parse cookies
  app.use(cookieParser());

  // Middleware to parse URL-encoded payloads
  app.use(bodyParser.urlencoded({ extended: true }));

  const port = process.env.PORT; // Default to port 3000 if not specified
  await app.listen(port);
  console.log(`Server is running on port ${port}`); // Log message indicating server is running
}
bootstrap();
