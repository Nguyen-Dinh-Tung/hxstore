import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateProductDto } from '../product/dto/create-product.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
}
