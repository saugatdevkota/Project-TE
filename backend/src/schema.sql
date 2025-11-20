-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role VARCHAR(20) CHECK (role IN ('student', 'tutor', 'admin')) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  profile_photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tutor Profiles Table
CREATE TABLE IF NOT EXISTS tutor_profiles (
  tutor_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  subjects TEXT[], -- Array of strings
  languages TEXT[],
  hourly_rate DECIMAL(10, 2),
  ai_suggested_rate DECIMAL(10, 2),
  verification_score INTEGER DEFAULT 0,
  years_experience INTEGER,
  qualification_docs TEXT[],
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'rejected'))
);

-- Content Hub Table
CREATE TABLE IF NOT EXISTS content_hub (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('pdf', 'video', 'reel', 'course')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'paid', 'private'))
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES users(id),
  student_id UUID REFERENCES users(id),
  type VARCHAR(20) CHECK (type IN ('trial', 'paid')),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'disputed')),
  session_time TIMESTAMP NOT NULL,
  price DECIMAL(10, 2),
  escrow_status VARCHAR(20) DEFAULT 'held' CHECK (escrow_status IN ('held', 'released', 'refunded'))
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  text TEXT,
  attachments TEXT[],
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES users(id),
  student_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) DEFAULT 0.00
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(user_id),
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('deposit', 'withdrawal', 'payment', 'refund')),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
