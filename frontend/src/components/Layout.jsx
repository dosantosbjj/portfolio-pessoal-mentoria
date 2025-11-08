import { Outlet, useLocation } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh">
      <Box bg="ufc.black" borderBottomWidth={2} borderColor="ufc.red">
        {/* Top bar with logo and user info */}
        <Flex p={4} alignItems="center">
          <Box
            onClick={() => navigate('/')}
            cursor="pointer"
            data-testid="logo"
            position="relative"
            _hover={{
              '& > *': {
                color: 'white',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <Text
              fontSize="3xl"
              fontWeight="black"
              color="ufc.red"
              letterSpacing="tight"
              fontFamily="sans-serif"
              textTransform="uppercase"
              position="relative"
              display="inline-block"
              px={2}
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                WebkitTextStroke: '1px ufc.red'
              }}
            >
              MFC
            </Text>
            <Box
              position="absolute"
              bottom="-2px"
              left="0"
              right="0"
              height="3px"
              bg="ufc.red"
              _hover={{
                bg: 'white'
              }}
            />
          </Box>

          {/* Centered welcome message */}
          <Flex
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            flexDirection="column"
            alignItems="center"
          >
            <Text color="white" fontSize="sm">
              Bem-vindo,
            </Text>
            <Text color="ufc.red" fontWeight="bold" fontSize="lg">
              {user?.name || 'Usuário'}
            </Text>
          </Flex>

          {/* Logout button */}
          <Box ml="auto">
            <Box
              as="button"
              px={4}
              py={2}
              bg="ufc.red"
              color="white"
              borderRadius="md"
              fontWeight="bold"
              _hover={{
                bg: 'red.600',
              }}
              onClick={handleLogout}
              data-testid="logout-button"
            >
              Sair
            </Box>
          </Box>
        </Flex>

        {/* Navigation tabs */}
        <Flex px={4} pb={2}>
          <Box
            as="button"
            px={4}
            py={2}
            color="white"
            borderBottomWidth={2}
            borderColor={location.pathname === '/' ? 'ufc.red' : 'transparent'}
            _hover={{ color: 'ufc.red' }}
            onClick={() => navigate('/')}
          >
            Lutadores
          </Box>
          <Box
            as="button"
            px={4}
            py={2}
            color="white"
            borderBottomWidth={2}
            borderColor={location.pathname === '/users' ? 'ufc.red' : 'transparent'}
            _hover={{ color: 'ufc.red' }}
            onClick={() => navigate('/users')}
          >
            Usuários
          </Box>
        </Flex>
      </Box>
      <Box p={6}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;