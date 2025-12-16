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

-- Auth Sessions (V2 - Refresh Tokens)
CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
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
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'rejected')),
  is_premium BOOLEAN DEFAULT FALSE
);

-- Content Hub Table (V1 Legacy + V2 Extended)
CREATE TABLE IF NOT EXISTS content_hub (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('pdf', 'video', 'reel', 'course')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'paid', 'private')),
  subject VARCHAR(100),
  grade_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content Collections (V2 - Creator Hub/Courses)
CREATE TABLE IF NOT EXISTS content_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings Table (V2 - Finite State Machine Support)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES users(id),
  student_id UUID REFERENCES users(id),
  type VARCHAR(20) CHECK (type IN ('trial', 'paid')),
  status VARCHAR(25) DEFAULT 'scheduled' CHECK (status IN ('requested', 'accepted', 'scheduled', 'completed', 'cancelled', 'disputed', 'rejected', 'refunded')),
  session_time TIMESTAMP NOT NULL,
  price DECIMAL(10, 2),
  escrow_status VARCHAR(20) DEFAULT 'held' CHECK (escrow_status IN ('held', 'released', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Escrow Accounts (V2 - Funds Management)
CREATE TABLE IF NOT EXISTS escrow_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'held',
    release_condition TEXT, -- e.g., 'completion_confirmed'
    release_date TIMESTAMP,
    dispute_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Messages Table (V2 - Smart Chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  text TEXT,
  attachments TEXT[],
  msg_type VARCHAR(20) DEFAULT 'text', -- text, system, offer, file
  metadata JSONB, -- AI summaries, offer details
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Offers (V2 - Negotiation)
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id), -- Optional: if negotiating a specific booking request
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, countered
    terms JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pricing Snapshots (V2 - AI Pricing)
CREATE TABLE IF NOT EXISTS pricing_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID REFERENCES users(id),
    subject VARCHAR(100),
    market_rate_avg DECIMAL(10, 2),
    demand_score DECIMAL(5, 2),
    suggested_price_min DECIMAL(10, 2),
    suggested_price_max DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
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
