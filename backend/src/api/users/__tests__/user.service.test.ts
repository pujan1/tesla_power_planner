import userService from '../user.service';
import userRepository from '../user.repository';
import ApiError from '../../../utils/ApiError';

// Mock the repository layer
jest.mock('../user.repository');

describe('UserService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = { username: 'testuser', password: 'password123', name: 'Test User' };
      
      (userRepository.checkUserExists as jest.Mock).mockResolvedValue(false);
      (userRepository.createUser as jest.Mock).mockResolvedValue({ 
        ...userData, 
        language: 'en', 
        theme: 'dark' 
      });

      const result = await userService.createUser(userData);

      expect(userRepository.checkUserExists).toHaveBeenCalledWith('testuser');
      expect(userRepository.createUser).toHaveBeenCalled();
      expect(result.username).toBe('testuser');
      expect(result.language).toBe('en');
    });

    it('should throw error if username is missing', async () => {
      const userData = { password: 'password123', name: 'Test User' };
      
      await expect(userService.createUser(userData as any))
        .rejects.toThrow('Username, password, and name are required');
    });

    it('should throw error if user already exists', async () => {
      const userData = { username: 'testuser', password: 'password123', name: 'Test User' };
      (userRepository.checkUserExists as jest.Mock).mockResolvedValue(true);

      await expect(userService.createUser(userData))
        .rejects.toThrow('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should return user for correct credentials', async () => {
      const user = { username: 'testuser', password: 'password123' };
      (userRepository.getUserByUsername as jest.Mock).mockResolvedValue(user);

      const result = await userService.loginUser('testuser', 'password123');

      expect(result).toEqual(user);
    });

    it('should throw 401 for incorrect password', async () => {
      const user = { username: 'testuser', password: 'password123' };
      (userRepository.getUserByUsername as jest.Mock).mockResolvedValue(user);

      await expect(userService.loginUser('testuser', 'wrongpassword'))
        .rejects.toThrow('Invalid username or password');
    });

    it('should throw 401 for non-existent user', async () => {
      (userRepository.getUserByUsername as jest.Mock).mockResolvedValue(null);

      await expect(userService.loginUser('nonexistent', 'anypassword'))
        .rejects.toThrow('Invalid username or password');
    });
  });

  describe('saveSite', () => {
    it('should save a site successfully', async () => {
      const siteData = { id: 'site1', name: 'My Site', devices: [] };
      const user = { 
        username: 'testuser', 
        sites: [siteData] 
      };
      
      (userRepository.saveSite as jest.Mock).mockResolvedValue(user);

      const result = await userService.saveSite('testuser', siteData);

      expect(userRepository.saveSite).toHaveBeenCalledWith('testuser', siteData);
      expect(result).toEqual(siteData);
    });

    it('should throw 400 for invalid site data', async () => {
      const siteData = { id: 'site1' }; // missing name/devices
      
      await expect(userService.saveSite('testuser', siteData as any))
        .rejects.toThrow('Invalid site data');
    });
  });
});
