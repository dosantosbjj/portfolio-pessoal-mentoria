import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaTrash, FaSearch, FaTimes } from 'react-icons/fa';
import { getUsers, deleteUser } from '../services/api';
import useAuthStore from '../store/authStore';

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar usuários',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await getUsers({ email: searchEmail });
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data.filter(user => 
          user.email.toLowerCase().includes(searchEmail.toLowerCase())
        ));
      } else {
        setUsers([]);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao buscar usuários',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchEmail('');
    loadUsers();
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser.id);
      await loadUsers();
      toast({
        title: 'Sucesso',
        description: 'Usuário excluído com sucesso',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao excluir usuário',
        status: 'error',
        duration: 3000,
      });
    } finally {
      onClose();
    }
  };

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="ufc.red" mb={4}>
          Gerenciar Usuários
        </Text>
        <Flex gap={4}>
          <InputGroup flex="2">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar usuário por email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </InputGroup>
          <Button
            leftIcon={<FaSearch />}
            onClick={handleSearch}
            bg="ufc.red"
            color="white"
            _hover={{ bg: 'red.600' }}
            flex="1"
            isDisabled={!searchEmail.trim()}
          >
            Buscar
          </Button>
          <Button
            leftIcon={<FaTimes />}
            variant="outline"
            onClick={clearSearch}
            flex="1"
            isDisabled={!searchEmail.trim()}
          >
            Limpar
          </Button>
        </Flex>
      </Box>

      <Box overflowX="auto" bg="ufc.gray" borderRadius="md" p={4}>
        {users.length > 0 ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>CPF</Th>
                <Th width="100px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id} data-testid={`user-row-${user.id}`}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.cpf}</Td>
                  <Td>
                    {currentUser.id !== user.id && (
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(user)}
                        data-testid={`delete-user-${user.id}`}
                        aria-label="Excluir usuário"
                      />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Flex justify="center" align="center" py={8}>
            <Text color="gray.500">Nenhum usuário encontrado</Text>
          </Flex>
        )}
      </Box>

      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="ufc.gray">
            <AlertDialogHeader>Excluir Usuário</AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancelar</Button>
              <Button colorScheme="red" ml={3} onClick={handleDeleteConfirm}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default Users;