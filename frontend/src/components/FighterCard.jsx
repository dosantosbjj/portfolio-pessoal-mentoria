import {
  Card,
  Image,
  Stack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { defaultFighterSilhouette } from '../utils/defaultImages';

function FighterCard({ fighter }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Compute the image src directly from the fighter object.
  // - If fighter.image is a data URL (uploaded base64), use it as-is.
  // - If fighter.image is an absolute path (starts with '/'), use as-is.
  // - If fighter.image is a filename (e.g. 'anderson-silva.png'), prefix with
  //   /images/fighters/ to point to the public folder.
  // - Otherwise fallback to default silhouette.
  const computeImageSrc = () => {
    if (!fighter) return defaultFighterSilhouette;
    const img = fighter.image;
    if (!img) return defaultFighterSilhouette;
    if (typeof img !== 'string') return defaultFighterSilhouette;
    const trimmed = img.trim();
    if (trimmed.startsWith('data:')) return trimmed; // base64
    if (trimmed.startsWith('/')) return trimmed; // absolute path
    // treat as filename
    return `/images/fighters/${trimmed}`;
  };

  const fighterImage = computeImageSrc();

  return (
    <>
      <Card maxW="sm" bg="ufc.gray" data-testid={`fighter-card-${fighter.id}`}>
        <Image
          src={fighterImage}
          alt={fighter.name}
          height="200px"
          objectFit="cover"
          fallbackSrc={defaultFighterSilhouette}
        />
        <Stack p={4}>
          <Text fontSize="xl" fontWeight="bold">
            {fighter.name}
          </Text>
          <Text fontSize="md">{fighter.record}</Text>
          <Button variant="ufc" onClick={onOpen} data-testid={`details-button-${fighter.id}`}>
            Detalhes
          </Button>
        </Stack>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="ufc.gray">
          <ModalHeader>{fighter.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={fighterImage}
              alt={fighter.name}
              width="100%"
              height="300px"
              objectFit="contain"
              mb={4}
              fallbackSrc={defaultFighterSilhouette}
              bg="blackAlpha.50"
              borderRadius="md"
            />
            <List spacing={3}>
              <ListItem>
                <Text fontWeight="bold">Categoria:</Text> {fighter.weightClass}
              </ListItem>
              <ListItem>
                <Text fontWeight="bold">Nacionalidade:</Text> {fighter.nationality}
              </ListItem>
              <ListItem>
                <Text fontWeight="bold">Especialidade:</Text> {fighter.specialty}
              </ListItem>
              <ListItem>
                <Text fontWeight="bold">Cartel:</Text> {fighter.record}
              </ListItem>
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FighterCard;