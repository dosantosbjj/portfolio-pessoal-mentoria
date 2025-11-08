import { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Image,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';

function ImageUpload({ value, onChange, label = 'Imagem do Lutador' }) {
  const [preview, setPreview] = useState(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgElement = document.createElement('img');
        imgElement.onload = () => {
          const canvas = document.createElement('canvas');
          let width = imgElement.width;
          let height = imgElement.height;
          
          // Maximum dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgElement, 0, 0, width, height);

          // Convert to JPEG format with 0.8 quality to reduce size
          const base64String = canvas.toDataURL('image/jpeg', 0.8);
          resolve(base64String);
        };
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const optimizedImage = await resizeImage(file);
        setPreview(optimizedImage);
        onChange(optimizedImage);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  return (
    <FormControl width="100%">
      <FormLabel>{label}</FormLabel>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        hidden
        id="fighter-image"
      />
      <Box
        as="label"
        htmlFor="fighter-image"
        cursor="pointer"
        borderWidth={2}
        borderStyle="dashed"
        borderRadius="md"
        p={4}
        width="100%"
        height="120px"
        maxWidth="100%"
        bg="blackAlpha.50"
        transition="all 0.2s"
        display="block"
        _hover={{ bg: 'blackAlpha.100' }}
      >
        <Flex
          height="100%"
          direction="column"
          align="center"
          justify="center"
          gap={2}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Prévia do lutador"
              maxH="100px"
              maxW="100%"
              objectFit="contain"
              borderRadius="md"
            />
          ) : (
            <>
              <Text color="gray.500" fontWeight="medium" textAlign="center">
                Clique para fazer upload da imagem
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Formatos aceitos: JPG, PNG
              </Text>
            </>
          )}
        </Flex>
      </Box>
    </FormControl>
  );
}

export default ImageUpload;