class WebinarModel {
  final String id;
  final String title;
  final String description;
  final DateTime date;

  WebinarModel({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
  });

  factory WebinarModel.fromMap(Map<String, dynamic> map, String id) => WebinarModel(
      id: id,
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      date: map['date'].toDate(),
    );
}




