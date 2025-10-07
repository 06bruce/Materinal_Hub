# 🤖 Maternal Health Hub Chatbot Demo

## 🎯 What You Can Do

Your Maternal Health Hub chatbot is now running and ready to help! Here's what it can do:

### 🌐 **Access the Chatbot**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 💬 **Chat Features**

#### 1. **Pregnancy Advice** 💊
Try asking:
- "I am pregnant and need advice about vitamins"
- "What should I do during my first trimester?"
- "I'm 5 months pregnant, what should I know?"

**Expected Response**: "Your pregnancy is going well. Make sure to take your vitamins daily and attend regular checkups."

#### 2. **Emergency Detection** 🚨
Try asking:
- "I have severe bleeding and pain"
- "I'm having contractions early"
- "I feel dizzy and nauseous"

**Expected Response**: "These are emergency symptoms! Go to the hospital immediately, especially if you have bleeding or severe pain."

#### 3. **Nutrition Guidance** 🥗
Try asking:
- "What foods should I eat during pregnancy?"
- "I need nutrition advice"
- "What should I drink more of?"

**Expected Response**: "Eat a balanced diet with proteins, vegetables, and fruits. Make sure to drink plenty of water."

#### 4. **Kinyarwanda Support** 🇷🇼
Try asking in Kinyarwanda:
- "Ndatwite kandi nshaka kumenya ibyerekeye vitamini"
- "Mfite ububabare n'ingenzi"
- "Nshaka kumenya ibiryo byiza"

**Expected Response**: Appropriate responses in Kinyarwanda based on the topic.

### 🔧 **How It Works**

1. **Primary**: Tries to connect to Chatbase AI for intelligent responses
2. **Fallback**: If Chatbase fails, uses intelligent keyword-based responses
3. **Multi-language**: Supports English and Kinyarwanda
4. **Context-aware**: Detects pregnancy, emergency, and nutrition topics

### 🎮 **Try These Test Messages**

```
English:
- "I am 3 months pregnant, what should I eat?"
- "I have bleeding, is this normal?"
- "What vitamins should I take?"
- "I need emergency help"

Kinyarwanda:
- "Ndatwite amezi 3, ni iki nkagomba kurya?"
- "Mfite amaraso, ni byo bisanzwe?"
- "Ni iyihe vitamini nkagomba kwifata?"
```

### 🛠 **Technical Features**

- ✅ **Intelligent Fallback**: Smart responses when AI is unavailable
- ✅ **Multi-language Support**: English and Kinyarwanda
- ✅ **Topic Detection**: Pregnancy, emergency, nutrition categories
- ✅ **User Persistence**: Remembers conversation context
- ✅ **Error Handling**: Graceful fallbacks for reliability
- ✅ **Rate Limiting**: Prevents abuse
- ✅ **Caching**: Fast response times

### 🚀 **Getting Started**

1. **Open your browser** and go to http://localhost:3000
2. **Navigate to the Chat page** (click the chat icon in navigation)
3. **Start chatting** with any of the test messages above
4. **Try different languages** using the language switcher
5. **Test emergency scenarios** to see how it responds

### 🎯 **Example Conversation**

```
User: "I am pregnant and worried about my diet"
Bot: "Your pregnancy is going well. Make sure to take your vitamins daily and attend regular checkups."

User: "I have severe bleeding"
Bot: "These are emergency symptoms! Go to the hospital immediately, especially if you have bleeding or severe pain."

User: "What foods are good for pregnancy?"
Bot: "Eat a balanced diet with proteins, vegetables, and fruits. Make sure to drink plenty of water."
```

### 🔍 **API Testing**

You can also test the chatbot directly via API:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am pregnant and need advice",
    "language": "en",
    "userId": "test-user"
  }'
```

### 🎉 **Ready to Use!**

Your Maternal Health Hub chatbot is now fully functional with:
- Smart responses
- Multi-language support  
- Emergency detection
- Pregnancy guidance
- Nutrition advice
- Reliable fallbacks

**Start chatting at: http://localhost:3000** 🚀
