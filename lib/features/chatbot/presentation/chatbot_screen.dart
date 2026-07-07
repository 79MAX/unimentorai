import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'services/chatbot_service.dart';
import '../../../core/services/gamification_service.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final ChatbotService _service = ChatbotService();
  final TextEditingController _controller = TextEditingController();
  String? _sessionId; // À remplacer par une vraie session utilisateur
  String? _userId; // À remplacer par l'auth réelle
  String _lang = 'fr';
  bool _sending = false;
  final GamificationService _gamification = GamificationService();
  bool _badgeAwarded = false;

  @override
  void initState() {
    super.initState();
    // TODO: Générer ou récupérer la sessionId et userId réels
    _sessionId = 'demoSession';
    _userId = 'demoUser';
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  void _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _sessionId == null || _userId == null) return;
    setState(() => _sending = true);
    // Envoi du message utilisateur
    final docRef = await FirebaseFirestore.instance
        .collection('chatbot_sessions')
        .doc(_sessionId!)
        .collection('messages')
        .add({
      'userId': _userId!,
      'message': text,
      'lang': _lang,
      'timestamp': FieldValue.serverTimestamp(),
      'from': 'user',
      'moderated': false,
    });
    await _service.autoModerateMessage(
      sessionId: _sessionId!,
      messageId: docRef.id,
      message: text,
      userId: _userId!,
    );
    // Compter les messages utilisateur pour la gamification
    final userMsgCount = (await FirebaseFirestore.instance
        .collection('chatbot_sessions')
        .doc(_sessionId!)
        .collection('messages')
        .where('userId', isEqualTo: _userId!)
        .get()).docs.length;
    if (!_badgeAwarded && userMsgCount >= 10) {
      await _gamification.addBadgeToUser(
        userId: _userId!,
        badgeId: 'chatbot_explorer',
        motif: 'A envoyé 10 messages au chatbot',
        source: 'chatbot',
      );
      setState(() => _badgeAwarded = true);
      _showSnack('🎉 Badge "Chatbot Explorer" débloqué !');
    }
    _controller.clear();
    _showSnack('Message envoyé');
    // Appel IA et enregistrement réponse bot
    final botReply = await _service.generateBotReply(userMessage: text, lang: _lang);
    final botDocRef = await FirebaseFirestore.instance
        .collection('chatbot_sessions')
        .doc(_sessionId!)
        .collection('messages')
        .add({
      'userId': 'bot',
      'message': botReply,
      'lang': _lang,
      'timestamp': FieldValue.serverTimestamp(),
      'from': 'bot',
      'moderated': true,
    });
    await _service.autoModerateMessage(
      sessionId: _sessionId!,
      messageId: botDocRef.id,
      message: botReply,
      userId: 'bot',
    );
    setState(() => _sending = false);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Assistant IA / Chatbot')),
      body: Column(
        children: [
          Expanded(
            child: _sessionId == null
                ? const Center(child: CircularProgressIndicator())
                : StreamBuilder<QuerySnapshot>(
                    stream: _service.getMessages(_sessionId!),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      }
                      if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                        return const Center(child: Text('Aucune conversation.'));
                      }
                      final messages = snapshot.data!.docs;
                      return ListView.builder(
                        reverse: true,
                        itemCount: messages.length,
                        itemBuilder: (ctx, i) {
                          final data = messages[messages.length - 1 - i].data() as Map<String, dynamic>;
                          final isUser = data['from'] == 'user';
                          final moderated = data['moderated'] == true;
                          return Align(
                            alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                            child: Card(
                              color: isUser ? Colors.blue[50] : Colors.grey[200],
                              margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
                              child: ListTile(
                                title: Row(
                                  children: [
                                    Expanded(child: Text(data['message'] ?? '', style: const TextStyle(fontSize: 16))),
                                    if (data['moderated'] == false)
                                      const Icon(Icons.warning, color: Colors.red, size: 18),
                                  ],
                                ),
                                subtitle: Row(
                                  children: [
                                    Text(isUser ? 'Vous' : 'Bot', style: const TextStyle(fontSize: 12)),
                                    const SizedBox(width: 8),
                                    Text('[' + (data['lang'] ?? 'fr').toUpperCase() + ']', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                    if (data['moderated'] == true)
                                      const Padding(
                                        padding: EdgeInsets.only(left: 8.0),
                                        child: Icon(Icons.shield, size: 16, color: Colors.green),
                                      ),
                                    if (data['moderated'] == false)
                                      const Padding(
                                        padding: EdgeInsets.only(left: 8.0),
                                        child: Text('Message signalé', style: TextStyle(color: Colors.red, fontSize: 12)),
                                      ),
                                    IconButton(
                                      icon: const Icon(Icons.flag, size: 16, color: Colors.orange),
                                      tooltip: 'Signaler ce message',
                                      onPressed: () {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text('Message signalé à la modération.')),
                                        );
                                        // TODO: Ajouter une logique de signalement avancée si besoin
                                      },
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    enabled: !_sending,
                    decoration: const InputDecoration(
                      hintText: 'Écrivez votre message...',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                DropdownButton<String>(
                  value: _lang,
                  items: const [
                    DropdownMenuItem(value: 'fr', child: Text('FR')),
                    DropdownMenuItem(value: 'en', child: Text('EN')),
                    DropdownMenuItem(value: 'sw', child: Text('Swahili')),
                    DropdownMenuItem(value: 'wo', child: Text('Wolof')),
                    DropdownMenuItem(value: 'bm', child: Text('Bambara')),
                    DropdownMenuItem(value: 'ha', child: Text('Haoussa')),
                    DropdownMenuItem(value: 'ln', child: Text('Lingala')),
                    DropdownMenuItem(value: 'ar', child: Text('Arabe')),
                    DropdownMenuItem(value: 'pt', child: Text('Portugais')),
                    DropdownMenuItem(value: 'es', child: Text('Espagnol')),
                  ],
                  onChanged: (v) => setState(() => _lang = v ?? 'fr'),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: _sending
                      ? const CircularProgressIndicator()
                      : const Icon(Icons.send),
                  onPressed: _sending ? null : _sendMessage,
                  tooltip: 'Envoyer',
                ),
              ],
            ),
          ),
        ],
      ),
    );
} 





