import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const { signIn, signUp, user, loading } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Credenciales inválidas. Verifica tu email y contraseña.' 
        : error.message);
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este email ya está registrado. Intenta iniciar sesión.');
      } else {
        setError(error.message);
      }
    } else {
      setSuccess('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
    }

    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      <div className="container max-w-md mx-auto pt-24 pb-12 px-4">
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Acceso Administrativo
            </CardTitle>
            <CardDescription>
              Inicia sesión o regístrate para acceder al panel de administración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Contraseña</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nombre Completo</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Tu nombre"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      'Registrarse'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}