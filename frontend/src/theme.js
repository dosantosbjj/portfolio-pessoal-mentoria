import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    ufc: {
      red: '#D20A0A',
      gold: '#FFD700',
      black: '#000000',
      gray: '#2D2D2D',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#000000',
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      variants: {
        ufc: {
          bg: 'ufc.red',
          color: 'white',
          _hover: {
            bg: 'red.600',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        bg: 'ufc.gray',
        borderRadius: 'lg',
      },
    },
  },
});

export default theme;