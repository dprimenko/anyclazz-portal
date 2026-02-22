-- =========================================
-- AnyClazz PostgreSQL Initialization Script
-- Fecha: 27/08/2025
-- =========================================

CREATE SCHEMA IF NOT EXISTS anyclazz;

-- ============================================================
-- Tabla de usuarios
-- ============================================================

CREATE TABLE anyclazz.users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Insertar usuarios base (coinciden con perfiles de students y teachers)
INSERT INTO anyclazz.users (id, email, first_name, last_name) VALUES
    ('550e8400-e29b-41d4-a716-446655440001','alice@student.com', 'Alice', 'Johnson'),
    ('550e8400-e29b-41d4-a716-446655440002','bob@student.com', 'Bob', 'Smith'),
    ('550e8400-e29b-41d4-a716-446655440003','john.doe@anyclazz.com', 'James', 'Mitchell'),
    ('550e8400-e29b-41d4-a716-446655440004','valentina.harper@anyclazz.com', 'Valentina', 'Harper'),
    ('550e8400-e29b-41d4-a716-446655440005','marie.walls@anyclazz.com', 'Marie', 'Walls');



-- ============================================================
-- Tabla de direcciones (addresses)
-- ============================================================
CREATE TABLE anyclazz.addresses (
    id VARCHAR(36) PRIMARY KEY,
    country_iso2 CHAR(2) NOT NULL,
    city_iso2 VARCHAR(10) NOT NULL,
    full_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.addresses (id, country_iso2, city_iso2, full_address) VALUES
    ('550e8400-e29b-41d4-a716-446655440101','es','mad','Calle Mayor 123, Madrid, España'),
    ('550e8400-e29b-41d4-a716-446655440102','es','bcn','Avenida Libertad 456, Barcelona, España');

-- ============================================================
-- Perfiles de estudiantes
-- ============================================================
CREATE TABLE anyclazz.students (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.students (id, email, name, surname, avatar_url) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'alice@student.com', 'Alice', 'Johnson', 'https://fastly.picsum.photos/id/821/200/300.jpg?hmac=-CLZlHMcIt8hXlUFZ4-3AvLYDsUJSwUeTri-zHDlnoA'),
    ('550e8400-e29b-41d4-a716-446655440002', 'bob@student.com', 'Bob', 'Smith', 'https://fastly.picsum.photos/id/717/200/300.jpg?hmac=OJYQhMLNcYlN5qz8IR345SJ7t6A0vyHzT_RdMxO4dSc'),
    ('550e8400-e29b-41d4-a716-446655440005', 'marie.walls@anyclazz.com', 'Marie', 'Walls', 'https://fastly.picsum.photos/id/983/200/300.jpg?hmac=VWTT5PL8-LbE61s9R905V7X4BFr97P-ZFZCzb-Zpj6k');

-- ============================================================
-- Perfiles de profesores (teachers) - actualizado sin columnas de dirección embebidas
-- ============================================================
CREATE TABLE anyclazz.teachers (
    id VARCHAR(36) PRIMARY KEY REFERENCES anyclazz.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL,
    is_super_teacher BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'rejected' CHECK (status IN ('accepted','rejected')),
    short_presentation TEXT,
    video_presentation TEXT,
    about TEXT,
    academic_background TEXT,
    certifications TEXT,
    skills TEXT,
    nationality VARCHAR(2),
    began_teaching_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.teachers (
    id, email, name, surname, avatar, is_super_teacher, short_presentation, video_presentation, about, academic_background, certifications, skills, nationality, began_teaching_at, created_at
) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'john.doe@anyclazz.com', 'James', 'Mitchell', 'https://fastly.picsum.photos/id/45/200/300.jpg?hmac=mW2p9asL-scUozua98sWn1c03g7CYv7w7IIHwnFp4cM', FALSE, 'Hello! My name is James Mitchell, and I''m a certified Spanish teacher from Madrid, Spain. I hold a Master''s degree in Education.', 'https://www.pexels.com/download/video/5752044/', 'Experienced math teacher', NULL, NULL, NULL, 'es', '2015-09-10 10:26:34', '2025-10-07 10:26:34'),
    ('550e8400-e29b-41d4-a716-446655440004', 'valentina.harper@anyclazz.com', 'Valentina', 'Harper', 'https://fastly.picsum.photos/id/35/200/300.jpg?hmac=No1hMogzX_PUqgWDfLRCc4wGPYTIeviBhJbzjqskoMA', TRUE, 'Hello! My name is Valentina Harper, and I''m a certified English teacher based in Madrid, ES. I hold a Master''s degree in Science.', 'https://www.pexels.com/download/video/3252126/', '<p>Valentina Harper is a passionate English teacher with over 12 years of experience instructing students of all ages and backgrounds, ranging from teenagers to professionals seeking to refine their advanced language skills. Born in London and currently residing in New York, Valentina blends a modern pedagogical approach with evidence-based methods rooted in applied linguistics and immersive cultural experiences. Her teaching philosophy emphasizes developing both communicative competence and confidence in using English across academic, professional, and everyday contexts.</p><p>Valentina holds a Master''s degree in Science from the University of London and is TEFL certified. She has worked in various educational settings, including language schools, universities, and corporate training programs. Her expertise spans exam preparation (IELTS, TOEFL, Cambridge), business English, conversational skills, and academic writing.</p>', '<ul><li>PhD in Applied Linguistics with a focus on English as a Second Language, University of Oxford, 2015</li><li>Master''s in Teaching English to Speakers of Other Languages (TESOL), University of Cambridge, 2010</li><li>BA in English Philology, King''s College London, 2008</li></ul>', '<ul><li>CELTA (Certificate in English Language Teaching to Adults), Cambridge, 2009</li><li>Advanced Certificate in Online Teaching and E-Learning, Harvard University, 2020</li></ul>', '<ul><li>Advanced English proficiency (C2)</li><li>Academic and business English</li><li>Exam preparation (IELTS, TOEFL, Cambridge C1/C2)</li><li>Curriculum design and lesson planning</li><li>Cross-cultural communication</li><li>Online and hybrid teaching methods</li></ul>', 'gb', '2015-09-10 10:26:34', '2025-10-07 10:26:34'),
    ('550e8400-e29b-41d4-a716-446655440005', 'marie.walls@anyclazz.com', 'Marie', 'Walls', 'https://fastly.picsum.photos/id/983/200/300.jpg?hmac=VWTT5PL8-LbE61s9R905V7X4BFr97P-ZFZCzb-Zpj6k', TRUE, 'Hello! My name is Marie Walls, and I''m a certified French teacher based in Madrid, ES. I hold a Master''s degree in History.', 'https://www.pexels.com/download/video/3252126/', 'French teacher', NULL, NULL, NULL, 'fr', '2015-09-10 10:26:34', '2025-10-07 10:26:34');
    
-- ============================================================
-- Tabla intermedia user_addresses (usuarios <-> direcciones)
-- ============================================================
CREATE TABLE anyclazz.user_addresses (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES anyclazz.users(id) ON DELETE CASCADE,
    address_id VARCHAR(36) NOT NULL REFERENCES anyclazz.addresses(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, address_id)
);

INSERT INTO anyclazz.addresses (id, country_iso2, city_iso2, full_address) VALUES
    ('550e8400-e29b-41d4-a716-446655440103','es','m','Calle de Alcalá, 42, Madrid, Spain');

INSERT INTO anyclazz.user_addresses (user_id, address_id, is_primary) VALUES
    ('550e8400-e29b-41d4-a716-446655440003','550e8400-e29b-41d4-a716-446655440103', TRUE),
    ('550e8400-e29b-41d4-a716-446655440004','550e8400-e29b-41d4-a716-446655440103', TRUE),
    ('550e8400-e29b-41d4-a716-446655440005','550e8400-e29b-41d4-a716-446655440103', TRUE);

-- ============================================================
-- Tabla de niveles de estudiantes (student_levels)
-- ============================================================
CREATE TABLE anyclazz.student_levels (
    id VARCHAR(36) PRIMARY KEY,
    name JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.student_levels (id, name, is_active) VALUES
    ('01JHTV00-LVLS-0000-0000-000000000001', '{"es": "Niños", "en": "Kids"}', TRUE),
    ('01JHTV00-LVLS-0000-0000-000000000002', '{"es": "Secundaria", "en": "High School"}', TRUE),
    ('01JHTV00-LVLS-0000-0000-000000000003', '{"es": "Universidad", "en": "University"}', TRUE),
    ('01JHTV00-LVLS-0000-0000-000000000004', '{"es": "Adultos", "en": "Adults"}', TRUE);

-- ============================================================
-- Tabla de categorías de asignaturas (subject_categories)
-- ============================================================
CREATE TABLE anyclazz.subject_categories (
    id VARCHAR(36) PRIMARY KEY,
    name JSONB NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.subject_categories (id, name, slug, is_active) VALUES
    ('01JHTV00-0000-0000-0000-000000000001', '{"es": "Educación Académica", "en": "Academic Education"}', 'academic-education', TRUE),
    ('01JHTV00-0000-0000-0000-000000000002', '{"es": "Deportes y Bienestar", "en": "Sports & Wellness"}', 'sports-wellness', TRUE),
    ('01JHTV00-0000-0000-0000-000000000003', '{"es": "Idiomas", "en": "Language"}', 'language', TRUE),
    ('01JHTV00-0000-0000-0000-000000000004', '{"es": "Artes, Manualidades y Hobbies", "en": "Arts, Crafts and Hobbies"}', 'arts-crafts-hobbies', TRUE),
    ('01JHTV00-0000-0000-0000-000000000005', '{"es": "Actividades Cercanas", "en": "Activities Nearby"}', 'activities-nearby', TRUE);

-- ============================================================
-- Tabla de asignaturas (subjects) - actualizada con category_id
-- ============================================================
CREATE TABLE anyclazz.subjects (
    id VARCHAR(36) PRIMARY KEY,
    name JSONB NOT NULL,
    description TEXT NULL,
    category_id VARCHAR(36) REFERENCES anyclazz.subject_categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects de Academic Education (primeros como prueba)
INSERT INTO anyclazz.subjects (id, name, category_id, is_active) VALUES
    ('01JHTV00-SUBJ-CAT1-0001-000000000001', '{"es": "Administración de Empresas", "en": "Business Administration"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0002-000000000002', '{"es": "Psicología", "en": "Psychology"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0003-000000000003', '{"es": "Enfermería", "en": "Nursing"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0004-000000000004', '{"es": "Biología", "en": "Biology"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0005-000000000005', '{"es": "Ciencias de la Computación", "en": "Computer Science"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0006-000000000006', '{"es": "Economía", "en": "Economics"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0007-000000000007', '{"es": "Ingeniería", "en": "Engineering"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0008-000000000008', '{"es": "Contabilidad", "en": "Accounting"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0009-000000000009', '{"es": "Marketing", "en": "Marketing"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0010-000000000010', '{"es": "Ciencias Políticas", "en": "Political Science"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0011-000000000011', '{"es": "Matemáticas", "en": "Mathematics"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0012-000000000012', '{"es": "Historia", "en": "History"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    ('01JHTV00-SUBJ-CAT1-0013-000000000013', '{"es": "Física", "en": "Physics"}', '01JHTV00-0000-0000-0000-000000000001', TRUE),
    -- Subjects de Sports & Wellness
    ('01JHTV00-SUBJ-CAT2-0001-000000000001', '{"es": "Yoga", "en": "Yoga"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0002-000000000002', '{"es": "Pilates", "en": "Pilates"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0003-000000000003', '{"es": "Meditación", "en": "Meditation"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0004-000000000004', '{"es": "Entrenamiento de Fuerza", "en": "Strength training"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0005-000000000005', '{"es": "Fitness Funcional", "en": "Functional fitness"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0006-000000000006', '{"es": "Fitness de Baile", "en": "Dance fitness"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0007-000000000007', '{"es": "Zumba", "en": "Zumba"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0008-000000000008', '{"es": "Boxeo", "en": "Boxing"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0009-000000000009', '{"es": "Sauna", "en": "Sauna"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0010-000000000010', '{"es": "Baño de Hielo", "en": "Cold plunge"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0011-000000000011', '{"es": "Kickboxing", "en": "Kickboxing"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0012-000000000012', '{"es": "Taekwondo", "en": "Taekwondo"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0013-000000000013', '{"es": "Jiu Jitsu", "en": "Jiu Jitsu"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0014-000000000014', '{"es": "Karate", "en": "Karate"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0015-000000000015', '{"es": "CrossFit", "en": "CrossFit"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0016-000000000016', '{"es": "Entrenamiento Personal", "en": "Personal training"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0017-000000000017', '{"es": "Estiramientos y Movilidad", "en": "Stretching and mobility"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0018-000000000018', '{"es": "Técnicas de Respiración", "en": "Breathwork"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0019-000000000019', '{"es": "Tai Chi", "en": "Tai Chi"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0020-000000000020', '{"es": "Qigong", "en": "Qigong"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0021-000000000021', '{"es": "Práctica de Mindfulness", "en": "Mindfulness practice"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0022-000000000022', '{"es": "Gestión del Estrés", "en": "Stress management"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0023-000000000023', '{"es": "Nutrición", "en": "Nutrition"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0024-000000000024', '{"es": "Running", "en": "Running"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0025-000000000025', '{"es": "Ciclismo", "en": "Cycling"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0026-000000000026', '{"es": "Natación", "en": "Swimming"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0027-000000000027', '{"es": "Tenis", "en": "Tennis"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0028-000000000028', '{"es": "Pickleball", "en": "Pickleball"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0029-000000000029', '{"es": "Fútbol", "en": "Soccer"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0030-000000000030', '{"es": "Baloncesto", "en": "Basketball"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0031-000000000031', '{"es": "Golf", "en": "Golf"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0032-000000000032', '{"es": "Escalada", "en": "Climbing"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0033-000000000033', '{"es": "Esquí", "en": "Ski"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0034-000000000034', '{"es": "Surf", "en": "Surf"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0035-000000000035', '{"es": "Remo", "en": "Rowing"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0036-000000000036', '{"es": "Voleibol", "en": "Volleyball"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0037-000000000037', '{"es": "Bádminton", "en": "Badminton"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0038-000000000038', '{"es": "Patinaje sobre Hielo", "en": "Ice skating"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0039-000000000039', '{"es": "Patinaje sobre Ruedas", "en": "Rollerblading"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0040-000000000040', '{"es": "Baile", "en": "Dance"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0041-000000000041', '{"es": "Fitness Aéreo", "en": "Aerial fitness"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0042-000000000042', '{"es": "Pole Fitness", "en": "Pole fitness"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0043-000000000043', '{"es": "Control Respiratorio", "en": "Breath control"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0044-000000000044', '{"es": "Coaching de Bienestar Holístico", "en": "Holistic wellness coaching"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0045-000000000045', '{"es": "Resiliencia Mental", "en": "Mental resilience"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    ('01JHTV00-SUBJ-CAT2-0046-000000000046', '{"es": "Fitness de Aventura al Aire Libre", "en": "Outdoor adventure fitness"}', '01JHTV00-0000-0000-0000-000000000002', TRUE),
    -- Subjects de Language
    ('01JHTV00-SUBJ-CAT3-0001-000000000001', '{"es": "Inglés", "en": "English"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0002-000000000002', '{"es": "Español", "en": "Spanish"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0003-000000000003', '{"es": "Francés", "en": "French"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0004-000000000004', '{"es": "Alemán", "en": "German"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0005-000000000005', '{"es": "Italiano", "en": "Italian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0006-000000000006', '{"es": "Japonés", "en": "Japanese"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0007-000000000007', '{"es": "Chino Mandarín", "en": "Mandarin Chinese"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0008-000000000008', '{"es": "Portugués", "en": "Portuguese"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0009-000000000009', '{"es": "Coreano", "en": "Korean"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0010-000000000010', '{"es": "Ruso", "en": "Russian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0011-000000000011', '{"es": "Árabe", "en": "Arabic"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0012-000000000012', '{"es": "Holandés", "en": "Dutch"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0013-000000000013', '{"es": "Sueco", "en": "Swedish"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0014-000000000014', '{"es": "Noruego", "en": "Norwegian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0015-000000000015', '{"es": "Griego", "en": "Greek"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0016-000000000016', '{"es": "Turco", "en": "Turkish"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0017-000000000017', '{"es": "Polaco", "en": "Polish"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0018-000000000018', '{"es": "Hebreo", "en": "Hebrew"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0019-000000000019', '{"es": "Irlandés (Gaélico)", "en": "Irish (Gaelic)"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0020-000000000020', '{"es": "Hindi", "en": "Hindi"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0021-000000000021', '{"es": "Latín", "en": "Latin"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0022-000000000022', '{"es": "Checo", "en": "Czech"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0023-000000000023', '{"es": "Danés", "en": "Danish"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0024-000000000024', '{"es": "Finlandés", "en": "Finnish"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0025-000000000025', '{"es": "Tailandés", "en": "Thai"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0026-000000000026', '{"es": "Húngaro", "en": "Hungarian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0027-000000000027', '{"es": "Indonesio", "en": "Indonesian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0028-000000000028', '{"es": "Ucraniano", "en": "Ukrainian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0029-000000000029', '{"es": "Vietnamita", "en": "Vietnamese"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0030-000000000030', '{"es": "Suajili", "en": "Swahili"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0031-000000000031', '{"es": "Rumano", "en": "Romanian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0032-000000000032', '{"es": "Tagalo", "en": "Tagalog"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0033-000000000033', '{"es": "Catalán", "en": "Catalan"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0034-000000000034', '{"es": "Malayo", "en": "Malay"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0035-000000000035', '{"es": "Islandés", "en": "Icelandic"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0036-000000000036', '{"es": "Búlgaro", "en": "Bulgarian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0037-000000000037', '{"es": "Croata", "en": "Croatian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0038-000000000038', '{"es": "Serbio", "en": "Serbian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0039-000000000039', '{"es": "Estonio", "en": "Estonian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0040-000000000040', '{"es": "Gaélico Escocés", "en": "Scottish Gaelic"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0041-000000000041', '{"es": "Bengalí", "en": "Bengali"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0042-000000000042', '{"es": "Tamil", "en": "Tamil"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0043-000000000043', '{"es": "Urdu", "en": "Urdu"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0044-000000000044', '{"es": "Galés", "en": "Welsh"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0045-000000000045', '{"es": "Esperanto", "en": "Esperanto"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0046-000000000046', '{"es": "Eslovaco", "en": "Slovak"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    ('01JHTV00-SUBJ-CAT3-0047-000000000047', '{"es": "Lituano", "en": "Lithuanian"}', '01JHTV00-0000-0000-0000-000000000003', TRUE),
    -- Subjects de Arts, Crafts and Hobbies
    ('01JHTV00-SUBJ-CAT4-0001-000000000001', '{"es": "Dibujo", "en": "Drawing"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0002-000000000002', '{"es": "Pintura", "en": "Painting"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0003-000000000003', '{"es": "Técnicas de Acuarela", "en": "Watercolor techniques"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0004-000000000004', '{"es": "Pintura Acrílica", "en": "Acrylic painting"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0005-000000000005', '{"es": "Pintura al Óleo", "en": "Oil painting"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0006-000000000006', '{"es": "Ilustración Digital", "en": "Digital illustration"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0007-000000000007', '{"es": "Diseño Gráfico", "en": "Graphic design"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0008-000000000008', '{"es": "Caligrafía", "en": "Calligraphy"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0009-000000000009', '{"es": "Lettering a Mano", "en": "Hand lettering"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0010-000000000010', '{"es": "Bocetos", "en": "Sketching"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0011-000000000011', '{"es": "Dibujo de Figura", "en": "Figure drawing"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0012-000000000012', '{"es": "Diseño de Personajes", "en": "Character design"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0013-000000000013', '{"es": "Arte de Cómics", "en": "Comic art"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0014-000000000014', '{"es": "Fotografía", "en": "Photography"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0015-000000000015', '{"es": "Costura", "en": "Sewing"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0016-000000000016', '{"es": "Confección de Ropa", "en": "Dressmaking"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0017-000000000017', '{"es": "Tejido", "en": "Knitting"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0018-000000000018', '{"es": "Ganchillo", "en": "Crocheting"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0019-000000000019', '{"es": "Bordado", "en": "Embroidery"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0020-000000000020', '{"es": "Quilting", "en": "Quilting"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0021-000000000021', '{"es": "Macramé", "en": "Macramé"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0022-000000000022', '{"es": "Tejido en Telar", "en": "Weaving"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0023-000000000023', '{"es": "Alfarería", "en": "Pottery"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0024-000000000024', '{"es": "Cerámica", "en": "Ceramics"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0025-000000000025', '{"es": "Escultura en Arcilla", "en": "Clay sculpting"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0026-000000000026', '{"es": "Fabricación de Joyería", "en": "Jewelry making"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0027-000000000027', '{"es": "Trabajo con Cuentas", "en": "Beadwork"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0028-000000000028', '{"es": "Arte con Resina", "en": "Resin art"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0029-000000000029', '{"es": "Fabricación de Velas", "en": "Candle making"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0030-000000000030', '{"es": "Fabricación de Jabón", "en": "Soap making"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0031-000000000031', '{"es": "Marroquinería", "en": "Leathercraft"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0032-000000000032', '{"es": "Carpintería", "en": "Woodworking"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0033-000000000033', '{"es": "Restauración de Muebles", "en": "Furniture restoration"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0034-000000000034', '{"es": "Grabado", "en": "Printmaking"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0035-000000000035', '{"es": "Serigrafía", "en": "Screen printing"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0036-000000000036', '{"es": "Manualidades con Papel", "en": "Paper crafts"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0037-000000000037', '{"es": "Origami", "en": "Origami"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0038-000000000038', '{"es": "Arte de Collage", "en": "Collage art"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0039-000000000039', '{"es": "Arte de Medios Mixtos", "en": "Mixed media art"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0040-000000000040', '{"es": "Encuadernación", "en": "Bookbinding"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0041-000000000041', '{"es": "Arte en Vitrales", "en": "Stained glass art"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0042-000000000042', '{"es": "Arte en Mosaico", "en": "Mosaic art"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0043-000000000043', '{"es": "Diseño de Moda", "en": "Fashion design"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0044-000000000044', '{"es": "Diseño Textil", "en": "Textile design"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0045-000000000045', '{"es": "Floristería", "en": "Floristry"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0046-000000000046', '{"es": "Trabajo en Metal", "en": "Metal crafts"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    ('01JHTV00-SUBJ-CAT4-0047-000000000047', '{"es": "Fabricación de Modelos en Miniatura", "en": "Miniature model making"}', '01JHTV00-0000-0000-0000-000000000004', TRUE),
    -- Subjects de Activities Nearby
    ('01JHTV00-SUBJ-CAT5-0001-000000000001', '{"es": "Guía Turístico", "en": "Touristic Guide"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0002-000000000002', '{"es": "Cata de Vinos", "en": "Wine tasting"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0003-000000000003', '{"es": "Tour Gastronómico", "en": "Food tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0004-000000000004', '{"es": "Clase de Cocina", "en": "Cooking class"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0005-000000000005', '{"es": "Tour a Pie", "en": "Walking tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0006-000000000006', '{"es": "Tour por la Ciudad", "en": "City tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0007-000000000007', '{"es": "Tour de Cervecería", "en": "Brewery tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0008-000000000008', '{"es": "Tour de Destilería", "en": "Distillery tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0009-000000000009', '{"es": "Cata de Café", "en": "Coffee tasting"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0010-000000000010', '{"es": "Visita al Mercado", "en": "Market visit"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0011-000000000011', '{"es": "Cata de Quesos", "en": "Cheese tasting"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0012-000000000012', '{"es": "Tour de Chocolate", "en": "Chocolate tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0013-000000000013', '{"es": "Clase de Mixología", "en": "Mixology class"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0014-000000000014', '{"es": "Cena Local", "en": "Local dinner"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0015-000000000015', '{"es": "Visita a Granja", "en": "Farm visit"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0016-000000000016', '{"es": "Paseo en Barco", "en": "Boat trip"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0017-000000000017', '{"es": "Crucero al Atardecer", "en": "Sunset cruise"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0018-000000000018', '{"es": "Noche de Observación de Estrellas", "en": "Stargazing night"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0019-000000000019', '{"es": "Tour de Fantasmas", "en": "Ghost tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0020-000000000020', '{"es": "Caminata Histórica", "en": "Historical walk"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0021-000000000021', '{"es": "Tour Cultural", "en": "Cultural tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0022-000000000022', '{"es": "Caminata por la Naturaleza", "en": "Nature walk"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0023-000000000023', '{"es": "Caminata de Recolección", "en": "Foraging walk"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0024-000000000024', '{"es": "Cata de Aceite de Oliva", "en": "Olive oil tasting"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0025-000000000025', '{"es": "Ceremonia del Té", "en": "Tea ceremony"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0026-000000000026', '{"es": "Taller de Perfumes", "en": "Perfume workshop"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0027-000000000027', '{"es": "Fabricación de Velas", "en": "Candle making"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0028-000000000028', '{"es": "Taller de Jabón", "en": "Soap workshop"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0029-000000000029', '{"es": "Fundamentos de Jardinería", "en": "Gardening basics"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0030-000000000030', '{"es": "Agricultura Urbana", "en": "Urban farming"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0031-000000000031', '{"es": "Clase de Apicultura", "en": "Beekeeping class"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0032-000000000032', '{"es": "Excursión de Observación de Aves", "en": "Birdwatching trip"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0033-000000000033', '{"es": "Baño de Bosque", "en": "Forest bathing"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0034-000000000034', '{"es": "Retiro de Meditación", "en": "Meditation retreat"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0035-000000000035', '{"es": "Experiencia de Picnic", "en": "Picnic experience"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0036-000000000036', '{"es": "Cena en Granja", "en": "Farm dinner"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0037-000000000037', '{"es": "Recorrido de Comida Callejera", "en": "Street food crawl"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0038-000000000038', '{"es": "Caminata Patrimonial", "en": "Heritage walk"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0039-000000000039', '{"es": "Tour de Arquitectura", "en": "Architecture tour"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0040-000000000040', '{"es": "Día de Voluntariado", "en": "Volunteering day"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0041-000000000041', '{"es": "Limpieza de Playa", "en": "Beach cleanup"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0042-000000000042', '{"es": "Cuidado de Animales", "en": "Animal care"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0043-000000000043', '{"es": "Entrenamiento de Perros", "en": "Dog training"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0044-000000000044', '{"es": "Búsqueda del Tesoro en la Ciudad", "en": "City scavenger hunt"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0045-000000000045', '{"es": "Escape Room", "en": "Escape room"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0046-000000000046', '{"es": "Terapia de Flotación", "en": "Float therapy"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0047-000000000047', '{"es": "Experiencia Sensorial", "en": "Sensory experience"}', '01JHTV00-0000-0000-0000-000000000005', TRUE),
    ('01JHTV00-SUBJ-CAT5-0048-000000000048', '{"es": "Tradiciones Locales", "en": "Local traditions"}', '01JHTV00-0000-0000-0000-000000000005', TRUE);

-- ============================================================
-- Teacher Pricing (Swagger compliant) - se reemplaza por class_types + teacher_class_types
-- ============================================================
-- Tabla catálogo de tipos de clase
CREATE TABLE anyclazz.class_types (
    id VARCHAR(50) PRIMARY KEY, -- valores: online_single, online_group, onsite_single, onsite_group
    subject_id VARCHAR(36) REFERENCES anyclazz.subjects(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.class_types (id, subject_id) VALUES
    ('online_single', NULL),
    ('online_group', NULL),
    ('onsite_single', NULL),
    ('onsite_group', NULL);

-- Tabla intermedia profesor <-> tipo de clase
CREATE TABLE anyclazz.teacher_class_types (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    class_type_id VARCHAR(50) NOT NULL REFERENCES anyclazz.class_types(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (teacher_id, class_type_id)
);

-- Tabla para precios por duración (precios opcionales)
CREATE TABLE anyclazz.teacher_class_type_prices (
    id SERIAL PRIMARY KEY,
    teacher_class_type_id INT NOT NULL REFERENCES anyclazz.teacher_class_types(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL, -- 30, 60, etc.
    price NUMERIC(10,2) NULL,
    currency_code VARCHAR(3) NULL DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (teacher_class_type_id, duration_minutes)
);

-- Datos de ejemplo
INSERT INTO anyclazz.teacher_class_types (teacher_id, class_type_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'online_single'),
    ('550e8400-e29b-41d4-a716-446655440004', 'online_single'),
    ('550e8400-e29b-41d4-a716-446655440004', 'online_group'),
    ('550e8400-e29b-41d4-a716-446655440004', 'onsite_single'),
    ('550e8400-e29b-41d4-a716-446655440004', 'onsite_group');

-- Precios por duración
INSERT INTO anyclazz.teacher_class_type_prices (teacher_class_type_id, duration_minutes, price, currency_code) VALUES
    -- teacher 3, online_single
    (1, 30, 15.00, 'USD'),
    (1, 60, 25.00, 'USD'),
    -- teacher 4, online_single
    (2, 30, 12.00, 'USD'),
    (2, 60, 20.00, 'USD'),
    -- teacher 4, online_group
    (3, 30, 10.00, 'USD'),
    (3, 60, 15.00, 'USD'),
    -- teacher 4, onsite_single
    (4, 30, 20.00, 'USD'),
    (4, 60, 35.00, 'USD'),
    -- teacher 4, onsite_group
    (5, 30, 20.00, 'USD'),
    (5, 60, 25.00, 'USD');
-- ============================================================
-- FIN reemplazo teacher_pricing
-- ============================================================


-- ============================================================
-- Vídeos de profesores
-- ============================================================

CREATE TABLE anyclazz.teacher_videos (
    id VARCHAR(36) PRIMARY KEY,
    teacher_id VARCHAR(36) REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    video_url VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.teacher_videos (id, teacher_id, video_url, title, description)
VALUES
    ('22222222-2222-4222-8222-222222222222', '550e8400-e29b-41d4-a716-446655440003', 'https://videos.anyclazz.com/math1.mp4', 'Algebra Basics', 'Introduction to Algebra'),
    ('33333333-3333-4333-8333-333333333333', '550e8400-e29b-41d4-a716-446655440003', 'https://videos.anyclazz.com/math2.mp4', 'Geometry Basics', 'Introduction to Geometry'),
    ('44444444-4444-4444-8444-444444444444', '550e8400-e29b-41d4-a716-446655440004', 'https://videos.anyclazz.com/english1.mp4', 'English Grammar', 'Basics of English Grammar');

-- ============================================================
-- Reservas y clases
-- ============================================================

CREATE TABLE anyclazz.bookings (
                                   id VARCHAR(36) PRIMARY KEY,
                                   student_id VARCHAR(36) REFERENCES anyclazz.students(id) ON DELETE CASCADE,
                                   teacher_id VARCHAR(36) REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
                                   start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   end_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   duration_minutes INT GENERATED ALWAYS AS ((EXTRACT(EPOCH FROM (end_at - start_at)) / 60)::INT) STORED,
                                   class_type_id VARCHAR(50) REFERENCES anyclazz.class_types(id),
                                   status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
                                   price NUMERIC(10,2),
                                   payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   CHECK (end_at > start_at),
                                   CHECK (duration_minutes > 0)
);

-- INSERT INTO anyclazz.bookings (student_id, teacher_id, start_at, end_at, class_type_id, status, price, payment_status)
-- VALUES
--     ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2025-09-01 10:00:00', '2025-09-01 11:00:00', 'online_single', 'confirmed', 30.00, 'completed'),
--     ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '2025-09-02 15:00:00', '2025-09-02 16:00:00', 'online_single', 'pending', 25.00, 'pending');

-- ============================================================
-- Notificaciones
-- ============================================================

CREATE TABLE anyclazz.notifications (
                                        id SERIAL PRIMARY KEY,
                                        user_id VARCHAR(36) REFERENCES anyclazz.users(id) ON DELETE CASCADE,
                                        message TEXT NOT NULL,
                                        is_read BOOLEAN DEFAULT FALSE,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.notifications (user_id, message)
VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Bienvenida Alice'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Bienvenida Bob'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Bienvenida Carla'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Bienvenida Dan'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Bienvenida Admin');

-- ============================================================
-- Sistema de referidos
-- ============================================================

CREATE TABLE anyclazz.referrals (
                                    id SERIAL PRIMARY KEY,
                                    referrer_id VARCHAR(36) REFERENCES anyclazz.users(id) ON DELETE CASCADE,
                                    referred_id VARCHAR(36) REFERENCES anyclazz.users(id) ON DELETE CASCADE,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    CONSTRAINT no_self_referral CHECK (referrer_id != referred_id)
    );

INSERT INTO anyclazz.referrals (referrer_id, referred_id)
VALUES
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002');

-- ============================================================
-- Chat interno
-- ============================================================

CREATE TABLE anyclazz.messages (
                                   id VARCHAR(36) PRIMARY KEY,
                                   sender_id VARCHAR(36) REFERENCES anyclazz.users(id) ON DELETE CASCADE,
                                   receiver_id VARCHAR(36) REFERENCES anyclazz.users(id) ON DELETE CASCADE,
                                   content TEXT NOT NULL,
                                   is_read BOOLEAN DEFAULT FALSE,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.messages (id, sender_id, receiver_id, content)
VALUES
    ('11111111-1111-4111-8111-111111111111','550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Hello! I have a question about algebra.'),
    ('22222222-2222-4222-8222-222222222222','550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Sure, let''s schedule a time to discuss it.');

-- ============================================================
-- Pagos
-- ============================================================

CREATE TABLE anyclazz.payments (
                                   id SERIAL PRIMARY KEY,
                                   booking_id VARCHAR(36) REFERENCES anyclazz.bookings(id) ON DELETE CASCADE,
                                   amount NUMERIC(10,2) NOT NULL,
                                   status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO anyclazz.payments (booking_id, amount, status)
-- VALUES
--     (1, 30.00, 'completed'),
--     (2, 25.00, 'pending');

-- ============================================================
-- Videollamadas
-- ============================================================

CREATE TABLE anyclazz.sessions (
                                   id SERIAL PRIMARY KEY,
                                   booking_id VARCHAR(36) UNIQUE REFERENCES anyclazz.bookings(id) ON DELETE CASCADE,
                                   session_url VARCHAR(255),
                                   external_service VARCHAR(100),
                                   started_at TIMESTAMP,
                                   ended_at TIMESTAMP,
                                   status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled','ongoing','completed','cancelled')),
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- teachers_reviews
-- ============================================================
CREATE TABLE anyclazz.teachers_reviews (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(36) REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    student_id VARCHAR(36) REFERENCES anyclazz.students(id) ON DELETE CASCADE,
    booking_id VARCHAR(36) REFERENCES anyclazz.bookings(id),
    rating NUMERIC(3,2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (teacher_id, student_id, booking_id)
);

-- ============================================================
-- teachers_students (relación de favoritos/seguidos)
-- ============================================================
CREATE TABLE anyclazz.teachers_students (
                                            id SERIAL PRIMARY KEY,
                                            teacher_id VARCHAR(36) REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
                                            student_id VARCHAR(36) REFERENCES anyclazz.students(id) ON DELETE CASCADE,
                                            is_favorite BOOLEAN DEFAULT TRUE,
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            UNIQUE (teacher_id, student_id)
);

-- ============================================================
-- teachers_availability
-- ============================================================
CREATE TABLE anyclazz.teachers_availability (
    id VARCHAR(36) PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_teachers_availability_time CHECK (start_datetime < end_datetime)
);

CREATE INDEX IF NOT EXISTS idx_teachers_availability_teacher ON anyclazz.teachers_availability(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teachers_availability_time ON anyclazz.teachers_availability(start_datetime, end_datetime);

-- Datos de ejemplo de disponibilidad (UTC)
-- INSERT INTO anyclazz.teachers_availability (id, teacher_id, start_datetime, end_datetime) VALUES
--     ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '550e8400-e29b-41d4-a716-446655440003', '2025-09-01 08:00:00', '2025-09-01 12:00:00'),
--     ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '550e8400-e29b-41d4-a716-446655440004', '2025-09-02 14:00:00', '2025-09-02 18:00:00');

-- ============================================================
-- courses
-- ============================================================
CREATE TABLE anyclazz.courses (
                                  id SERIAL PRIMARY KEY,
                                  title VARCHAR(255) NOT NULL,
                                  description TEXT,
                                  category VARCHAR(100) NOT NULL,
                                  subcategory VARCHAR(100),
                                  level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all-levels')),
                                  duration_minutes INT,
                                  price NUMERIC(10,2),
                                  is_active BOOLEAN DEFAULT TRUE,
                                  thumbnail_url VARCHAR(255),
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- teacher_courses
-- ============================================================
CREATE TABLE anyclazz.teacher_courses (
                                          id SERIAL PRIMARY KEY,
                                          teacher_id VARCHAR(36) REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
                                          course_id INT REFERENCES anyclazz.courses(id) ON DELETE CASCADE,
                                          is_active BOOLEAN DEFAULT TRUE,
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          UNIQUE (teacher_id, course_id)
);

-- ============================================================
-- students_courses_interests
-- ============================================================
CREATE TABLE anyclazz.students_courses_interests (
                                                     id SERIAL PRIMARY KEY,
                                                     student_id VARCHAR(36) REFERENCES anyclazz.students(id) ON DELETE CASCADE,
                                                     category VARCHAR(100) NOT NULL,
                                                     level VARCHAR(50) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
                                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                     UNIQUE (student_id, category)
);

-- ============================================================
-- Tabla de idiomas y certificaciones
-- ============================================================
CREATE TABLE anyclazz.languages (
    id VARCHAR(10) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.languages (id) VALUES
    ('es'),
    ('en'),
    ('fr');

CREATE TABLE anyclazz.teacher_languages (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(36) REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    language_id VARCHAR(10) REFERENCES anyclazz.languages(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (teacher_id, language_id)
);
CREATE TABLE anyclazz.teacher_certifications (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(36) REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issued_by TEXT,
    issued_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- leads_data
-- ============================================================
CREATE TABLE anyclazz.leads_data (
                                     id SERIAL PRIMARY KEY,
                                     email VARCHAR(255) NOT NULL UNIQUE,
                                     first_name VARCHAR(100),
                                     last_name VARCHAR(100),
                                     phone VARCHAR(50),
                                     interests TEXT,
                                     source VARCHAR(100),
                                     status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'rejected')),
                                     notes TEXT,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Relación profesor <-> asignatura (teacher_subjects)
-- ============================================================
CREATE TABLE anyclazz.teacher_subjects (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    subject_id VARCHAR(36) NOT NULL REFERENCES anyclazz.subjects(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (teacher_id, subject_id)
);

-- Registros de ejemplo
INSERT INTO anyclazz.teacher_subjects (teacher_id, subject_id, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', '01JHTV00-SUBJ-CAT1-0011-000000000011', TRUE), -- James: Mathematics
    ('550e8400-e29b-41d4-a716-446655440004', '01JHTV00-SUBJ-CAT1-0013-000000000013', TRUE), -- Valentina: Physics
    ('550e8400-e29b-41d4-a716-446655440005', '01JHTV00-SUBJ-CAT1-0012-000000000012', TRUE); -- Marie: History

-- ============================================================
-- Relación profesor <-> niveles de estudiante (teacher_student_levels)
-- ============================================================
CREATE TABLE anyclazz.teacher_student_levels (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    student_level_id VARCHAR(36) NOT NULL REFERENCES anyclazz.student_levels(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (teacher_id, student_level_id)
);

-- Registros de ejemplo
INSERT INTO anyclazz.teacher_student_levels (teacher_id, student_level_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', '01JHTV00-LVLS-0000-0000-000000000001'), -- James: Kids
    ('550e8400-e29b-41d4-a716-446655440003', '01JHTV00-LVLS-0000-0000-000000000002'), -- James: High School
    ('550e8400-e29b-41d4-a716-446655440004', '01JHTV00-LVLS-0000-0000-000000000002'), -- Valentina: High School
    ('550e8400-e29b-41d4-a716-446655440004', '01JHTV00-LVLS-0000-0000-000000000003'), -- Valentina: University
    ('550e8400-e29b-41d4-a716-446655440004', '01JHTV00-LVLS-0000-0000-000000000004'), -- Valentina: Adults
    ('550e8400-e29b-41d4-a716-446655440005', '01JHTV00-LVLS-0000-0000-000000000004'); -- Marie: Adults

-- Insertar idiomas de profesores
INSERT INTO anyclazz.teacher_languages (teacher_id, language_id, proficiency_level) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'es', 'native'),
    ('550e8400-e29b-41d4-a716-446655440003', 'en', 'b2'),
    ('550e8400-e29b-41d4-a716-446655440004', 'en', 'native'),
    ('550e8400-e29b-41d4-a716-446655440005', 'fr', 'native'),
    ('550e8400-e29b-41d4-a716-446655440005', 'en', 'c1');

-- Insertar class types adicionales para Marie (teacher_id: 550e8400-e29b-41d4-a716-446655440005)
INSERT INTO anyclazz.teacher_class_types (teacher_id, class_type_id, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440005', 'online_single', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440005', 'onsite_single', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440005', 'onsite_group', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar precios por duración para Marie
INSERT INTO anyclazz.teacher_class_type_prices (teacher_class_type_id, duration_minutes, price, currency_code, created_at, updated_at)
SELECT 
    tct.id,
    duration,
    price,
    'USD',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT id, class_type_id FROM anyclazz.teacher_class_types 
    WHERE teacher_id = '550e8400-e29b-41d4-a716-446655440005'
) tct
CROSS JOIN LATERAL (
    VALUES 
        ('online_single', 30, 17.00),
        ('online_single', 60, 17.00),
        ('onsite_single', 30, 25.00),
        ('onsite_single', 60, 25.00),
        ('onsite_group', 60, 12.00)
) AS prices(class_type, duration, price)
WHERE tct.class_type_id = prices.class_type;

-- Insertar reviews de profesores para calcular rating
CREATE TABLE IF NOT EXISTS anyclazz.teacher_stats (
    teacher_id VARCHAR(36) PRIMARY KEY REFERENCES anyclazz.teachers(id) ON DELETE CASCADE,
    rating NUMERIC(3,2) DEFAULT 0,
    reviews_number INT DEFAULT 0,
    students_number INT DEFAULT 0,
    lessons_number INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO anyclazz.teacher_stats (teacher_id, rating, reviews_number, students_number, lessons_number) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 4.3, 202, 89, 2130),
    ('550e8400-e29b-41d4-a716-446655440004', 5.0, 405, 130, 3850),
    ('550e8400-e29b-41d4-a716-446655440005', 4.9, 105, 38, 150);

-- ============================================================
-- Tabla de stories (videos cortos estilo TikTok/Reels)
-- ============================================================
CREATE TABLE anyclazz.stories (
    id VARCHAR(36) PRIMARY KEY,
    video_url VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabla intermedia story_cities (stories <-> ciudades)
-- ============================================================
CREATE TABLE anyclazz.story_cities (
    id SERIAL PRIMARY KEY,
    story_id VARCHAR(36) NOT NULL REFERENCES anyclazz.stories(id) ON DELETE CASCADE,
    country_iso2 CHAR(2) NOT NULL,
    city_iso2 VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (story_id, country_iso2, city_iso2)
);

-- Insertar stories de ejemplo
INSERT INTO anyclazz.stories (id, video_url, title, description) VALUES
    ('01STORY0-0000-0000-0000-000000000001', 'https://www.pexels.com/download/video/5752044/', 'Aprendiendo español en Madrid', 'Descubre cómo es aprender español en el corazón de España'),
    ('01STORY0-0000-0000-0000-000000000002', 'https://www.pexels.com/download/video/3252126/', 'Yoga matutino en Barcelona', 'Empieza tu día con energía positiva'),
    ('01STORY0-0000-0000-0000-000000000003', 'https://www.pexels.com/download/video/5752044/', 'Clase de piano para principiantes', 'Aprende los fundamentos del piano desde cero');

-- Relacionar stories con ciudades
INSERT INTO anyclazz.story_cities (story_id, country_iso2, city_iso2) VALUES
    ('01STORY0-0000-0000-0000-000000000001', 'es', 'm'),    -- Madrid
    ('01STORY0-0000-0000-0000-000000000002', 'es', 'b'),    -- Barcelona
    ('01STORY0-0000-0000-0000-000000000003', 'es', 'm');    -- Madrid
