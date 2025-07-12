// Menunggu hingga seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // Mendapatkan keranjang dari localStorage atau membuat array kosong jika tidak ada
    // Menggunakan key "cart_sabrina" sesuai permintaan
    let cart = JSON.parse(localStorage.getItem('cart_sabrina')) || [];

    // === ELEMEN DOM ===
    const cartCountElement = document.querySelector('.cart-count');
    const buyButtons = document.querySelectorAll('.btn-buy');
    const notificationElement = document.getElementById('notification');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary');

    // === FUNGSI-FUNGSI ===

    /**
     * Fungsi untuk menyimpan keranjang ke localStorage.
     */
    /**
     * Fungsi untuk menyimpan keranjang ke localStorage dengan key "cart_sabrina".
     */
    function saveCart() {
        localStorage.setItem('cart_sabrina', JSON.stringify(cart));
    }

    /**
     * Fungsi untuk memperbarui jumlah item di ikon keranjang.
     */
    function updateCartCount() {
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            // Menggunakan badge untuk jumlah item
            cartCountElement.textContent = totalItems;
        }
    }

    /**
     * Fungsi untuk menampilkan notifikasi.
     * @param {string} message - Pesan yang akan ditampilkan.
     */
    function showNotification(message) {
        if (notificationElement) {
            notificationElement.textContent = message;
            notificationElement.classList.add('show');
            setTimeout(() => {
                notificationElement.classList.remove('show');
            }, 2000); // Notifikasi hilang setelah 2 detik
        }
    }

    /**
     * Fungsi untuk menambahkan produk ke keranjang.
     * @param {Event} e - Event object dari tombol yang diklik.
     */
    function addToCart(e) {
        // Mengambil data produk dari atribut data-* tombol
        const button = e.target;
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        const image = button.dataset.image;

        // Mengecek apakah produk sudah ada di keranjang
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            // Jika sudah ada, tambahkan jumlahnya
            existingItem.quantity++;
        } else {
            // Jika belum ada, tambahkan sebagai item baru
            cart.push({ id, name, price, image, quantity: 1 });
        }

        // Simpan perubahan ke localStorage
        saveCart();
        // Perbarui tampilan jumlah item di keranjang
        updateCartCount();
        // Tampilkan notifikasi
        // Menampilkan alert sesuai permintaan
        showNotification('Produk berhasil ditambahkan ke keranjang!');
    }

    /**
     * Fungsi untuk mengubah jumlah produk di keranjang.
     * @param {string} id - ID produk yang akan diubah.
     * @param {number} newQuantity - Jumlah baru.
     */
    function changeQuantity(id, newQuantity) {
        const item = cart.find(item => item.id === id);
        if (item) {
            if (newQuantity > 0) {
                item.quantity = newQuantity;
            } else {
                // Hapus item jika kuantitas menjadi 0 atau kurang
                removeFromCart(id);
                return; // Keluar dari fungsi agar tidak render ulang dua kali
            }
        }
        saveCart();
        displayCartItems(); // Render ulang halaman keranjang
        updateCartCount();
    }

    /**
     * Fungsi untuk menghapus produk dari keranjang.
     * @param {string} id - ID produk yang akan dihapus.
     */
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        displayCartItems(); // Render ulang halaman keranjang
        updateCartCount();
        showNotification('Produk dihapus dari keranjang.');
    }

    /**
     * Fungsi untuk menghapus seluruh isi keranjang.
     */
    function clearCart() {
        cart = []; // Kosongkan array keranjang
        saveCart();
        displayCartItems(); // Render ulang halaman keranjang
        updateCartCount();
        showNotification('Semua item telah dihapus dari keranjang.');
    }

    /**
     * Fungsi untuk menampilkan item di halaman keranjang.
     */
    function displayCartItems() {
        // Hanya berjalan jika elemen kontainer keranjang ada di halaman
        if (cartItemsContainer && cartSummaryContainer) {
            cartItemsContainer.innerHTML = ''; // Kosongkan kontainer
            cartSummaryContainer.innerHTML = '';

            // Kondisi jika keranjang kosong
            if (cart.length === 0) {
                const emptyCartHTML = `
                    <div class="empty-cart-message">
                        <h3>Belum ada barang di keranjang. Gak keren kalo belum checkout!</h3>
                        <a href="produk.html" class="btn">Lihat Sneakers</a>
                    </div>
                `;
                cartItemsContainer.innerHTML = emptyCartHTML;
            } else {
                // Kondisi jika keranjang terisi
                let total = 0;
                
                // Pesan  di atas daftar produk
                const cartHeader = document.createElement('p');
                cartHeader.textContent = "Keren! udah siap dibawa pulang.";
                cartHeader.style.textAlign = 'center';
                cartHeader.style.marginBottom = '20px';
                cartHeader.style.fontSize = '1.2rem';
                cartItemsContainer.appendChild(cartHeader);

                // Loop melalui setiap item di keranjang dan buat elemen HTML-nya
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    // Menambahkan detail: kuantitas, total per item
                    cartItemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>Harga: Rp ${item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <label>Kuantitas:</label>
                            <input type="number" class="item-quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                        </div>
                        <div class="cart-item-total">
                            <p>Total: Rp ${itemTotal.toLocaleString('id-ID')}</p>
                        </div>
                        <div class="cart-item-actions">
                            <button class="btn-remove" data-id="${item.id}" title="Hapus Item"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                });

                // Tampilkan ringkasan total belanja
                const summaryElement = document.createElement('div');
                summaryElement.innerHTML = `
                    <h3>Total Keseluruhan</h3>
                    <p class="total-price">Rp ${total.toLocaleString('id-ID')}</p>
                    <div class="cart-summary-buttons">
                        <button class="btn btn-danger" id="clear-cart-btn">Hapus Semua</button>
                        <button class="btn">Checkout Sekarang</button>
                    </div>
                `;
                cartSummaryContainer.appendChild(summaryElement);

                // Tambahkan event listener untuk tombol dan input
                document.querySelectorAll('.btn-remove').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = e.currentTarget.dataset.id;
                        removeFromCart(id);
                    });
                });

                document.querySelectorAll('.item-quantity').forEach(input => {
                    input.addEventListener('change', (e) => {
                        const id = e.target.dataset.id;
                        const newQuantity = parseInt(e.target.value);
                        changeQuantity(id, newQuantity);
                    });
                });

                document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
            }
        }
    }


    // === EVENT LISTENERS & INISIALISASI ===

    // Tambahkan event listener ke semua tombol "Beli"
    buyButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Inisialisasi saat halaman dimuat
    updateCartCount(); // Perbarui hitungan keranjang saat halaman pertama kali dibuka
    displayCartItems(); // Tampilkan item jika berada di halaman keranjang

});

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-nav');

    if (toggleButton && navMenu) {
        toggleButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});
