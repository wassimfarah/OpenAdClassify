import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService, // Inject ConfigService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log("Testing: Checking secret key");

    // Log the secret key being used by ConfigService
    const secretKey = this.configService.get<string>('JWT_SECRET');
    console.log("Secret Key:", secretKey);

    if (!token) {
      console.log("No token found");
      return false;
    }

    try {
      console.log("Verifying token with secret key:", secretKey);

      const payload = this.jwtService.verify(token, { secret: secretKey }); // Explicitly pass the secret key
      request.user = payload;

      return true;
    } catch (err) {
      console.log("Token verifying error:", err.message);
      return false;
    }
  }
}
