document.addEventListener("DOMContentLoaded", () => {
    
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
        daftarCatatan.innerHTML = "";
        
        const catatan = muatCatatan();
        
        // Urutkan catatan dari yang terbaru (berdasarkan ID kapan dibuat)
        catatan.sort((a, b) => b.id - a.id);

        if (catatan.length === 0) {
            daftarCatatan.innerHTML = "<p>Belum ada catatan.</p>";
            return;
        }

        catatan.forEach((item) => {
            const divCatatan = document.createElement("div");
            divCatatan.classList.add("catatan-item");

            const tanggalCantik = new Date(item.tanggal).toLocaleDateString("id-ID", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
            });

            // PERUBAHAN: Tombol hapus sekarang menggunakan 'data-id'
            divCatatan.innerHTML = `
                <div class="header">
                    <strong>${tanggalCantik}</strong>
                    <button class="tombol-hapus" data-id="${item.id}">Hapus</button>
                </div>
                <p>${item.teks}</p>
            `;

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
        const teks = inputCatatan.value.trim();

        if (!tanggal || !teks) {
            alert("Tanggal dan catatan tidak boleh kosong!");
            return;
        }

        // PERUBAHAN: Buat ID unik menggunakan waktu (timestamp)
        const idCatatanBaru = Date.now(); 

        const catatanBaru = { 
            id: idCatatanBaru, 
            tanggal: tanggal, 
            teks: teks 
        };
        
        const catatan = muatCatatan();
        
        // PERUBAHAN: Logika "update" dihapus. Kita SELALU menambah catatan baru.
        // Ini memungkinkan beberapa catatan di tanggal yang sama.
        catatan.push(catatanBaru);
        
        alert("Catatan baru berhasil disimpan!");

        simpanCatatan(catatan);
        tampilkanCatatan();
        
        inputCatatan.value = "";
    }

    // Fungsi untuk menghapus catatan
    function hapusCatatan(event) {
        if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
            return;
        }

        // PERUBAHAN: Ambil ID unik dari tombol yang diklik
        const idUntukDihapus = Number(event.target.getAttribute("data-id"));
        
        let catatan = muatCatatan();
        
        // PERUBAHAN: Filter array, simpan semua catatan KECUALI
        // yang ID-nya cocok dengan idUntukDihapus
        catatan = catatan.filter(item => item.id !== idUntukDihapus);

        simpanCatatan(catatan);
        tampilkanCatatan();
    }

    tombolSimpan.addEventListener("click", tambahCatatan);
    tampilkanCatatan();
});
