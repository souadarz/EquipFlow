import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { Response } from 'express';

// mock du AuthService
const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  getProfile: jest.fn(),
};

//mock de la Response Express
const mockResponse = () => {
  const res: Partial<Response> = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };
  return res as Response;
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: typeof mockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    jest.clearAllMocks();
  });

  // POST /auth/login
  describe('login()', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      _id: 'user-id-123',
      email: 'test@example.com',
      fullname: 'Test User',
    };

    it('devrait valider l\'utilisateur et retourner le user avec un cookie', async () => {
      const res = mockResponse();
      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockResolvedValue({ access_token: 'jwt-token-abc' });

      const result = await controller.login(loginDto, res);

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );

      expect(authService.login).toHaveBeenCalledWith(mockUser);

      expect(res.cookie).toHaveBeenCalledWith('token', 'jwt-token-abc', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 2,
      });

      expect(result).toEqual({ user: mockUser });
    });

    it('devrait propager l\'erreur si validateUser échoue', async () => {
      const res = mockResponse();
      authService.validateUser.mockRejectedValue(new Error('Identifiants invalides'));

      await expect(controller.login(loginDto, res)).rejects.toThrow('Identifiants invalides');
      expect(authService.login).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('devrait propager l\'erreur si login échoue', async () => {
      const res = mockResponse();
      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockRejectedValue(new Error('Erreur génération token'));

      await expect(controller.login(loginDto, res)).rejects.toThrow('Erreur génération token');
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });


  // POST /auth/register
  describe('register()', () => {
    const registerDto: RegisterDto = {
      email: 'newuser@example.com',
      password: 'securePass123',
      fullname: 'New User',
    };

    it('devrait appeler authService.register et retourner le résultat', async () => {
      const mockResult = { id: 'new-user-id', email: registerDto.email };
      authService.register.mockResolvedValue(mockResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockResult);
    });

    it('devrait propager l\'erreur si register échoue', async () => {
      authService.register.mockRejectedValue(new Error('Email déjà utilisé'));

      await expect(controller.register(registerDto)).rejects.toThrow('Email déjà utilisé');
    });
  });

  // POST /auth/logout
  describe('logout()', () => {
    it('devrait effacer le cookie et retourner le message de déconnexion', () => {
      const res = mockResponse();

      const result = controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      expect(result).toEqual({ message: 'Déconnecté' });
    });

    it('devrait utiliser secure:true en production', () => {
      const res = mockResponse();
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  // GET /auth/me
  describe('getProfile()', () => {
    const mockAuthUser = {
      id: 'user-id-123',
      email: 'test@example.com',
    };

    it('devrait retourner le profil de l\'utilisateur courant', async () => {
      const mockProfile = { id: 'user-id-123', email: 'test@example.com', fullname: 'Test User' };
      authService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockAuthUser as any);

      expect(authService.getProfile).toHaveBeenCalledWith(mockAuthUser.id);
      expect(result).toEqual(mockProfile);
    });

    it('devrait propager l\'erreur si getProfile échoue', async () => {
      authService.getProfile.mockRejectedValue(new Error('Utilisateur non trouvé'));

      await expect(controller.getProfile(mockAuthUser as any)).rejects.toThrow('Utilisateur non trouvé');
    });
  });
});