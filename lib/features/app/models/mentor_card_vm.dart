/// View model for mentor card
class MentorCardVm {
  final String mentorId;
  final String name;
  final String expertise;
  final String? imageUrl;

  MentorCardVm({
    required this.mentorId,
    required this.name,
    required this.expertise,
    this.imageUrl,
  });
}

