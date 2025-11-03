// Menunggu sampai semua elemen HTML siap
document.addEventListener("DOMContentLoaded", () => {
    
    // Pilih elemen-elemen yang kita butuhkan
    const inputTanggal = document.getElementById("input-tanggal");
    const inputCatatan = document.getElementById("input-catatan");
    const tombolSimpan = document.getElementById("tombol-simpan");
    const daftarCatatan = document.getElementById("daftar-catatan");

    // Mengatur tanggal hari ini secara default
    inputTanggal.valueAsDate = new Date();

    // Fungsi untuk memuat catatan dari localStorage
    function muatCatatan() {
        // Ambil data catatan (string) dari localStorage, atau string '[]' jika kosong
        const catatanTersimpan = localStorage.getItem("catatanHarian") || "[]";
        // Ubah string JSON menjadi array/object JavaScript
        const catatan = JSON.parse(catatanTersimpan);
        return catatan;
    }

    // Fungsi untuk menyimpan catatan ke localStorage
    function simpanCatatan(catatan) {
        // Ubah array/object JavaScript menjadi string JSON
        const catatanString = JSON.stringify(catatan);
        // Simpan ke localStorage
        localStorage.setItem("catatanHarian", catatanString);
    }

    // Fungsi untuk menampilkan semua catatan di halaman
    function tampilkanCatatan() {
        // Bersihkan daftar catatan sebelum menampilkan yang baru
        daftarCatatan.innerHTML = "";
        
        const catatan = muatCatatan();
        
        // Urutkan catatan dari yang terbaru (opsional)
        catatan.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

        if (catatan.length === 0) {
            daftarCatatan.innerHTML = "<p>Belum ada catatan.</p>";
            return;
        }

        catatan.forEach((item, index) => {
            // Buat elemen div baru untuk setiap catatan
            const divCatatan = document.createElement("div");
            divCatatan.classList.add("catatan-item");

            // Format tanggal agar lebih mudah dibaca (Opsional, tapi bagus)
            const tanggalCantik = new Date(item.tanggal).toLocaleDateString("id-ID", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
            });

            // Isi konten HTML untuk div catatan
            divCatatan.innerHTML = `
                <div class="header">
                    <strong>${tanggalCantik}</strong>
                    <button class="tombol-hapus" data-index="${index}">Hapus</button>
                </div>
                <p>${item.teks}</p>
            `;

            // Tambahkan div catatan baru ini ke dalam daftar
            daftarCatatan.appendChild(divCatatan);
        });

        // Tambahkan event listener untuk semua tombol hapus
        document.querySelectorAll(".tombol-hapus").forEach(tombol => {
            tombol.addEventListener("click", hapusCatatan);
        });
    }

    // Fungsi untuk menambah/menyimpan catatan baru
    function tambahCatatan() {
        const tanggal = inputTanggal.value;
        const teks = inputCatatan.value.trim(); // .trim() untuk hapus spasi awal/akhir

        if (!tanggal || !teks) {
            alert("Tanggal dan catatan tidak boleh kosong!");
            return;
        }

        const catatanBaru = { tanggal: tanggal, teks: teks };
        const catatan = muatCatatan();
        
        // Cek apakah sudah ada catatan untuk tanggal ini
        const indeksCatatan = catatan.findIndex(item => item.tanggal === tanggal);

        if (indeksCatatan > -1) {
            // Jika ada, timpa/update catatan lama
            catatan[indeksCatatan] = catatanBaru;
            alert("Catatan untuk tanggal ini telah diperbarui!");
        } else {
            // Jika tidak ada, tambahkan sebagai catatan baru
            catatan.push(catatanBaru);
            alert("Catatan baru berhasil disimpan!");
        }

        simpanCatatan(catatan); // Simpan ke localStorage
        tampilkanCatatan(); // Perbarui tampilan di halaman
        
        // Bersihkan input
        inputCatatan.value = "";
    }

    // Fungsi untuk menghapus catatan
    function hapusCatatan(event) {
        if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
            return; // Batalkan jika pengguna menekan 'Cancel'
        }

        // Ambil indeks dari atribut data-index
        const indexToUpdate = parseInt(event.target.getAttribute("data-index"));
        
        // Kita perlu mencari tanggal dari catatan yang ditampilkan untuk menghapus yang benar
        const catatan = muatCatatan();
        catatan.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Pastikan urutannya sama
        
        const tanggalUntukDihapus = catatan[indexToUpdate].tanggal;
        
        // Muat ulang semua catatan (yang belum disortir)
        let semuaCatatan = muatCatatan();
        // Filter: simpan semua catatan KECUALI yang tanggalnya sama
        semuaCatatan = semuaCatatan.filter(item => item.tanggal !== tanggalUntukDihapus);

        simpanCatatan(semuaCatatan); // Simpan array yang sudah difilter
        tampilkanCatatan(); // Perbarui tampilan
    }

    // Sambungkan event 'click' tombol simpan ke fungsi tambahCatatan
    tombolSimpan.addEventListener("click", tambahCatatan);

    // Tampilkan catatan yang ada saat halaman pertama kali dibuka
    tampilkanCatatan();
});