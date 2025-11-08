import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import ImageUpload from './ImageUpload';

const weightClasses = [
  'Peso Mosca',
  'Peso Galo',
  'Peso Pena',
  'Peso Leve',
  'Peso Meio-Médio',
  'Peso Médio',
  'Peso Meio-Pesado',
  'Peso Pesado',
];

function FighterForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      image: '',
      weightClass: '',
      nationality: '',
      specialty: '',
      record: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (base64Image) => {
    setFormData((prev) => ({ ...prev, image: base64Image }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      toast({
        title: `Lutador ${initialData ? 'atualizado' : 'adicionado'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Algo deu errado',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="ufc.gray" maxW="400px">
        <ModalHeader>
          {initialData ? 'Editar Lutador' : 'Adicionar Novo Lutador'}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4} width="100%">
              <ImageUpload
                value={formData.image}
                onChange={handleImageChange}
              />
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Categoria</FormLabel>
                <Select
                  name="weightClass"
                  value={formData.weightClass}
                  onChange={handleChange}
                  placeholder="Selecione a categoria"
                >
                  {weightClasses.map((wc) => (
                    <option key={wc} value={wc}>
                      {wc}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Nacionalidade</FormLabel>
                <Input
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Especialidade</FormLabel>
                <Input
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Cartel</FormLabel>
                <Input
                  name="record"
                  value={formData.record}
                  onChange={handleChange}
                  placeholder="V-D-E"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="ufc"
              type="submit"
              isLoading={loading}
            >
              {initialData ? 'Salvar Alterações' : 'Adicionar Lutador'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default FighterForm;