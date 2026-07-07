import '../repositories/auth_repository.dart';
import '../entities/user_entity.dart';

class GoogleSignInUseCase {
  GoogleSignInUseCase(this.repository);

  final AuthRepository repository;

  Future<UserEntity> call() => repository.signInWithGoogle();
}
