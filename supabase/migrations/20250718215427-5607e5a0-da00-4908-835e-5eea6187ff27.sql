
-- Asignar rol de super_admin al usuario john@chefbusiness.co
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::user_role
FROM public.profiles 
WHERE email = 'john@chefbusiness.co'
ON CONFLICT (user_id, role) DO NOTHING;
