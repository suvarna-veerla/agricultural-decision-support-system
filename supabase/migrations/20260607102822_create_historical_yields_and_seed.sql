/*
# Create historical_yields table with sample data

1. New Table: historical_yields - id, crop_name, district, year, yield_per_acre, rainfall_mm, temperature_c, created_at
2. Security: Public read, admin-only write
3. Sample: 60 rows, 12 crops, 5 districts, 2020-2024
*/

CREATE TABLE IF NOT EXISTS historical_yields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL, district text NOT NULL, year integer NOT NULL,
  yield_per_acre double precision NOT NULL, rainfall_mm double precision NOT NULL,
  temperature_c double precision NOT NULL, created_at timestamptz DEFAULT now()
);
ALTER TABLE historical_yields ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_yields" ON historical_yields;
CREATE POLICY "public_read_yields" ON historical_yields FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_yields" ON historical_yields;
CREATE POLICY "admin_write_yields" ON historical_yields FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
DROP POLICY IF EXISTS "admin_update_yields" ON historical_yields;
CREATE POLICY "admin_update_yields" ON historical_yields FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
DROP POLICY IF EXISTS "admin_delete_yields" ON historical_yields;
CREATE POLICY "admin_delete_yields" ON historical_yields FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE INDEX IF NOT EXISTS idx_historical_yields_crop_district ON historical_yields(crop_name, district);

INSERT INTO historical_yields (crop_name, district, year, yield_per_acre, rainfall_mm, temperature_c) VALUES
('Rice','East Godavari',2020,2.8,185,28),('Rice','East Godavari',2021,2.6,160,29),('Rice','East Godavari',2022,2.9,190,28),('Rice','East Godavari',2023,2.5,140,30),('Rice','East Godavari',2024,2.7,175,28),
('Rice','West Godavari',2020,3.0,200,27),('Rice','West Godavari',2021,2.9,195,28),('Rice','West Godavari',2022,3.1,205,27),('Rice','West Godavari',2023,2.8,170,29),('Rice','West Godavari',2024,3.0,195,27),
('Cotton','Guntur',2020,1.9,95,30),('Cotton','Guntur',2021,1.7,75,31),('Cotton','Guntur',2022,2.0,100,29),('Cotton','Guntur',2023,1.6,60,32),('Cotton','Guntur',2024,1.8,85,30),
('Cotton','Kurnool',2020,1.8,70,31),('Cotton','Kurnool',2021,1.5,50,33),('Cotton','Kurnool',2022,1.9,80,30),('Cotton','Kurnool',2023,1.4,45,34),('Cotton','Kurnool',2024,1.7,65,31),
('Chilli','Guntur',2020,1.6,55,29),('Chilli','Guntur',2021,1.4,40,31),('Chilli','Guntur',2022,1.7,60,28),('Chilli','Guntur',2023,1.3,35,32),('Chilli','Guntur',2024,1.5,50,29),
('Groundnut','Anantapur',2020,1.3,60,30),('Groundnut','Anantapur',2021,1.1,40,32),('Groundnut','Anantapur',2022,1.4,65,29),('Groundnut','Anantapur',2023,1.0,35,33),('Groundnut','Anantapur',2024,1.2,55,30),
('Turmeric','Nellore',2020,3.2,110,28),('Turmeric','Nellore',2021,2.9,90,30),('Turmeric','Nellore',2022,3.4,120,27),('Turmeric','Nellore',2023,2.8,80,31),('Turmeric','Nellore',2024,3.1,105,28),
('Sugarcane','Krishna',2020,38,110,28),('Sugarcane','Krishna',2021,35,90,30),('Sugarcane','Krishna',2022,40,120,27),('Sugarcane','Krishna',2023,34,85,31),('Sugarcane','Krishna',2024,37,105,28),
('Maize','Visakhapatnam',2020,3.2,160,27),('Maize','Visakhapatnam',2021,3.0,140,28),('Maize','Visakhapatnam',2022,3.4,170,26),('Maize','Visakhapatnam',2023,2.8,130,29),('Maize','Visakhapatnam',2024,3.1,155,27),
('Red Gram','Kadapa',2020,0.9,65,30),('Red Gram','Kadapa',2021,0.7,45,32),('Red Gram','Kadapa',2022,1.0,70,29),('Red Gram','Kadapa',2023,0.6,40,33),('Red Gram','Kadapa',2024,0.8,60,31),
('Soybean','Nellore',2020,1.3,95,28),('Soybean','Nellore',2021,1.1,75,30),('Soybean','Nellore',2022,1.4,100,27),('Soybean','Nellore',2023,1.0,70,31),('Soybean','Nellore',2024,1.2,90,28),
('Bengal Gram','Kurnool',2020,1.0,35,28),('Bengal Gram','Kurnool',2021,0.8,25,30),('Bengal Gram','Kurnool',2022,1.1,40,27),('Bengal Gram','Kurnool',2023,0.7,20,31),('Bengal Gram','Kurnool',2024,0.9,30,29),
('Wheat','Hyderabad',2020,2.1,50,22),('Wheat','Hyderabad',2021,1.9,40,24),('Wheat','Hyderabad',2022,2.3,55,21),('Wheat','Hyderabad',2023,1.8,35,25),('Wheat','Hyderabad',2024,2.0,45,22);
