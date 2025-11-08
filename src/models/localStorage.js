const fs = require("fs");
const path = require("path");
const { getFighterImage, defaultFighterSilhouette } = require('../utils/defaultImages');

const dataFilePath = path.join(__dirname, "../../data/fighters.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dataFilePath))) {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
}

let data = {
  users: [],
  fighters: [],
};

// Default base64 placeholder image (you can replace this with a default fighter silhouette)
const defaultFighterImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiLz48L3N2Zz4=';

const defaultFighters = [
  {
    id: 1,
    name: "Anderson Silva",
    image: getFighterImage("Anderson Silva"),
    weightClass: "Middleweight",
    nationality: "Brazilian",
    specialty: "Striking",
    record: "34-11-0",
  },
  {
    id: 2,
    name: "Georges St-Pierre",
    image: getFighterImage("Georges St-Pierre"),
    weightClass: "Welterweight",
    nationality: "Canadian",
    specialty: "Wrestling",
    record: "26-2-0",
  },
  {
    id: 3,
    name: "Khabib Nurmagomedov",
    image: getFighterImage("Khabib Nurmagomedov"),
    weightClass: "Lightweight",
    nationality: "Russian",
    specialty: "Wrestling",
    record: "29-0-0",
  },
  {
    id: 4,
    name: "Jon Jones",
    image: defaultFighterSilhouette,
    weightClass: "Heavyweight",
    nationality: "American",
    specialty: "Wrestling",
    record: "27-1-0",
  },
  {
    id: 5,
    name: "Amanda Nunes",
    image: defaultFighterSilhouette,
    weightClass: "Bantamweight",
    nationality: "Brazilian",
    specialty: "Striking",
    record: "22-5-0",
  },
  {
    id: 6,
    name: "Conor McGregor",
    image: "conor-mcgregor.png",
    weightClass: "Lightweight",
    nationality: "Irish",
    specialty: "Striking",
    record: "22-6-0",
  },
  {
    id: 7,
    name: "Israel Adesanya",
    image: "israel-adesanya.png",
    weightClass: "Middleweight",
    nationality: "Nigerian",
    specialty: "Striking",
    record: "24-3-0",
  },
  {
    id: 8,
    name: "Rose Namajunas",
    image: "rose-namajunas.png",
    weightClass: "Strawweight",
    nationality: "American",
    specialty: "Jiu-Jitsu",
    record: "12-5-0",
  },
  {
    id: 9,
    name: "Charles Oliveira",
    image: "charles-oliveira.png",
    weightClass: "Lightweight",
    nationality: "Brazilian",
    specialty: "Jiu-Jitsu",
    record: "33-9-0",
  },
  {
    id: 10,
    name: "Dustin Poirier",
    image: "dustin-poirier.png",
    weightClass: "Lightweight",
    nationality: "American",
    specialty: "Boxing",
    record: "29-8-0",
  },
  {
    id: 11,
    name: "Valentina Shevchenko",
    image: "valentina-shevchenko.png",
    weightClass: "Flyweight",
    nationality: "Kyrgyzstani",
    specialty: "Muay Thai",
    record: "23-4-0",
  },
  {
    id: 12,
    name: "Max Holloway",
    image: "max-holloway.png",
    weightClass: "Featherweight",
    nationality: "American",
    specialty: "Boxing",
    record: "25-7-0",
  },
  {
    id: 13,
    name: "Alex Pereira",
    image: "alex-pereira.png",
    weightClass: "Light Heavyweight",
    nationality: "Brazilian",
    specialty: "Kickboxing",
    record: "9-2-0",
  },
  {
    id: 14,
    name: "Zhang Weili",
    image: "zhang-weili.png",
    weightClass: "Strawweight",
    nationality: "Chinese",
    specialty: "Striking",
    record: "24-3-0",
  },
  {
    id: 15,
    name: "Kamaru Usman",
    image: "kamaru-usman.png",
    weightClass: "Welterweight",
    nationality: "Nigerian",
    specialty: "Wrestling",
    record: "20-3-0",
  },
  {
    id: 16,
    name: "Francis Ngannou",
    image: "francis-ngannou.png",
    weightClass: "Heavyweight",
    nationality: "Cameroonian",
    specialty: "Power Striking",
    record: "17-3-0",
  },
  {
    id: 17,
    name: "Petr Yan",
    image: "petr-yan.png",
    weightClass: "Bantamweight",
    nationality: "Russian",
    specialty: "Boxing",
    record: "16-4-0",
  },
  {
    id: 18,
    name: "Islam Makhachev",
    image: "islam-makhachev.png",
    weightClass: "Lightweight",
    nationality: "Russian",
    specialty: "Sambo",
    record: "24-1-0",
  },
];

const bcrypt = require('bcryptjs');

// Create password hash asynchronously
const createDefaultAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    return {
      id: 1,
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      cpf: "12345678900",
    };
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
};

const saveData = () => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const loadData = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf8");
      data = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

const initializeDefaultData = async () => {
  try {
    console.log('Initializing default data');
    loadData();
    let needsSave = false;

    if (data.fighters.length === 0) {
      console.log('Initializing default fighters');
      data.fighters = defaultFighters;
      needsSave = true;
    }

    if (data.users.length === 0) {
      console.log('Initializing default admin user');
      const admin = await createDefaultAdmin();
      data.users = [admin];
      needsSave = true;
    }

    if (needsSave) {
      saveData();
    }

  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
};

const getUsers = () => {
  loadData();
  return data.users;
};

const getFighters = () => {
  loadData();
  return data.fighters;
};

const addUser = (user) => {
  loadData();
  data.users.push(user);
  saveData();
};

const addFighter = (fighter) => {
  loadData();
  data.fighters.push(fighter);
  saveData();
};

const updateFighter = (id, updatedFighter) => {
  loadData();
  const index = data.fighters.findIndex((f) => f.id === id);
  if (index !== -1) {
    data.fighters[index] = { ...data.fighters[index], ...updatedFighter };
    saveData();
    return true;
  }
  return false;
};

const deleteFighter = (id) => {
  loadData();
  const initialLength = data.fighters.length;
  data.fighters = data.fighters.filter((f) => f.id !== id);
  if (data.fighters.length !== initialLength) {
    saveData();
    return true;
  }
  return false;
};

const findFighterByName = (name) => {
  loadData();
  return data.fighters.filter((f) =>
    f.name.toLowerCase().includes(name.toLowerCase())
  );
};

const findFightersByWeightClass = (weightClass) => {
  loadData();
  return data.fighters.filter(
    (f) => f.weightClass.toLowerCase() === weightClass.toLowerCase()
  );
};

const findUserByEmail = (email) => {
  loadData();
  return data.users.find((u) => u.email === email);
};

const findUserByCpf = (cpf) => {
  loadData();
  return data.users.find((u) => u.cpf === cpf);
};

const saveUsers = (users) => {
  loadData();
  data.users = users;
  saveData();
};

module.exports = {
  initializeDefaultData,
  getUsers,
  getFighters,
  addUser,
  addFighter,
  updateFighter,
  deleteFighter,
  findFighterByName,
  findFightersByWeightClass,
  findUserByEmail,
  findUserByCpf,
  saveUsers,
};
