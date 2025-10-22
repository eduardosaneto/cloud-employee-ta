CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  name TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own company"
ON companies FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TABLE icps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  company_size TEXT[],
  revenue_range TEXT[],
  industries TEXT[],
  geographic_regions TEXT[],
  funding_stages TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE icps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own ICPs"
ON icps FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TABLE buyer_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icp_id UUID REFERENCES icps(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT,
  department TEXT,
  pain_points TEXT[]
);
ALTER TABLE buyer_personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own personas"
ON buyer_personas FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  company_name TEXT,
  scraped_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, domain)
);
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own prospects"
ON prospects FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TABLE qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  icp_id UUID REFERENCES icps(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  score INT,
  reasoning TEXT,
  generated_at TIMESTAMPTZ
);
ALTER TABLE qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own qualifications"
ON qualifications FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);