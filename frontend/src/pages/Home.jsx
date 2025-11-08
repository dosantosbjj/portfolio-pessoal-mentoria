import { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Select,
  Text,
  Flex,
  Spinner,
  useToast,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { getFighters, addFighter } from '../services/api';
import FighterCard from '../components/FighterCard';
import FighterForm from '../components/FighterForm';
import { preloadFighterImages } from '../utils/imageLoader';

function Home() {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddFighter = async (fighterData) => {
    const response = await addFighter(fighterData);
    setFighters([...fighters, response.data]);
  };

  useEffect(() => {
    const loadFighters = async () => {
      try {
        const response = await getFighters();
        setFighters(response.data);
        
        // Preload images for all fighters
        await preloadFighterImages();
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao carregar lutadores',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadFighters();
  }, [toast]);

  const sortedFighters = [...fighters].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.weightClass.localeCompare(b.weightClass);
  });

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="ufc.red" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="ufc.gold">
          Lutadores MFC
        </Text>
        <Flex gap={4}>
          <Select
            w="200px"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            data-testid="sort-select"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="weight">Ordenar por Categoria</option>
          </Select>
          <Button variant="ufc" onClick={onOpen}>
            Adicionar Lutador
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
        {sortedFighters.map((fighter) => (
          <FighterCard key={fighter.id} fighter={fighter} />
        ))}
      </SimpleGrid>
      <FighterForm isOpen={isOpen} onClose={onClose} onSubmit={handleAddFighter} />
    </Box>
  );
}

export default Home;