import 'package:flutter/material.dart';

class AccessibleButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final FocusNode? focusNode;
  final bool autofocus;

  const AccessibleButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.focusNode,
    this.autofocus = false,
  });

  @override
  Widget build(BuildContext context) => Semantics(
      button: true,
      label: label,
      child: ElevatedButton(
        focusNode: focusNode,
        autofocus: autofocus,
        onPressed: onPressed,
        child: Text(label),
      ),
    );
} 




