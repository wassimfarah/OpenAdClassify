export interface JwtPayload {
    sub: number; 
    username: string;
    role: string;
    iat?: number;
    exp?: number;
  }