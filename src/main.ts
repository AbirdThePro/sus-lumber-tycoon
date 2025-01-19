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
}

let suppliers: Supplier[] = [
  {
    name: "Cool Wood Inc.",
    price: 100,
    available: true,
    susScore: 10,
  },
];
let clients: Client[] = [
  {
    name: "House Building Corporation",
    price: 150,
    quota: 10,
    paid: false,
  },
  /*
   * cool carpenters
   * oak laboratories
   * crazy construction incorporated
   * lawful landscaperz
   */
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
}

const width = window.innerWidth * 0.8;
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

function startGame() {
  renderer.setAnimationLoop(animate);

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
    Quota: ${client.quota} tons
    <button id="c${clientIndex}">Deliver Wood</button>
  </p>
  `;

    clientList?.appendChild(currentClient);

    const currentButton = document.getElementById("c" + clientIndex.toString());
    if (currentButton) {
      currentButton.onclick = () => sellWood(client);
    }
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
  }

  setInterval(() => {
    for (let client of clients) {
      resetClient(client);
    }
    for (let supplier of suppliers) {
      resetSupplier(supplier);
    }
  }, 6000);
}

startGame();
