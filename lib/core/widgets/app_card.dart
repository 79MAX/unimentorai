import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? color;
  final double radius;
  final bool withBorder;
  final double elevation;
  final bool blur;

  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.color,
    this.radius = 20,
    this.withBorder = true,
    this.elevation = 0,
    this.blur = false,
  });

  @override
  Widget build(BuildContext context) {
    final baseColor = color ?? AppColors.surface.withValues(alpha: 0.55);

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: baseColor,

        // 🎯 centralisation radius (cleaner)
        borderRadius: BorderRadius.circular(radius),

        // 🧠 Border logic clean
        border: withBorder
            ? Border.all(
                color: Colors.white.withValues(alpha: 0.10),
              )
            : null,

        // 🌑 Shadow only when needed
        boxShadow: _buildShadow(),
      ),
      child: child,
    );
  }

  List<BoxShadow>? _buildShadow() {
    if (elevation <= 0) return null;

    return [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.18),
        blurRadius: 24,
        offset: const Offset(0, 10),
      ),
    ];
  }
}

