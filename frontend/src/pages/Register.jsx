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
import { register } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast({
        title: 'Sucesso',
        description: 'Cadastro realizado com sucesso. Por favor, faça login.',
        status: 'success',
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao realizar cadastro',
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
              Cadastro
            </Text>
            <FormControl id="name">
              <FormLabel>Nome</FormLabel>
              <Input
                type="text"
                value={formData.name}
                onChange={handleChange}
                data-testid="name-input"
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={handleChange}
                data-testid="email-input"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={formData.password}
                onChange={handleChange}
                data-testid="password-input"
              />
            </FormControl>
            <FormControl id="cpf">
              <FormLabel>CPF</FormLabel>
              <Input
                type="text"
                value={formData.cpf}
                onChange={handleChange}
                data-testid="cpf-input"
              />
            </FormControl>
            <Button
              type="submit"
              variant="ufc"
              width="full"
              isLoading={loading}
              data-testid="register-button"
            >
              Cadastrar
            </Button>
            <Text>
              Já tem uma conta?{' '}
              <Link as={RouterLink} to="/login" color="ufc.red">
                Entrar
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default Register;