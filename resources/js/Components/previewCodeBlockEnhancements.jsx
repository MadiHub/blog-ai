// resources/js/Components/previewCodeBlockEnhancements.js

export function addCopyButtonsToCodeBlocks(rootElement) {
    if (!rootElement) {
        // console.warn('Root element tidak tersedia untuk menambahkan tombol salin.');
        return;
    }

    // 1. Hapus SEMUA tombol salin yang ada untuk menghindari duplikasi
    // Ini penting agar event listener lama juga dihapus.
    rootElement.querySelectorAll('.copy-code-button').forEach(button => {
        button.remove(); // Hapus tombol yang lama
    });

    // Hapus juga wrapper lama jika ada, dan pindahkan kembali pre ke parent aslinya
    rootElement.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
        const preBlock = wrapper.querySelector('pre');
        if (preBlock) {
            // Pindahkan kembali preBlock ke parent aslinya sebelum menghapus wrapper
            wrapper.parentNode.insertBefore(preBlock, wrapper);
        }
        wrapper.remove();
    });


    // 2. Cari semua elemen <pre> di dalam rootElement
    const codeBlocks = rootElement.querySelectorAll('pre');
    // console.log('Jumlah elemen <pre> yang ditemukan:', codeBlocks.length);


    codeBlocks.forEach(preBlock => {
        // Hanya proses jika preBlock belum memiliki tombol copy (untuk jaga-jaga)
        if (preBlock.closest('.code-block-wrapper')) {
            // console.log('Code block sudah memiliki wrapper, melewati.');
            return; // Seharusnya tidak terjadi setelah langkah 1, tapi untuk keamanan
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper'; // Tambahkan kelas untuk styling

        // Sisipkan wrapper sebelum preBlock di DOM
        preBlock.parentNode.insertBefore(wrapper, preBlock);
        // Pindahkan preBlock ke dalam wrapper
        wrapper.appendChild(preBlock);

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button'; // Tambahkan kelas untuk styling
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Salin'; // Font Awesome icon

        // Tambahkan event listener ke tombol BARU yang dibuat
        copyButton.addEventListener('click', () => {
            // Ambil teks dari elemen <code> di dalam <pre> jika ada, atau dari <pre> itu sendiri
            const codeContent = preBlock.querySelector('code')?.textContent || preBlock.textContent;

            navigator.clipboard.writeText(codeContent)
                .then(() => {
                    copyButton.textContent = 'Disalin!';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i> Salin';
                    }, 2000);
                })
                .catch(err => {
                    // console.error('Gagal menyalin code block:', err);
                    // Gunakan SweetAlert2 untuk feedback error
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Menyalin',
                        text: 'Terjadi kesalahan saat menyalin kode.',
                    });
                });
        });

        // Tambahkan tombol ke wrapper
        wrapper.appendChild(copyButton);
        // console.log('Tombol Salin ditambahkan untuk:', preBlock);
    });
    // console.log('Copy buttons (re)applied to code blocks.');
}