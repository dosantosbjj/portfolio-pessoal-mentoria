function generateRandomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function generateRandomCPF() {
  const numbers = [];
  for (let i = 0; i < 9; i++) {
    numbers.push(Math.floor(Math.random() * 10));
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += numbers[i] * (10 - i);
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  numbers.push(digit1);

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += numbers[i] * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  numbers.push(digit2);

  return numbers.join('');
}

function generateRandomUser() {
  const randomStr = generateRandomString(6);
  return {
    name: `Test User ${randomStr}`,
    email: `test.${randomStr}@example.com`,
    password: `password${randomStr}123`,
    cpf: generateRandomCPF()
  };
}

const testFighter = {
  name: 'Anderson Silva',
  image: 'anderson_silva.jpg',
  weightClass: 'Middleweight',
  nationality: 'Brazilian',
  specialty: 'Striking',
  record: '34-11-0'
};

module.exports = {
  generateRandomUser,
  testFighter
};
