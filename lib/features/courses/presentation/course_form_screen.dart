import 'package:flutter/material.dart';

class CourseFormScreen extends StatefulWidget {
  final String? courseId;
  const CourseFormScreen({super.key, this.courseId});

  @override
  State<CourseFormScreen> createState() => _CourseFormScreenState();
}

class _CourseFormScreenState extends State<CourseFormScreen> {
  final _formKey = GlobalKey<FormState>();
  String title = '';
  String description = '';
  // TODO: Add controllers for video, PDF, quiz, etc.

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: Text(widget.courseId == null ? 'Add Course' : 'Edit Course'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: 'Title'),
                onSaved: (v) => title = v ?? '',
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Description'),
                onSaved: (v) => description = v ?? '',
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
              // TODO: Add fields for video, PDF, quiz upload
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _submit,
                child: Text(widget.courseId == null ? 'Create' : 'Update'),
              ),
              if (widget.courseId != null)
                TextButton(
                  onPressed: _delete,
                  child: const Text('Delete', style: TextStyle(color: Colors.red)),
                ),
            ],
          ),
        ),
      ),
    );

  void _submit() async {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();
      // TODO: Call CourseService to save
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Saved!')));
    }
  }

  void _delete() async {
    // TODO: Call CourseService to delete
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Deleted!')));
  }
} 




