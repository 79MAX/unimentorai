import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/services/gamification_service.dart';
import '../../../core/services/growth_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final currentUser = FirebaseAuth.instance.currentUser;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _countryController = TextEditingController();
  final TextEditingController _languageController = TextEditingController();

  bool _loading = true;
  String _role = 'apprenant';
  bool _privacyConsent = false;
  final TextEditingController _referralCodeController = TextEditingController();
  final GrowthService _growthService = GrowthService();
  List<Map<String, dynamic>> _leaderboard = const [];
  bool _leaderboardLoading = false;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    if (currentUser == null) return;

    final doc = await FirebaseFirestore.instance.collection('users').doc(currentUser!.uid).get();

    if (doc.exists) {
      final data = doc.data()!;
      _nameController.text = data['displayName'] ?? '';
      _countryController.text = data['pays'] ?? '';
      _languageController.text = data['langue'] ?? 'fr';
      _role = data['role'] ?? 'apprenant';
      _privacyConsent = data['privacy_consent'] ?? false;
    }

    setState(() {
      _loading = false;
    });
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;

    await FirebaseFirestore.instance.collection('users').doc(currentUser!.uid).update({
      'displayName': _nameController.text.trim(),
      'pays': _countryController.text.trim(),
      'langue': _languageController.text.trim(),
      'privacy_consent': _privacyConsent,
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Profil mis à jour avec succès !')),
    );
  }

  Future<void> _refreshLeaderboard() async {
    setState(() => _leaderboardLoading = true);
    try {
      final data = await _growthService.getLeaderboard(limit: 10);
      if (!mounted) return;
      setState(() => _leaderboard = data);
    } catch (_) {
      if (!mounted) return;
    } finally {
      if (mounted) setState(() => _leaderboardLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final gamification = GamificationService();

    return Scaffold(
      appBar: AppBar(title: const Text('Mon Profil')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              Semantics(
                label: 'Rôle utilisateur',
                hint: 'Rôle actuel de l’utilisateur',
                child: Text(
                  'Rôle : $_role',
                  style: const TextStyle(fontSize: 16),
                  textScaleFactor: MediaQuery.of(context).textScaleFactor,
                ),
              ),
              const SizedBox(height: 20),
              Semantics(
                label: 'Champ nom complet',
                hint: 'Saisir votre nom complet',
                textField: true,
                child: TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(labelText: 'Nom complet'),
                  validator: (value) => value == null || value.isEmpty ? 'Obligatoire' : null,
                ),
              ),
              const SizedBox(height: 10),
              Semantics(
                label: 'Champ pays',
                hint: 'Saisir votre pays',
                textField: true,
                child: TextFormField(
                  controller: _countryController,
                  decoration: const InputDecoration(labelText: 'Pays'),
                ),
              ),
              const SizedBox(height: 10),
              Semantics(
                label: 'Champ langue préférée',
                hint: 'Saisir votre langue préférée',
                textField: true,
                child: TextFormField(
                  controller: _languageController,
                  decoration: const InputDecoration(labelText: 'Langue préférée (fr, en, sw...)'),
                ),
              ),
              const SizedBox(height: 20),
              Semantics(
                label: 'Consentement à la politique de confidentialité',
                hint: 'Cocher pour accepter la politique de confidentialité',
                toggled: _privacyConsent,
                child: CheckboxListTile(
                  title: Text('J’accepte la politique de confidentialité', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                  value: _privacyConsent,
                  onChanged: (val) {
                    setState(() {
                      _privacyConsent = val ?? false;
                    });
                  },
                ),
              ),
              const SizedBox(height: 20),
              Semantics(
                label: 'Bouton enregistrer',
                hint: 'Enregistrer les modifications du profil',
                button: true,
                child: ElevatedButton(
                  onPressed: _saveProfile,
                  child: Text('Enregistrer', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                ),
              ),
              const SizedBox(height: 20),
              Semantics(
                label: 'Bouton supprimer mon compte',
                hint: 'Supprimer définitivement mon compte et mes données',
                button: true,
                child: ElevatedButton(
                  onPressed: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Supprimer mon compte'),
                        content: const Text('Cette action est irréversible. Voulez-vous vraiment supprimer votre compte et toutes vos données ?'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Annuler')),
                          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Supprimer', style: TextStyle(color: Colors.red))),
                        ],
                      ),
                    );
                    if (confirm == true) {
                      try {
                        final uid = FirebaseAuth.instance.currentUser?.uid;
                        if (uid != null) {
                          await FirebaseFirestore.instance.collection('users').doc(uid).delete();
                          await FirebaseAuth.instance.currentUser?.delete();
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Compte supprimé.')));
                            Navigator.of(context).pushReplacementNamed('/login');
                          }
                        }
                      } catch (e) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur suppression : $e')));
                        }
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                  child: Text('Supprimer mon compte', textScaleFactor: MediaQuery.of(context).textScaleFactor),
                ),
              ),
              const SizedBox(height: 20),
              Semantics(
                label: 'Lien politique de confidentialité',
                hint: 'Ouvrir la politique de confidentialité dans le navigateur',
                link: true,
                child: TextButton(
                  onPressed: () async {
                    const url = 'https://unimentorai.com/privacy'; // À adapter selon ta politique
                    if (await canLaunchUrl(Uri.parse(url))) {
                      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
                    }
                  },
                  child: Text(
                    'Politique de confidentialité',
                    textScaleFactor: MediaQuery.of(context).textScaleFactor,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text('🔥 Croissance & Engagement', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _referralCodeController,
                      decoration: const InputDecoration(
                        labelText: 'Code parrainage',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () async {
                      try {
                        await _growthService.applyReferralCode(_referralCodeController.text.trim());
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Code parrainage appliqué.')),
                          );
                        }
                      } catch (e) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Erreur code parrainage : $e')),
                          );
                        }
                      }
                    },
                    child: const Text('Appliquer'),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                children: [
                  OutlinedButton.icon(
                    onPressed: () async {
                      try {
                        final code = await _growthService.createReferralCode();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Votre code: $code')),
                          );
                        }
                      } catch (e) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Erreur génération code : $e')),
                          );
                        }
                      }
                    },
                    icon: const Icon(Icons.share),
                    label: const Text('Générer mon code'),
                  ),
                  OutlinedButton.icon(
                    onPressed: () async {
                      await _growthService.joinWeeklyChallenge('default_weekly');
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Inscription au défi hebdomadaire confirmée.')),
                        );
                      }
                    },
                    icon: const Icon(Icons.emoji_events),
                    label: const Text('Défi hebdo'),
                  ),
                  OutlinedButton.icon(
                    onPressed: () async {
                      await _growthService.logLearningActivity(courseId: 'self_learning', studyMinutes: 15);
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Activité d’étude enregistrée.')),
                        );
                      }
                    },
                    icon: const Icon(Icons.local_fire_department),
                    label: const Text('Mettre à jour streak'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('🏆 Leaderboard', style: Theme.of(context).textTheme.titleMedium),
                  TextButton(onPressed: _refreshLeaderboard, child: const Text('Actualiser')),
                ],
              ),
              if (_leaderboardLoading)
                const LinearProgressIndicator()
              else if (_leaderboard.isEmpty)
                const Text('Aucun classement disponible pour le moment.')
              else
                ..._leaderboard.map((row) => ListTile(
                      dense: true,
                      leading: Text('#${row['rank'] ?? '-'}'),
                      title: Text((row['display_name'] ?? 'Etudiant').toString()),
                      trailing: Text('🔥 ${(row['streak'] ?? 0).toString()}'),
                    )),
              const SizedBox(height: 24),
              Text('🎖️ Badges', style: Theme.of(context).textTheme.titleLarge),
              StreamBuilder<QuerySnapshot>(
                stream: gamification.getUserBadges(currentUser!.uid),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                    return const Text('Aucun badge débloqué.');
                  }
                  final badges = snapshot.data!.docs;
                  return Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: badges.map((doc) {
                      final data = doc.data() as Map<String, dynamic>;
                      return Chip(
                        avatar: const Icon(Icons.emoji_events, color: Colors.amber),
                        label: Text('${data['badgeId']}\n${data['motif']}\n${(data['date'] as Timestamp?)?.toDate().toString().split(" ")[0] ?? ''}'),
                        labelStyle: const TextStyle(fontSize: 12),
                        backgroundColor: Colors.amber[50],
                      );
                    }).toList(),
                  );
                },
              ),
              const SizedBox(height: 24),
              Text('📜 Certificats', style: Theme.of(context).textTheme.titleLarge),
              StreamBuilder<QuerySnapshot>(
                stream: gamification.getUserCertificates(currentUser!.uid),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                    return const Text('Aucun certificat obtenu.');
                  }
                  final certs = snapshot.data!.docs;
                  return Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: certs.map((doc) {
                      final data = doc.data() as Map<String, dynamic>;
                      return Chip(
                        avatar: const Icon(Icons.workspace_premium, color: Colors.blue),
                        label: Text('${data['certificateId']}\n${data['motif']}\n${(data['date'] as Timestamp?)?.toDate().toString().split(" ")[0] ?? ''}'),
                        labelStyle: const TextStyle(fontSize: 12),
                        backgroundColor: Colors.blue[50],
                      );
                    }).toList(),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}





