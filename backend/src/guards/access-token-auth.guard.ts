import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createErrorResponse } from 'src/utils/common/response.util';

@Injectable()
export class AccessTokenAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies?.['access_token']; // Retrieve access_token from cookies

    if (!accessToken) {
      // Use createErrorResponse for missing access token and throw HttpException
      throw new HttpException(
        createErrorResponse(
          'Access token is missing',
          'No access token provided',
          HttpStatus.UNAUTHORIZED,
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const secretKey = this.configService.get<string>('JWT_ACCESS_SECRET');
      const payload = this.jwtService.verify(accessToken, { secret: secretKey });
      request.user = payload; // Attach the decoded token payload to the request object

      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException(
          createErrorResponse(
            'Access token has expired',
            'Expired token',
            HttpStatus.FORBIDDEN,
          ),
          HttpStatus.FORBIDDEN,
        );
      }
      throw new HttpException(
        createErrorResponse(
          'Invalid access token',
          'Token verification failed',
          HttpStatus.UNAUTHORIZED,
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
