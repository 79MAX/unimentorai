class CourseModel {
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final String instructor;
  final double price;
  final int lessons;
  final double rating;

  const CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.instructor,
    required this.price,
    required this.lessons,
    required this.rating,
  });

  factory CourseModel.fromMap(Map<String, dynamic> map) => CourseModel(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      imageUrl: map['imageUrl'] ?? '',
      instructor: map['instructor'] ?? '',
      price: (map['price'] ?? 0).toDouble(),
      lessons: map['lessons'] ?? 0,
      rating: (map['rating'] ?? 0).toDouble(),
    );

  Map<String, dynamic> toMap() => {
      'id': id,
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'instructor': instructor,
      'price': price,
      'lessons': lessons,
      'rating': rating,
    };

  CourseModel copyWith({
    String? id,
    String? title,
    String? description,
    String? imageUrl,
    String? instructor,
    double? price,
    int? lessons,
    double? rating,
  }) => CourseModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      instructor: instructor ?? this.instructor,
      price: price ?? this.price,
      lessons: lessons ?? this.lessons,
      rating: rating ?? this.rating,
    );
}




