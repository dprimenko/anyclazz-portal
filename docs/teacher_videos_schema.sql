-- Tabla para almacenar videos de profesores
CREATE TABLE IF NOT EXISTS teacher_videos (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL,
    video_id VARCHAR(255) NOT NULL UNIQUE, -- ID del video en Bunny.net
    video_url TEXT NOT NULL, -- URL del video embebido
    description TEXT NOT NULL,
    thumbnail_url TEXT, -- URL de la imagen de portada
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_teacher
        FOREIGN KEY (teacher_id)
        REFERENCES teachers(id)
        ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_teacher_videos_teacher_id ON teacher_videos(teacher_id);
CREATE INDEX idx_teacher_videos_created_at ON teacher_videos(created_at DESC);
CREATE INDEX idx_teacher_videos_is_active ON teacher_videos(is_active);

-- Tabla para almacenar likes de videos
CREATE TABLE IF NOT EXISTS video_likes (
    id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_video
        FOREIGN KEY (video_id)
        REFERENCES teacher_videos(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    
    -- Un usuario solo puede dar like una vez a un video
    UNIQUE(video_id, user_id)
);

-- Índices para likes
CREATE INDEX idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX idx_video_likes_user_id ON video_likes(user_id);

-- Tabla para almacenar visualizaciones de videos
CREATE TABLE IF NOT EXISTS video_views (
    id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL,
    user_id INTEGER, -- NULL si es un usuario no autenticado
    ip_address VARCHAR(45), -- Para trackear usuarios no autenticados
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_video_view
        FOREIGN KEY (video_id)
        REFERENCES teacher_videos(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_user_view
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Índices para views
CREATE INDEX idx_video_views_video_id ON video_views(video_id);
CREATE INDEX idx_video_views_user_id ON video_views(user_id);
CREATE INDEX idx_video_views_viewed_at ON video_views(viewed_at DESC);

-- Función para actualizar el contador de likes
CREATE OR REPLACE FUNCTION update_video_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE teacher_videos 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.video_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE teacher_videos 
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = OLD.video_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar likes_count automáticamente
CREATE TRIGGER trigger_update_video_likes_count
AFTER INSERT OR DELETE ON video_likes
FOR EACH ROW
EXECUTE FUNCTION update_video_likes_count();

-- Función para actualizar el contador de views
CREATE OR REPLACE FUNCTION update_video_views_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE teacher_videos 
    SET views_count = views_count + 1 
    WHERE id = NEW.video_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar views_count automáticamente
CREATE TRIGGER trigger_update_video_views_count
AFTER INSERT ON video_views
FOR EACH ROW
EXECUTE FUNCTION update_video_views_count();

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en teacher_videos
CREATE TRIGGER trigger_update_teacher_videos_updated_at
BEFORE UPDATE ON teacher_videos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE teacher_videos IS 'Videos subidos por profesores para mostrar en su perfil y feed';
COMMENT ON COLUMN teacher_videos.video_id IS 'ID único del video en Bunny.net';
COMMENT ON COLUMN teacher_videos.video_url IS 'URL del iframe embed del video';
COMMENT ON COLUMN teacher_videos.thumbnail_url IS 'URL de la imagen de portada del video';
COMMENT ON COLUMN teacher_videos.is_active IS 'Indica si el video está activo (visible) o ha sido desactivado por el profesor';

COMMENT ON TABLE video_likes IS 'Likes dados por usuarios a videos de profesores';
COMMENT ON TABLE video_views IS 'Registro de visualizaciones de videos';
