function addTile() {
  const container = document.getElementById("tile-container");
  const newTile = document.createElement("div");
  newTile.className = "tile";

  // Buat partition unik untuk setiap tile
  const partitionName = "persist:tile" + (container.children.length + 1);

  // Ambil URL input
  const url = "https://google.com"; // Misal menggunakan input yang ada, atau default URL

  // Simpan data tile ke localStorage
  let tiles = JSON.parse(localStorage.getItem("tiles")) || [];
  const tileData = { url, partition: partitionName };
  tiles.push(tileData);
  localStorage.setItem("tiles", JSON.stringify(tiles));

  newTile.innerHTML = `
  <div class="tile-toolbar">
    <button onclick="goBack(this)">⬅️</button>
    <button onclick="goForward(this)">➡️</button>
    <input type="text" class="url-input" value="${url}">
    <button onclick="navigate(this)">Go</button>
    <button class="delete-btn" onclick="deleteTile(this)">Hapus</button>
  </div>
  <webview src="${url}" partition="${partitionName}" useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"></webview>
`;

  container.appendChild(newTile);
  adjustGrid();
}

function loadTiles() {
  const container = document.getElementById("tile-container");
  let tiles = JSON.parse(localStorage.getItem("tiles")) || [];

  tiles.forEach((tile) => {
    const newTile = document.createElement("div");
    newTile.className = "tile";

    newTile.innerHTML = `
  <div class="tile-toolbar">
    <button onclick="goBack(this)">⬅️</button>
    <button onclick="goForward(this)">➡️</button>
    <input type="text" class="url-input" value="${tile.url}">
    <button onclick="navigate(this)">Go</button>
    <button class="delete-btn" onclick="deleteTile(this)">Hapus</button>
  </div>
  <webview src="${tile.url}" partition="${tile.partition}" useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"></webview>
`;

    container.appendChild(newTile);
  });

  adjustGrid();
}

function deleteTile(button) {
  const container = document.getElementById("tile-container");
  const tile = button.closest(".tile"); // Cari elemen tile yang sesuai

  // Hapus tile dari tampilan
  container.removeChild(tile);

  // Ambil data tiles dari localStorage
  let tiles = JSON.parse(localStorage.getItem("tiles")) || [];

  // Temukan index tile yang ingin dihapus (berdasarkan URL atau partition)
  const tileUrl = tile.querySelector(".url-input").value;
  tiles = tiles.filter((t) => t.url !== tileUrl); // Filter yang tidak sesuai

  // Simpan kembali ke localStorage
  localStorage.setItem("tiles", JSON.stringify(tiles));

  adjustGrid(); // Sesuaikan grid setelah penghapusan
}

function resetLayout() {
  const container = document.getElementById("tile-container");
  container.innerHTML = ""; // Hapus semua tile dari tampilan

  // Hapus data tile dari localStorage
  localStorage.removeItem("tiles");

  // Reset layout grid ke default
  changeLayout("1"); // Kembali ke layout default (1 kolom)
}

function adjustGrid() {
  const container = document.getElementById("tile-container");
  const layout = document.getElementById("layout-selector")?.value;
  if (!layout || layout === "auto") {
    const count = container.children.length;
    container.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
    container.style.gridTemplateRows = "1fr";
  }
}

function navigate(button) {
  const tile = button.closest(".tile");
  const input = tile.querySelector(".url-input");
  const webview = tile.querySelector("webview");
  if (webview && input) {
    webview.loadURL(input.value);

    // UPDATE localStorage supaya URL baru tersimpan
    let tiles = JSON.parse(localStorage.getItem("tiles")) || [];
    const index = Array.from(tile.parentNode.children).indexOf(tile);
    if (tiles[index]) {
      tiles[index].url = input.value;
      localStorage.setItem("tiles", JSON.stringify(tiles));
    }
  }
}

function changeLayout(value) {
  const container = document.getElementById("tile-container");

  const match = value.trim().match(/^(\d+)x(\d+)$/i);
  if (match) {
    const cols = parseInt(match[1]);
    const rows = parseInt(match[2]);

    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gridAutoFlow = "row"; // penting

    // Simpan layout grid ke localStorage
    localStorage.setItem("layout", value);
  } else {
    container.style.gridTemplateColumns = "1fr";
    container.style.gridTemplateRows = "1fr";
  }
}

function loadLayout() {
  const layout = localStorage.getItem("layout");
  if (layout) {
    changeLayout(layout); // Atur grid layout
    const layoutInput = document.getElementById("layout-input");
    if (layoutInput) layoutInput.value = layout; // Isi input text juga
  }
}

function goBack(button) {
  const tile = button.closest(".tile");
  const webview = tile.querySelector("webview");
  if (webview && webview.canGoBack()) {
    webview.goBack();
  }
}

function goForward(button) {
  const tile = button.closest(".tile");
  const webview = tile.querySelector("webview");
  if (webview && webview.canGoForward()) {
    webview.goForward();
  }
}

window.goBack = goBack;
window.goForward = goForward;
window.changeLayout = changeLayout;
window.navigate = navigate;

window.onload = function () {
  adjustGrid();
  loadLayout();
  loadTiles(); // Muat tiles yang disimpan
};
