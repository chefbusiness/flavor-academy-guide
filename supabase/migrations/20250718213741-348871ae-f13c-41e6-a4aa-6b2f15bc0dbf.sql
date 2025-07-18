
-- 1. Crear enum para roles de usuario
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'user');

-- 2. Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Crear tabla de roles de usuario
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 4. Crear tabla de escuelas (migración desde datos estáticos)
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_id TEXT UNIQUE, -- Para mantener compatibilidad con IDs existentes
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('university', 'institute', 'academy', 'college')),
  specialties JSONB NOT NULL DEFAULT '[]',
  founded INTEGER NOT NULL,
  students_count INTEGER NOT NULL DEFAULT 0,
  programs_count INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  tuition_min INTEGER NOT NULL DEFAULT 0,
  tuition_max INTEGER NOT NULL DEFAULT 0,
  tuition_currency TEXT NOT NULL DEFAULT 'EUR',
  languages JSONB NOT NULL DEFAULT '[]',
  accreditation JSONB NOT NULL DEFAULT '[]',
  features JSONB NOT NULL DEFAULT '[]',
  coordinates_lat DECIMAL(10,8),
  coordinates_lng DECIMAL(11,8),
  programs JSONB DEFAULT '[]',
  gallery JSONB DEFAULT '[]',
  slug TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- 6. Crear función para verificar roles (evita recursión en RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_roles.user_id = $1 LIMIT 1;
$$;

-- 7. Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- 8. Políticas RLS para user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.get_user_role(auth.uid()) = 'super_admin');

-- 9. Políticas RLS para schools
CREATE POLICY "Anyone can view active schools" ON public.schools
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage schools" ON public.schools
  FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- 10. Crear trigger para auto-crear perfil cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Actualizar tabla school_images para referenciar schools
ALTER TABLE public.school_images 
ADD COLUMN school_uuid UUID REFERENCES public.schools(id) ON DELETE CASCADE;

-- 12. Crear índices para mejor rendimiento
CREATE INDEX idx_schools_slug ON public.schools(slug);
CREATE INDEX idx_schools_country ON public.schools(country);
CREATE INDEX idx_schools_type ON public.schools(type);
CREATE INDEX idx_schools_active ON public.schools(is_active);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_school_images_school_uuid ON public.school_images(school_uuid);
