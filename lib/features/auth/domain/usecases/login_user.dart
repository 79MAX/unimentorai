import '../repositories/auth_repository.dart';
import '../entities/user_entity.dart';

class LoginUser {
  LoginUser(this.repository);

  final AuthRepository repository;

  Future<UserEntity> call(String email, String password) => repository.login(email, password);
}
