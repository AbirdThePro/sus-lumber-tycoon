import * as Three from "three";
import "./style.css";

interface Supplier {
  name: string;
  price: number;
  available: boolean;
  susScore: number;
}

interface Client {
  name: string;
  price: number;
  quota: number;
  paid: boolean;
  fine: number;
}

let suppliers: Supplier[] = [
  {
    name: "Cool Wood Inc.",
    price: 100,
    available: true,
    susScore: 10,
  },
  {
    name: "HAHAHA GET WRECKED",
    price: 50,
    available: true,
    susScore: -10,
  },
  {
    name: "Alpha Wolf Lumber",
    price: 40,
    available: true,
    susScore: -20,
  },
  {
    name: "Garden Green Lumber",
    price: 200,
    available: true,
    susScore: 15,
  },
  {
    name: "Nice Supplyz",
    price: 90,
    available: true,
    susScore: 0,
  },
];
let clients: Client[] = [
  {
    name: "House Building Corporation",
    price: 150,
    quota: 10,
    paid: false,
    fine: 1000,
  },
  {
    name: "Cool Carpenters",
    price: 100,
    quota: 70,
    paid: false,
    fine: 400,
  },
  {
    name: "Oak Laboratories",
    price: 210,
    quota: 50,
    paid: false,
    fine: 3000,
  },
  {
    name: "Crazy Construction Inc.",
    price: 200,
    quota: 250,
    paid: false,
    fine: 2500,
  },
  {
    name: "Lawful Landscaperz",
    price: 50,
    quota: 40,
    paid: false,
    fine: 250,
  },
];

function buyWood(supplier: Supplier) {
  if (money < supplier.price) {
    alert("You do not have enough money!");
  } else {
    setMoney(money - supplier.price);
    setWood(wood + 10);
    setSus(susScore + supplier.susScore);

    if (Math.random() < 0.1) {
      supplier.available = false;

      const supplierElement = document.getElementById(supplier.name);
      if (supplierElement) {
        supplierElement.style.backgroundColor = "red";
        const supplierButton =
          supplierElement.getElementsByTagName("button")[0];
        supplierButton.hidden = true;
      }
    }
  }
}

function resetSupplier(supplier: Supplier) {
  const supplierElement = document.getElementById(supplier.name);
  if (supplierElement) {
    supplierElement.style.backgroundColor = "transparent";
    const supplierButton = supplierElement.getElementsByTagName("button")[0];
    supplierButton.hidden = false;
  }
}

function sellWood(client: Client) {
  if (wood < client.quota) {
    alert("You do not have enough wood!");
  } else {
    setWood(wood - client.quota);
    setMoney(money + client.price * client.quota);
    client.paid = true;

    const clientElement = document.getElementById(client.name);
    if (clientElement) {
      clientElement.style.backgroundColor = "green";
      const clientButton = clientElement.getElementsByTagName("button")[0];
      clientButton.hidden = true;
    }
  }
}

function resetClient(client: Client) {
  client.paid = false;

  const clientElement = document.getElementById(client.name);
  if (clientElement) {
    clientElement.style.backgroundColor = "red";
    const clientButton = clientElement.getElementsByTagName("button")[0];
    clientButton.hidden = false;
  }
}

let money = 10000;
const moneyElement = document.getElementById("money");
function setMoney(newMoney: number) {
  money = newMoney;

  if (moneyElement) {
    moneyElement.innerText = "Money: $" + newMoney;
  }

  if (money <= 0) {
    if (loseBroke) {
      loseBroke.open = true;
    }
    endGame();
  }
}

let wood = 0;
const woodElement = document.getElementById("wood");
function setWood(newWood: number) {
  wood = newWood;

  if (woodElement) {
    woodElement.innerText = "Wood: " + newWood + " tons";
  }
}

let susScore = 100;
const susElement = document.getElementById("sus");
function setSus(newSusScore: number) {
  susScore = newSusScore;

  if (susElement) {
    susElement.innerText = "Sustainability Score: " + susScore;
  }

  if (susScore <= 0) {
    if (loseSus) {
      loseSus.open = true;
    }
    endGame();
  }
}

let week = 1;
const weekElement = document.getElementById("week");
function setWeek(newWeek: number) {
  week = newWeek;

  if (weekElement) {
    weekElement.innerText = "Week " + week;
  }
}

const width = window.innerWidth * 0.6;
const height = window.innerHeight;

const renderer = new Three.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(60, width / height, 0.1, 100);
camera.translateY(10);
camera.translateZ(10);
camera.rotateX(-Math.PI / 4);

const ocean = new Three.Mesh(
  new Three.BoxGeometry(30, 0.1, 30),
  new Three.MeshBasicMaterial({ color: 0x5555ff })
);

const island = new Three.Mesh(
  new Three.BoxGeometry(10, 1, 10),
  new Three.MeshBasicMaterial({ color: 0x33ff33 })
);

scene.add(ocean, island);

function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

let loop: any;
function startGame() {
  if (ui) {
    ui.hidden = false;
  }
  if (startScreen) {
    startScreen.open = false;
  }

  setMoney(10000);
  setWood(0);
  setSus(100);
  setWeek(1);

  const clientList = document.getElementById("clients");
  let clientIndex = 0;
  for (let client of clients) {
    const currentClient = document.createElement("div");
    currentClient.className = "client";
    currentClient.id = client.name;
    currentClient.style.backgroundColor = "red";
    currentClient.innerHTML = `
  <p>
    <b>${client.name}</b><br>
    Price: $${client.price}/ton<br>
    Quota: ${client.quota} tons<br>
    <button id="c${clientIndex}">Deliver Wood</button>
  </p>
  `;

    clientList?.appendChild(currentClient);

    const currentButton = document.getElementById("c" + clientIndex.toString());
    if (currentButton) {
      currentButton.onclick = () => sellWood(client);
    }

    clientIndex++;
  }

  const supplierList = document.getElementById("suppliers");
  let supplierIndex = 0;
  for (let supplier of suppliers) {
    let currentSupplier = document.createElement("div");
    currentSupplier.className = "supplier";
    currentSupplier.id = supplier.name;
    currentSupplier.innerHTML = `
  <p>
    <b>${supplier.name}</b><br>
    Price: $${supplier.price}<br>
    ${supplier.available ? "Available" : "Not Available"}<br>
    <button id="s${supplierIndex}">Purchase Wood</button>
  </p>
  `;

    supplierList?.appendChild(currentSupplier);

    const currentButton = document.getElementById(
      "s" + supplierIndex.toString()
    );
    if (currentButton) {
      currentButton.onclick = () => buyWood(supplier);
    }

    supplierIndex++;
  }

  loop = setInterval(() => {
    setWeek(week + 1);
    if (week === 10) {
      if (winScreen) {
        winScreen.open = true;
      }
      endGame();
    }

    for (let client of clients) {
      if (!client.paid) {
        setMoney(money - client.fine);
      }
      resetClient(client);
    }
    for (let supplier of suppliers) {
      resetSupplier(supplier);
    }
  }, 10000);
}

function endGame() {
  if (ui) {
    ui.hidden = true;
  }

  clearInterval(loop);
}

function restartGame() {
  winScreen.open = false;
  loseBroke.open = false;
  loseSus.open = false;

  startGame();
}

const startScreen = document.getElementById("startScreen") as HTMLDialogElement;
const startButton = document.getElementById("startButton");
if (startButton) {
  startButton.onclick = startGame;
}

const winScreen = document.getElementById("winScreen") as HTMLDialogElement;

const loseBroke = document.getElementById("broke") as HTMLDialogElement;
const loseSus = document.getElementById("badSus") as HTMLDialogElement;

const restartButtons = document.getElementsByClassName(
  "restartButton"
) as HTMLCollectionOf<HTMLButtonElement>;
for (let button of restartButtons) {
  button.onclick = restartGame;
}

const ui = document.getElementById("ui");
if (ui) {
  ui.hidden = true;
}
