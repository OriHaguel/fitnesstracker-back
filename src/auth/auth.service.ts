import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserCrudService } from 'src/users/userCrud.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userCrudService: UserCrudService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(gmail: string, password: string): Promise<any> {
    const user = await this.userCrudService.getByUsername(gmail);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = { gmail: user.gmail, sub: user._id };
    const token = this.jwtService.sign(payload);

    // Set HTTP-only cookie
    response.cookie('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 * 365 * 10,
    });

    return user
  }

  async signup(createUserDto: CreateUserDto, response: Response) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user with hashed password
    const newUser = await this.userCrudService.add({
      ...createUserDto,
      password: hashedPassword,
    });

    // Generate JWT token
    const payload = { gmail: newUser.gmail, sub: newUser._id };
    const token = this.jwtService.sign(payload);

    // Set HTTP-only cookie
    response.cookie('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 * 365 * 10,
    });

    // Return user data without sensitive information
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  async logout(response: Response) {
    response.clearCookie('jwt_token');
    return { message: 'Logout successful' };
  }

  async getLoggedInUser(request: any) {

    try {
      const token = request.cookies?.jwt_token;  // Changed from request['cookies']?.['jwt_token']

      if (!token) {
        // throw new Error('No token found');
        return null
      }

      // Verify the token
      const decoded = this.jwtService.verify(token);
      // // Get user from database using the decoded token
      const user = await this.userCrudService.getById(decoded.sub);


      if (!user) {
        // throw new Error('User not found');
        return null

      }

      // Return user without password
      const { password, ...userWithoutPassword } = user.toObject();
      return {
        status: 'success',
        user: userWithoutPassword
      };

    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}