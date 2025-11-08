import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import useAuthStore from '../store/authStore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await login(email, password);
      
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid server response');
      }
      
      const { token, user } = response.data;
      await setAuth(token, user);
      console.log('Auth state updated, navigating...');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Erro',
        description: error.response?.data?.message || error.message || 'Falha ao fazer login',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="black"
    >
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="2xl"
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(10px)"
        w="90%"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" color="ufc.red">
              MFC Fighters
            </Text>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="email-input"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="password-input"
              />
            </FormControl>
            <Button
              type="submit"
              variant="ufc"
              width="full"
              isLoading={loading}
              data-testid="login-button"
            >
              Entrar
            </Button>
            <Text>
              Não tem uma conta?{' '}
              <Link as={RouterLink} to="/register" color="ufc.red">
                Cadastre-se
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default Login;