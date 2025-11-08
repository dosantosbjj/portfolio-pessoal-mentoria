import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FaSearch, FaTimes } from 'react-icons/fa';

function Fighters() {
  const [fighters, setFighters] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadFighters();
  }, []);

  const loadFighters = async () => {
    setLoading(true);
    try {
      // TO DO: Integrar com a API real quando estiver pronta
      const response = await fetch('/api/fighters');
      const data = await response.json();
      setFighters(data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar lutadores',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!searchName) {
        await loadFighters();
        return;
      }

      // TO DO: Integrar com a API real quando estiver pronta
      const response = await fetch(`/api/fighters?name=${searchName}`);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setFighters(data.filter(fighter => 
          fighter.name.toLowerCase().includes(searchName.toLowerCase())
        ));
      } else {
        setFighters([]);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao buscar lutadores',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchName('');
    loadFighters();
  };

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="ufc.red" mb={4}>
          Lutadores
        </Text>
        <Flex gap={4}>
          <InputGroup flex="2">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar lutador por nome"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </InputGroup>
          <Button
            leftIcon={<FaSearch />}
            onClick={handleSearch}
            bg="ufc.red"
            color="white"
            _hover={{ bg: 'red.600' }}
            flex="1"
            isLoading={loading}
          >
            Buscar
          </Button>
          <Button
            leftIcon={<FaTimes />}
            variant="outline"
            onClick={clearSearch}
            flex="1"
          >
            Limpar
          </Button>
        </Flex>
      </Box>

      <Box overflowX="auto" bg="ufc.gray" borderRadius="md" p={4}>
        {fighters.length > 0 ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Categoria</Th>
                <Th>Cartel</Th>
                <Th>País</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fighters.map((fighter) => (
                <Tr key={fighter.id}>
                  <Td>{fighter.name}</Td>
                  <Td>{fighter.weightClass}</Td>
                  <Td>{fighter.record}</Td>
                  <Td>{fighter.country}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Flex justify="center" align="center" py={8}>
            <Text color="gray.500">Nenhum lutador encontrado</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
}

export default Fighters;