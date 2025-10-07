// MongoDB initialization script
db = db.getSiblingDB('maternal-health');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        },
        phone: {
          bsonType: 'string',
          pattern: '^\\+?[\\d\\s-()]+$'
        },
        age: {
          bsonType: 'int',
          minimum: 0,
          maximum: 140
        },
        isPregnant: {
          bsonType: 'bool'
        },
        currentWeek: {
          bsonType: 'int',
          minimum: 0,
          maximum: 42
        },
        role: {
          bsonType: 'string',
          enum: ['user', 'admin']
        },
        isActive: {
          bsonType: 'bool'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });
db.users.createIndex({ lastLogin: 1 });

// Create a sample admin user (password: admin123)
db.users.insertOne({
  name: 'Admin User',
  email: 'admin@maternalhealth.rw',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2JL4b4S7vK', // admin123
  role: 'admin',
  isActive: true,
  preferences: {
    language: 'en',
    notifications: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ Database initialized successfully!');
print('📧 Admin email: admin@maternalhealth.rw');
print('🔑 Admin password: admin123');
print('⚠️  Please change the admin password in production!');
