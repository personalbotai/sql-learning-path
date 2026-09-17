// SQL Learning Path — Core Application & SQLite WASM Engine
(function() {
    'use strict';

    let db = null;
    let SQL = null;
    let currentLesson = 0;
    let completedLessons = new Set();
    const STORAGE_KEY = 'sql_completed_lessons';
    const RESUME_KEY = 'sql_last_lesson';

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) completedLessons = new Set(JSON.parse(saved));
    } catch(e) {}

    const lessons = [
  {
    "id": "sql-01",
    "title": "1. Pengantar Relational Database & SQL",
    "module": "Modul 1: Fondasi Relational DB & DDL",
    "duration": "15 Menit",
    "level": "Pemula",
    "content_md": "# 1. Pengantar Relational Database & SQL\n\nRelational Database Management System (**RDBMS**) mengorganisasi data ke dalam tabel-tabel terstruktur yang terdiri dari baris (*rows/records*) dan kolom (*columns/attributes*).\n\n### Kategori Perintah SQL\n- **DDL (Data Definition Language)**: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`\n- **DML (Data Manipulation Language)**: `SELECT`, `INSERT`, `UPDATE`, `DELETE`\n- **DCL (Data Control Language)**: `GRANT`, `REVOKE`\n- **TCL (Transaction Control Language)**: `COMMIT`, `ROLLBACK`, `SAVEPOINT`\n\n### Menjalankan SQLite WASM\nEditor interaktif di bawah menjalankan engine C SQLite versi penuh yang dikompilasi ke WebAssembly langsung di dalam browser Anda.",
    "code": "-- Tampilkan versi engine SQLite WASM yang sedang berjalan\nSELECT sqlite_version() AS engine_version, CURRENT_TIMESTAMP AS waktu_query;",
    "quiz": {
      "question": "Kategori perintah SQL mana yang bertanggung jawab untuk mendefinisikan atau memodifikasi skema struktur tabel database?",
      "options": [
        "DML (Data Manipulation Language)",
        "DDL (Data Definition Language)",
        "TCL (Transaction Control Language)",
        "DCL (Data Control Language)"
      ],
      "answer": 1,
      "explanation": "DDL (Data Definition Language) seperti CREATE, ALTER, dan DROP digunakan khusus untuk merancang struktur dan skema database, sedangkan manipulasi data (isi baris) dilakukan oleh DML."
    }
  },
  {
    "id": "sql-02",
    "title": "2. CREATE TABLE, Data Types & Constraints",
    "module": "Modul 1: Fondasi Relational DB & DDL",
    "duration": "20 Menit",
    "level": "Pemula",
    "content_md": "# 2. CREATE TABLE, Data Types & Constraints\n\nConstraints memastikan integritas data pada level database:\n- `PRIMARY KEY`: Unik dan NOT NULL secara implisit.\n- `NOT NULL`: Kolom wajib diisi.\n- `UNIQUE`: Nilai tidak boleh duplikat.\n- `CHECK`: Memvalidasi kondisi logika bisnis sebelum data disimpan.\n- `DEFAULT`: Nilai bawaan jika tidak diisi saat insert.",
    "code": "CREATE TABLE employees (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT NOT NULL,\n    email TEXT UNIQUE NOT NULL,\n    salary REAL CHECK(salary >= 3000000),\n    department TEXT DEFAULT 'General',\n    created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Verifikasi skema tabel yang berhasil dibuat\nPRAGMA table_info(employees);",
    "quiz": {
      "question": "Apa fungsi dari constraint CHECK(salary >= 3000000) pada definisi kolom tabel?",
      "options": [
        "Mengubah otomatis gaji yang di bawah 3 juta menjadi 3 juta",
        "Menolak query INSERT/UPDATE jika nilai salary bernilai kurang dari 3.000.000",
        "Memberikan nilai default 3 juta jika nilai gaji dikosongkan",
        "Membuat index khusus untuk kolom salary di atas 3 juta"
      ],
      "answer": 1,
      "explanation": "Constraint CHECK bertindak sebagai validasi integritas level engine — jika ada data yang melanggar kondisi boolean tersebut, RDBMS akan melempar error Constraint Violation dan membatalkan query."
    }
  },
  {
    "id": "sql-03",
    "title": "3. ALTER TABLE & DROP TABLE",
    "module": "Modul 1: Fondasi Relational DB & DDL",
    "duration": "15 Menit",
    "level": "Pemula",
    "content_md": "# 3. ALTER TABLE & DROP TABLE\n\nSkema database aplikasi sering kali berkembang seiring waktu. SQL menyediakan perintah `ALTER TABLE` untuk memodifikasi tabel yang sudah ada tanpa menghapus data di dalamnya:\n- `ALTER TABLE ... ADD COLUMN`: Menambah kolom baru.\n- `ALTER TABLE ... RENAME TO`: Mengubah nama tabel.\n- `ALTER TABLE ... RENAME COLUMN ... TO`: Mengubah nama kolom.",
    "code": "CREATE TABLE customers (id INTEGER PRIMARY KEY, full_name TEXT NOT NULL);\n\n-- Tambahkan kolom nomor telepon\nALTER TABLE customers ADD COLUMN phone_number TEXT;\n\n-- Tambah kolom status aktif\nALTER TABLE customers ADD COLUMN is_active INTEGER DEFAULT 1;\n\nPRAGMA table_info(customers);",
    "quiz": {
      "question": "Apa perbedaan mendasar antara perintah DROP TABLE dan TRUNCATE/DELETE?",
      "options": [
        "DROP TABLE hanya menghapus data dan mempertahankan skema tabel",
        "DROP TABLE menghapus seluruh data sekaligus skema dan definisi tabel dari database secara permanen",
        "TRUNCATE menghapus database beserta seluruh tabelnya",
        "DELETE menghapus struktur kolom tertentu tanpa menyentuh baris data"
      ],
      "answer": 1,
      "explanation": "DROP TABLE menghapus tabel beserta seluruh definisi metadata dan skemanya dari catalog database, sedangkan DELETE/TRUNCATE mengosongkan baris data namun struktur tabelnya tetap ada."
    }
  },
  {
    "id": "sql-04",
    "title": "4. INSERT, Bulk INSERT & DEFAULT Values",
    "module": "Modul 2: Manipulasi Data (DML)",
    "duration": "20 Menit",
    "level": "Pemula",
    "content_md": "# 4. INSERT, Bulk INSERT & DEFAULT Values\n\nPerintah `INSERT INTO` menyisipkan baris baru ke dalam tabel. Anda dapat menyisipkan single-row maupun multi-row (bulk insert) dalam satu query efisien.",
    "code": "CREATE TABLE products (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT NOT NULL,\n    price REAL NOT NULL,\n    stock INTEGER DEFAULT 0\n);\n\n-- Bulk insert 3 produk sekaligus\nINSERT INTO products (name, price, stock) VALUES\n    ('Mechanical Keyboard', 750000, 25),\n    ('Wireless Mouse', 350000, 50),\n    ('Gaming Monitor 24 Inch', 1850000, 12);\n\nSELECT * FROM products;",
    "quiz": {
      "question": "Jika suatu kolom memiliki constraint DEFAULT dan kita tidak menyertakan kolom tersebut pada query INSERT INTO, apa yang terjadi?",
      "options": [
        "Database melempar error not null violation",
        "Database otomatis mengisi kolom tersebut dengan nilai yang ditentukan pada klausa DEFAULT",
        "Kolom akan selalu diisi nilai NULL mengabaikan default",
        "Proses insert akan gagal dan membatalkan transaksi"
      ],
      "answer": 1,
      "explanation": "Jika kolom tidak disebutkan dalam daftar kolom INSERT, RDBMS akan secara otomatis mengevaluasi ekspresi DEFAULT yang telah didefinisikan saat CREATE TABLE."
    }
  },
  {
    "id": "sql-05",
    "title": "5. SELECT, WHERE, ORDER BY & LIMIT",
    "module": "Modul 2: Manipulasi Data (DML)",
    "duration": "20 Menit",
    "level": "Pemula",
    "content_md": "# 5. SELECT, WHERE, ORDER BY & LIMIT\n\nQuery pembacaan data memanfaatkan operator filtering dan pengurutan:\n- Operator: `=`, `!= / <>`, `<`, `>`, `BETWEEN ... AND ...`, `IN (...)`, `LIKE '%pattern%'`\n- Pengurutan: `ORDER BY column_name [ASC|DESC]`\n- Paginasi: `LIMIT n OFFSET m`",
    "code": "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, role TEXT, score INTEGER);\nINSERT INTO users (name, role, score) VALUES\n    ('Budi', 'Developer', 92),\n    ('Siti', 'Designer', 88),\n    ('Rian', 'Developer', 95),\n    ('Dewi', 'Manager', 85),\n    ('Eko', 'Developer', 78);\n\n-- Ambil 2 Developer dengan score tertinggi\nSELECT name, role, score \nFROM users \nWHERE role = 'Developer' AND score >= 80\nORDER BY score DESC \nLIMIT 2;",
    "quiz": {
      "question": "Klausa SQL mana yang dievaluasi terlebih dahulu oleh database query engine?",
      "options": [
        "ORDER BY dievaluasi sebelum WHERE",
        "SELECT dievaluasi sebelum WHERE",
        "WHERE dievaluasi sebelum SELECT dan ORDER BY",
        "LIMIT dievaluasi sebelum WHERE"
      ],
      "answer": 2,
      "explanation": "Secara urutan eksekusi logika SQL (Logical Query Processing): FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT."
    }
  },
  {
    "id": "sql-06",
    "title": "6. UPDATE & DELETE dengan Filter Aman",
    "module": "Modul 2: Manipulasi Data (DML)",
    "duration": "15 Menit",
    "level": "Pemula",
    "content_md": "# 6. UPDATE & DELETE dengan Filter Aman\n\n**PERINGATAN KRUSIAL**: Menjalankan `UPDATE` atau `DELETE` tanpa klausa `WHERE` akan memodifikasi atau menghapus **SELURUH** baris di dalam tabel!",
    "code": "CREATE TABLE inventory (id INTEGER PRIMARY KEY, item TEXT, stock INTEGER, is_active INTEGER);\nINSERT INTO inventory (item, stock, is_active) VALUES\n    ('Laptop', 5, 1),\n    ('Mouse', 0, 1),\n    ('Keyboard', 0, 1);\n\n-- Update item yang stoknya 0 menjadi non-aktif\nUPDATE inventory SET is_active = 0 WHERE stock = 0;\n\n-- Hapus item yang non-aktif\nDELETE FROM inventory WHERE is_active = 0;\n\nSELECT * FROM inventory;",
    "quiz": {
      "question": "Apa dampak menjalankan query: UPDATE employees SET salary = salary * 1.1; tanpa menyertakan klausa WHERE?",
      "options": [
        "Query akan gagal dengan syntax error karena WHERE wajib",
        "Seluruh karyawan di tabel employees akan mengalami kenaikan gaji 10%",
        "Hanya baris pertama tabel yang akan diperbarui",
        "Hanya karyawan aktif yang diperbarui"
      ],
      "answer": 1,
      "explanation": "Tanpa klausa WHERE, operasi UPDATE akan mengaplikasikan perubahan ekspresi ke setiap baris (record) yang ada di dalam tabel tersebut."
    }
  },
  {
    "id": "sql-07",
    "title": "7. Relasi Tabel & Foreign Key Constraints",
    "module": "Modul 3: Relasi & Multi-Table Queries",
    "duration": "20 Menit",
    "level": "Menengah",
    "content_md": "# 7. Relasi Tabel & Foreign Key Constraints\n\nForeign Key menghubungkan baris data antar tabel dan menjaga integritas referensial (*Referential Integrity*).\n\n### Opsi ON DELETE / ON UPDATE\n- `CASCADE`: Jika parent dihapus, record child otomatis ikut terhapus.\n- `SET NULL`: Jika parent dihapus, foreign key di child diubah menjadi NULL.\n- `RESTRICT`: Melarang penghapusan parent selama masih ada child yang merujuk.",
    "code": "PRAGMA foreign_keys = ON;\n\nCREATE TABLE departments (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT NOT NULL\n);\n\nCREATE TABLE staff (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT NOT NULL,\n    dept_id INTEGER,\n    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE\n);\n\nINSERT INTO departments (name) VALUES ('Engineering'), ('Design');\nINSERT INTO staff (name, dept_id) VALUES ('Andi', 1), ('Maya', 2);\n\nSELECT s.name AS staff_name, d.name AS department \nFROM staff s \nJOIN departments d ON s.dept_id = d.id;",
    "quiz": {
      "question": "Apa yang terjadi pada data child jika foreign key disetel dengan ON DELETE CASCADE saat record parent dihapus?",
      "options": [
        "Penghapusan parent ditolak database",
        "Semua baris child yang mereferensikan record parent tersebut akan otomatis ikut terhapus",
        "Kolom foreign key pada record child diubah menjadi NULL",
        "Data child dipindahkan ke tabel backup"
      ],
      "answer": 1,
      "explanation": "ON DELETE CASCADE memastikan penghapusan berantai: jika parent record dihapus, RDBMS secara otomatis menghapus seluruh record child terkait demi mencegah orphaned records."
    }
  },
  {
    "id": "sql-08",
    "title": "8. INNER JOIN, LEFT JOIN & CROSS JOIN",
    "module": "Modul 3: Relasi & Multi-Table Queries",
    "duration": "25 Menit",
    "level": "Menengah",
    "content_md": "# 8. INNER JOIN, LEFT JOIN & CROSS JOIN\n\nJOIN menggabungkan kolom dari dua atau lebih tabel berdasarkan kolom relasi yang berkesesuaian:\n- **INNER JOIN**: Hanya mengembalikan baris yang memiliki pasangan kecocokan di kedua tabel.\n- **LEFT (OUTER) JOIN**: Mengembalikan seluruh baris dari tabel kiri (*left*), dan nilai kolom kanan bernilai NULL jika tidak ada kecocokan.\n- **CROSS JOIN**: Menghasilkan *Cartesian Product* (N x M kombinasi baris).",
    "code": "CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT);\nCREATE TABLE books (id INTEGER PRIMARY KEY, author_id INTEGER, title TEXT);\n\nINSERT INTO authors (id, name) VALUES (1, 'Pramoedya'), (2, 'Tere Liye'), (3, 'Andrea Hirata');\nINSERT INTO books (author_id, title) VALUES (1, 'Bumi Manusia'), (1, 'Anak Semua Bangsa'), (2, 'Hujan');\n\n-- LEFT JOIN menampilkan semua author meskipun belum ada buku terdaftar\nSELECT a.name AS author, COALESCE(b.title, '[Belum Ada Buku]') AS book_title\nFROM authors a\nLEFT JOIN books b ON a.id = b.author_id;",
    "quiz": {
      "question": "Kapan sebaiknya kita menggunakan LEFT JOIN dibanding INNER JOIN?",
      "options": [
        "Saat hanya ingin menampilkan data yang 100% cocok di kedua tabel",
        "Saat ingin mempertahankan seluruh record dari tabel utama (kiri) meskipun record pasangannya tidak ditemukan di tabel kanan",
        "Saat ingin meningkatkan kecepatan query index",
        "Saat menggabungkan dua tabel tanpa kondisi ON"
      ],
      "answer": 1,
      "explanation": "LEFT JOIN memastikan tidak ada data dari tabel kiri yang hilang akibat tidak adanya relasi di tabel kanan, mengisi kolom yang tidak cocok dengan nilai NULL."
    }
  },
  {
    "id": "sql-09",
    "title": "9. Aggregate Functions & GROUP BY",
    "module": "Modul 3: Relasi & Multi-Table Queries",
    "duration": "20 Menit",
    "level": "Menengah",
    "content_md": "# 9. Aggregate Functions & GROUP BY\n\nFungsi agregasi menghitung sekumpulan nilai menjadi satu nilai ringkasan:\n- `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`\n\nKlausa `GROUP BY` mengelompokkan baris berdasarkan satu atau beberapa kolom untuk dianalisis oleh fungsi agregasi.",
    "code": "CREATE TABLE sales (id INTEGER PRIMARY KEY, category TEXT, amount REAL, qty INTEGER);\nINSERT INTO sales (category, amount, qty) VALUES\n    ('Elektronik', 2500000, 2),\n    ('Elektronik', 1200000, 4),\n    ('Pakaian', 350000, 5),\n    ('Pakaian', 150000, 2),\n    ('Buku', 95000, 3);\n\nSELECT \n    category,\n    COUNT(*) AS total_transaksi,\n    SUM(amount) AS omzet_total,\n    AVG(amount) AS rata_rata_omzet\nFROM sales\nGROUP BY category\nORDER BY omzet_total DESC;",
    "quiz": {
      "question": "Apa fungsi dari klausa GROUP BY dalam query SQL?",
      "options": [
        "Mengurutkan baris data secara ascending atau descending",
        "Mengelompokkan baris-baris data yang memiliki nilai kolom yang sama ke dalam baris ringkasan untuk fungsi agregasi",
        "Menghapus baris duplikat dari hasil select",
        "Membatasi jumlah baris maksimum yang dikembalikan"
      ],
      "answer": 1,
      "explanation": "GROUP BY mereduksi baris-baris yang memiliki kesamaan nilai pada kolom grup menjadi satu baris agregat sehingga fungsi seperti SUM, COUNT, atau AVG dapat dihitung per kelompok."
    }
  },
  {
    "id": "sql-10",
    "title": "10. Filter Agregasi dengan HAVING",
    "module": "Modul 3: Relasi & Multi-Table Queries",
    "duration": "20 Menit",
    "level": "Menengah",
    "content_md": "# 10. Filter Agregasi dengan HAVING\n\n### Perbedaan Fundamental WHERE vs HAVING\n- **WHERE**: Menyaring baris data mentah **sebelum** dilakukan pengelompokan (*grouping/aggregation*).\n- **HAVING**: Menyaring kelompok data **setelah** fungsi agregasi selesai dihitung.",
    "code": "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, total REAL);\nINSERT INTO orders (customer, total) VALUES\n    ('Alice', 500000), ('Alice', 800000), ('Alice', 200000),\n    ('Bob', 150000), ('Bob', 100000),\n    ('Charlie', 2500000);\n\n-- Cari customer yang total akumulasi belanjanya di atas 1 Juta\nSELECT \n    customer,\n    COUNT(*) AS jumlah_order,\n    SUM(total) AS total_belanja\nFROM orders\nGROUP BY customer\nHAVING SUM(total) >= 1000000\nORDER BY total_belanja DESC;",
    "quiz": {
      "question": "Mengapa kita tidak bisa menulis query: SELECT dept, AVG(salary) FROM emp WHERE AVG(salary) > 5000000 GROUP BY dept; ?",
      "options": [
        "Karena AVG hanya boleh digunakan bersama fungsi SUM",
        "Karena klausa WHERE dievaluasi sebelum grouping terjadi, sehingga hasil agregat belum ada saat WHERE diproses",
        "Karena GROUP BY harus ditulis sebelum klausa WHERE",
        "Karena nama kolom dept tidak terdaftar"
      ],
      "answer": 1,
      "explanation": "WHERE memfilter data individual pada tahap awal sebelum agregasi terbentuk. Untuk memfilter hasil fungsi agregat seperti AVG() atau SUM(), Anda wajib menggunakan klausa HAVING setelah GROUP BY."
    }
  },
  {
    "id": "sql-11",
    "title": "11. Subqueries & Operator IN / EXISTS",
    "module": "Modul 4: Query Lanjut, Subqueries & CTE",
    "duration": "25 Menit",
    "level": "Menengah",
    "content_md": "# 11. Subqueries & Operator IN / EXISTS\n\nSubquery (*nested query*) adalah query yang disematkan di dalam query SQL lain (pada klausa WHERE, FROM, atau SELECT).\n\n- **IN / NOT IN**: Memeriksa keberadaan nilai dalam daftar hasil subquery.\n- **EXISTS / NOT EXISTS**: Menguji apakah subquery menghasilkan minimal 1 baris (sangat optimal karena short-circuit evaluation).",
    "code": "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT);\nCREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary REAL, dept_id INTEGER);\n\nINSERT INTO departments VALUES (1, 'IT'), (2, 'HR'), (3, 'Marketing');\nINSERT INTO employees VALUES (1, 'Farhan', 9000000, 1), (2, 'Rina', 12000000, 1), (3, 'Bagus', 6000000, 2);\n\n-- Cari karyawan yang gajinya di atas rata-rata seluruh perusahaan\nSELECT name, salary \nFROM employees \nWHERE salary > (SELECT AVG(salary) FROM employees);",
    "quiz": {
      "question": "Apa keunggulan performa penggunaan operator EXISTS dibandingkan IN untuk pemeriksaan relasi subquery berskala besar?",
      "options": [
        "EXISTS tidak pernah melempar runtime error",
        "EXISTS melakukan short-circuit evaluation (berhenti begitu baris kecocokan pertama ditemukan) tanpa memuat seluruh result set ke memori",
        "IN selalu mengabaikan index database",
        "EXISTS otomatis mengubah query menjadi JOIN biasa"
      ],
      "answer": 1,
      "explanation": "Operator EXISTS mengevaluasi nilai boolean secara efisien — engine database berhenti memindai subquery segera setelah menemukan 1 baris yang cocok (short-circuit)."
    }
  },
  {
    "id": "sql-12",
    "title": "12. Common Table Expressions (CTE) & WITH Clause",
    "module": "Modul 4: Query Lanjut, Subqueries & CTE",
    "duration": "25 Menit",
    "level": "Menengah",
    "content_md": "# 12. Common Table Expressions (CTE) & WITH Clause\n\n**Common Table Expression (CTE)** mendefinisikan *temporary result set* bernama yang hanya ada selama durasi eksekusi query utama menggunakan klausa `WITH`.\n\n### Manfaat CTE\n1. **Keterbacaan (*Readability*)**: Mengurai subquery kompleks bertingkat menjadi langkah modular.\n2. **Reusability**: Dapat dirujuk berulang kali dalam query yang sama.",
    "code": "CREATE TABLE transactions (id INTEGER PRIMARY KEY, user_id INTEGER, amount REAL, category TEXT);\nINSERT INTO transactions (user_id, amount, category) VALUES\n    (1, 50000, 'Food'), (1, 150000, 'Tech'), (1, 75000, 'Food'),\n    (2, 300000, 'Tech'), (2, 80000, 'Transport');\n\n-- CTE menghitung ringkasan per user sebelum di-query\nWITH UserSpending AS (\n    SELECT user_id, SUM(amount) AS total_spend, COUNT(*) AS txn_count\n    FROM transactions\n    GROUP BY user_id\n)\nSELECT user_id, total_spend, txn_count, \n       CASE WHEN total_spend > 200000 THEN 'High Spender' ELSE 'Regular' END AS user_tier\nFROM UserSpending;",
    "quiz": {
      "question": "Apa kata kunci SQL yang digunakan untuk mengawali definisi Common Table Expression (CTE)?",
      "options": [
        "DEFINE",
        "LET",
        "WITH",
        "TEMPORARY"
      ],
      "answer": 2,
      "explanation": "Klausa WITH digunakan untuk mendefinisikan satu atau lebih CTE sebelum query utama SELECT/INSERT/UPDATE dieksekusi."
    }
  },
  {
    "id": "sql-13",
    "title": "13. Recursive CTE untuk Data Hierarki",
    "module": "Modul 4: Query Lanjut, Subqueries & CTE",
    "duration": "25 Menit",
    "level": "Lanjutan",
    "content_md": "# 13. Recursive CTE untuk Data Hierarki\n\n**Recursive CTE** adalah fitur canggih SQL untuk menelusuri data berstruktur pohon/hierarki seperti bagan organisasi perusahaan, kategori bersarang, atau graf rute jaringan.\n\n### Struktur Recursive CTE\n1. **Anchor Member**: Query dasar yang mengembalikan baris awal (root node).\n2. **`UNION ALL`**: Penggabung iterasi.\n3. **Recursive Member**: Query yang merujuk kembali ke nama CTE itu sendiri.",
    "code": "CREATE TABLE org_chart (id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER);\nINSERT INTO org_chart VALUES\n    (1, 'CEO - Hendra', NULL),\n    (2, 'VP Tech - Satria', 1),\n    (3, 'VP Product - Lisa', 1),\n    (4, 'Lead Backend - Doni', 2),\n    (5, 'Senior Engineer - Nadia', 4);\n\n-- Telusuri rantai hierarki dari CEO ke bawah beserta kedalaman levelnya\nWITH RECURSIVE Hierarchy AS (\n    -- Anchor member\n    SELECT id, name, manager_id, 1 AS level\n    FROM org_chart\n    WHERE manager_id IS NULL\n    \n    UNION ALL\n    \n    -- Recursive member\n    SELECT o.id, o.name, o.manager_id, h.level + 1\n    FROM org_chart o\n    JOIN Hierarchy h ON o.manager_id = h.id\n)\nSELECT level, name FROM Hierarchy ORDER BY level, id;",
    "quiz": {
      "question": "Bagian apa yang wajib ada di dalam Recursive CTE untuk mencegah infinite loop?",
      "options": [
        "Kondisi terminasi pada join/filter recursive member dan anchor member yang mengembalikan initial set",
        "Klausa DROP TABLE otomatis",
        "Index B-Tree pada kolom primary key",
        "Klausa HAVING SUM() > 0"
      ],
      "answer": 0,
      "explanation": "Recursive CTE membutuhkan Anchor Member sebagai titik awal serta kondisi join/filter pada Recursive Member yang pada akhirnya mengembalikan result set kosong untuk mengakhiri iterasi."
    }
  },
  {
    "id": "sql-14",
    "title": "14. CASE WHEN Expressions & Conditional Logic",
    "module": "Modul 4: Query Lanjut, Subqueries & CTE",
    "duration": "15 Menit",
    "level": "Menengah",
    "content_md": "# 14. CASE WHEN Expressions & Conditional Logic\n\nEkspresi `CASE WHEN` menyediakan percabangan logika (*if-else*) langsung di dalam query SQL.\n\n### Sintaks Umum\n```sql\nCASE\n    WHEN kondisi_1 THEN hasil_1\n    WHEN kondisi_2 THEN hasil_2\n    ELSE hasil_default\nEND\n```",
    "code": "CREATE TABLE scores (student TEXT, score INTEGER);\nINSERT INTO scores VALUES ('Aldi', 95), ('Bella', 82), ('Citra', 68), ('Dodi', 45);\n\nSELECT \n    student,\n    score,\n    CASE\n        WHEN score >= 85 THEN 'A - Sangat Baik'\n        WHEN score >= 75 THEN 'B - Baik'\n        WHEN score >= 60 THEN 'C - Cukup'\n        ELSE 'D - Remedial'\n    END AS grade\nFROM scores;",
    "quiz": {
      "question": "Apa nilai yang dikembalikan oleh ekspresi CASE WHEN jika tidak ada satupun kondisi WHEN yang terpenuhi dan klausa ELSE tidak disediakan?",
      "options": [
        "0",
        "String kosong",
        "NULL",
        "Error syntax"
      ],
      "answer": 2,
      "explanation": "Jika seluruh kondisi WHEN bernilai FALSE dan klausa ELSE dihilangkan, SQL secara otomatis mengembalikan nilai NULL."
    }
  },
  {
    "id": "sql-15",
    "title": "15. Window Functions: OVER, ROW_NUMBER & RANK",
    "module": "Modul 5: Window Functions, Indexing & Optimasi",
    "duration": "30 Menit",
    "level": "Lanjutan",
    "content_md": "# 15. Window Functions: OVER, ROW_NUMBER & RANK\n\n**Window Functions** melakukan perhitungan kalkulasi pada sekumpulan baris data yang berhubungan dengan baris saat ini, **tanpa mereduksi/menggabungkan baris data** menjadi satu seperti yang dilakukan `GROUP BY`.\n\n- `ROW_NUMBER()`: Memberikan nomor urut sekuensial unik (1, 2, 3...)\n- `RANK()`: Memberikan peringkat dengan gap/lompatan jika ada nilai seri (1, 2, 2, 4...)\n- `DENSE_RANK()`: Memberikan peringkat tanpa celah/gap jika ada nilai seri (1, 2, 2, 3...)",
    "code": "CREATE TABLE leaderboard (id INTEGER PRIMARY KEY, player TEXT, game TEXT, score INTEGER);\nINSERT INTO leaderboard (player, game, score) VALUES\n    ('Ace', 'Chess', 2400), ('Bob', 'Chess', 2400), ('Carl', 'Chess', 2100),\n    ('Dan', 'Poker', 1800), ('Eva', 'Poker', 1650);\n\n-- Ranking pemain per kategori game\nSELECT \n    game,\n    player,\n    score,\n    ROW_NUMBER() OVER (PARTITION BY game ORDER BY score DESC) AS row_num,\n    DENSE_RANK() OVER (PARTITION BY game ORDER BY score DESC) AS rank_pos\nFROM leaderboard;",
    "quiz": {
      "question": "Apa perbedaan utama Window Function dibandingkan fungsi agregasi GROUP BY biasa?",
      "options": [
        "Window function hanya bisa dijalankan pada database MySQL",
        "Window function melakukan kalkulasi terhadap partisi data tanpa menggabungkan/mereduksi baris output individual",
        "GROUP BY menghasilkan baris yang lebih banyak dari tabel asal",
        "Window function tidak mendukung pengurutan ORDER BY"
      ],
      "answer": 1,
      "explanation": "GROUP BY mereduksi beberapa baris menjadi 1 baris agregat, sedangkan Window Function mempertahankan setiap baris individual sembari menambahkan kolom hasil kalkulasi partisi."
    }
  },
  {
    "id": "sql-16",
    "title": "16. Window Functions: LEAD, LAG & Running Totals",
    "module": "Modul 5: Window Functions, Indexing & Optimasi",
    "duration": "25 Menit",
    "level": "Lanjutan",
    "content_md": "# 16. Window Functions: LEAD, LAG & Running Totals\n\n- **LAG(col, n)**: Mengambil nilai kolom dari `n` baris sebelumnya (ideal untuk menghitung persentase pertumbuhan bulanan).\n- **LEAD(col, n)**: Mengambil nilai kolom dari `n` baris setelahnya.\n- **Running Total**: `SUM(col) OVER (ORDER BY date)` menghitung akumulasi total berjalan seiring waktu.",
    "code": "CREATE TABLE monthly_revenue (month_num INTEGER PRIMARY KEY, revenue REAL);\nINSERT INTO monthly_revenue VALUES (1, 10000000), (2, 12500000), (3, 11000000), (4, 16000000);\n\nSELECT \n    month_num,\n    revenue,\n    LAG(revenue, 1) OVER (ORDER BY month_num) AS prev_month_rev,\n    revenue - LAG(revenue, 1) OVER (ORDER BY month_num) AS monthly_growth,\n    SUM(revenue) OVER (ORDER BY month_num) AS cumulative_revenue\nFROM monthly_revenue;",
    "quiz": {
      "question": "Fungsi window mana yang paling tepat digunakan untuk membandingkan penjualan bulan berjalan dengan penjualan bulan sebelumnya?",
      "options": [
        "LEAD()",
        "LAG()",
        "ROW_NUMBER()",
        "NTILE()"
      ],
      "answer": 1,
      "explanation": "Fungsi LAG() mengakses data dari baris-baris sebelumnya pada partition window yang ditentukan tanpa membutuhkan self-join."
    }
  },
  {
    "id": "sql-17",
    "title": "17. B-Tree Indexing & Query Performance",
    "module": "Modul 5: Window Functions, Indexing & Optimasi",
    "duration": "25 Menit",
    "level": "Lanjutan",
    "content_md": "# 17. B-Tree Indexing & Query Performance\n\nTanpa index, database terpaksa melakukan **Full Table Scan** (memeriksa setiap baris dari awal hingga akhir, O(N)).\n\nIndex membangun struktur pohon **B-Tree** terurut yang mempercepat pencarian menjadi O(log N).\n\n- `CREATE INDEX idx_name ON table(column);`\n- **Composite Index**: Index multi-kolom `CREATE INDEX idx_user_status ON users(status, created_at);`",
    "code": "CREATE TABLE logs (id INTEGER PRIMARY KEY, user_id INTEGER, action TEXT, log_date DATETIME);\n\n-- Buat B-Tree index pada kolom user_id dan log_date\nCREATE INDEX idx_logs_user_date ON logs (user_id, log_date);\n\n-- Periksa index yang terdaftar pada tabel logs\nPRAGMA index_list(logs);",
    "quiz": {
      "question": "Apa potensi konsekuensi/trade-off dari pembuatan terlalu banyak index pada sebuah tabel database?",
      "options": [
        "Ukuran database mengecil dan CPU melambat",
        "Performa SELECT meningkat namun performa operasi penulisan (INSERT/UPDATE/DELETE) menurun karena index harus diperbarui setiap saat data berubah",
        "Database tidak lagi mendukung relasi foreign key",
        "Kueri JOIN menjadi tidak valid"
      ],
      "answer": 1,
      "explanation": "Setiap index memerlukan alokasi penyimpanan tambahan di disk dan overhead komputasi CPU untuk memperbarui struktur pohon B-Tree saat terjadi operasi manipulasi data (DML write overhead)."
    }
  },
  {
    "id": "sql-18",
    "title": "18. Analisis Eksekusi Kueri dengan EXPLAIN QUERY PLAN",
    "module": "Modul 5: Window Functions, Indexing & Optimasi",
    "duration": "20 Menit",
    "level": "Lanjutan",
    "content_md": "# 18. Analisis Eksekusi Kueri dengan EXPLAIN QUERY PLAN\n\nSebelum mengoptimasi query yang lambat, gunakan perintah `EXPLAIN QUERY PLAN` untuk melihat strategi yang dipilih oleh Query Optimizer database:\n\n- `SCAN TABLE`: Membaca seluruh tabel (Lambat pada jutaan baris).\n- `SEARCH TABLE ... USING INDEX`: Menggunakan pencarian terarah via B-Tree Index (Sangat Cepat).",
    "code": "CREATE TABLE customers (id INTEGER PRIMARY KEY, email TEXT, country TEXT);\nCREATE INDEX idx_customers_email ON customers (email);\n\n-- Cek rencana eksekusi: Search using Index vs Scan\nEXPLAIN QUERY PLAN \nSELECT * FROM customers WHERE email = 'user@example.com';",
    "quiz": {
      "question": "Output mana pada EXPLAIN QUERY PLAN yang mengindikasikan bahwa pencarian memanfaatkan struktur B-Tree Index?",
      "options": [
        "SCAN TABLE customers",
        "SEARCH TABLE customers USING INDEX idx_customers_email",
        "USE TEMPORARY B-TREE FOR ORDER BY",
        "CORRELATED SCALAR SUBQUERY"
      ],
      "answer": 1,
      "explanation": "Status SEARCH TABLE ... USING INDEX menunjukkan database optimizer berhasil menemukan dan memanfaatkan index yang sesuai untuk navigasi binary/tree langsung ke lokasi record."
    }
  },
  {
    "id": "sql-19",
    "title": "19. Transaksi Database, ACID & Rollback",
    "module": "Modul 5: Window Functions, Indexing & Optimasi",
    "duration": "25 Menit",
    "level": "Lanjutan",
    "content_md": "# 19. Transaksi Database, ACID & Rollback\n\nTransaksi menjamin sekumpulan query dieksekusi sebagai satu unit kerja utuh (*all-or-nothing*).\n\n### Prinsip ACID\n- **Atomicity**: Seluruh operasi berhasil, atau jika 1 gagal maka seluruhnya dibatalkan (*Rollback*).\n- **Consistency**: Status database selalu valid sesuai aturan constraints.\n- **Isolation**: Transaksi konkuren tidak saling merusak data satu sama lain.\n- **Durability**: Data yang sudah di-commit tersimpan permanen.",
    "code": "CREATE TABLE accounts (id INTEGER PRIMARY KEY, owner TEXT, balance REAL CHECK(balance >= 0));\nINSERT INTO accounts VALUES (1, 'Sari', 1000000), (2, 'Budi', 500000);\n\n-- Transfer uang Rp 300.000 dari Sari ke Budi dengan aman\nBEGIN TRANSACTION;\n\nUPDATE accounts SET balance = balance - 300000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 300000 WHERE id = 2;\n\nCOMMIT;\n\nSELECT * FROM accounts;",
    "quiz": {
      "question": "Prinsip ACID mana yang memastikan bahwa jika terjadi crash/kegagalan sistem di tengah proses transfer multi-rekening, seluruh perubahan saldo dibatalkan kembali ke kondisi semula?",
      "options": [
        "Durability",
        "Atomicity",
        "Isolation",
        "Consistency"
      ],
      "answer": 1,
      "explanation": "Atomicity (Sifat Atom) menjamin bahwa transaksi bersifat tak terbagi (all-or-nothing) — jika salah satu langkah transfer gagal, seluruh transaksi di-rollback secara otomatis."
    }
  },
  {
    "id": "sql-20",
    "title": "20. SQLite Views, Triggers & Proyek Akhir",
    "module": "Modul 5: Window Functions, Indexing & Optimasi",
    "duration": "30 Menit",
    "level": "Lanjutan",
    "content_md": "# 20. SQLite Views, Triggers & Proyek Akhir\n\n- **VIEW**: Menyimpan query kompleks sebagai tabel virtual yang dapat di-select kapan saja.\n- **TRIGGER**: Prosedur otomatis yang dieksekusi engine database saat terjadi event `INSERT`, `UPDATE`, atau `DELETE` (misal: pencatatan audit log otomatis).\n\nSelamat! Anda telah menyelesaikan seluruh kurikulum SQL dari DDL hingga arsitektur database modern.",
    "code": "CREATE TABLE orders (id INTEGER PRIMARY KEY, total REAL);\nCREATE TABLE audit_logs (id INTEGER PRIMARY KEY, action TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);\n\n-- Buat Trigger audit log saat order baru masuk\nCREATE TRIGGER after_order_insert \nAFTER INSERT ON orders\nBEGIN\n    INSERT INTO audit_logs (action) VALUES ('New order created with total: ' || NEW.total);\nEND;\n\n-- Insert order baru\nINSERT INTO orders (total) VALUES (450000);\n\n-- Cek isi tabel audit log otomatis\nSELECT * FROM audit_logs;",
    "quiz": {
      "question": "Kapan trigger database dengan deklarasi AFTER INSERT ON orders BEGIN ... END akan dieksekusi oleh RDBMS?",
      "options": [
        "Hanya saat user melakukan backup database",
        "Secara otomatis tepat setelah satu baris baru berhasil disimpan ke tabel orders",
        "Sebelum proses validasi constraint tabel orders dijalankan",
        "Saat perintah DROP TABLE orders dijalankan"
      ],
      "answer": 1,
      "explanation": "Trigger AFTER INSERT secara otomatis dieksekusi oleh engine database segera setelah operasi penyisipan data pada tabel target selesai dan valid."
    }
  }
];

    window.lessons = lessons;
    window.LESSONS = lessons;

    async function initSQL() {
        const out = document.getElementById('output');
        const meta = document.getElementById('query-meta');
        if (meta) meta.innerText = 'Loading SQLite WASM...';
        try {
            const config = {
                locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
            };
            SQL = await initSqlJs(config);
            db = new SQL.Database();
            if (meta) meta.innerText = 'SQLite 3.44+ WASM Ready (Local)';
            console.log('✓ SQLite WASM Engine Initialized');
        } catch (err) {
            console.error('SQLite WASM initialization failed:', err);
            if (meta) meta.innerText = 'WASM Error';
            if (out) out.innerHTML = `<span class="text-rose-400">Failed to load SQLite WASM: ${err.message}</span>`;
        }
    }

    window.runCode = function() {
        const editor = document.getElementById('code-editor');
        const out = document.getElementById('output');
        const meta = document.getElementById('query-meta');
        if (!editor || !out) return;

        const query = editor.value.trim();
        if (!query) {
            out.innerHTML = '<span class="text-amber-400">Query SQL kosong. Silakan tulis perintah SQL.</span>';
            return;
        }

        if (!db) {
            out.innerHTML = '<span class="text-slate-400">Engine SQLite WASM sedang diinisialisasi, silakan tunggu sejenak...</span>';
            return;
        }

        const startTime = performance.now();
        try {
            const res = db.exec(query);
            const duration = (performance.now() - startTime).toFixed(2);
            if (meta) meta.innerText = `Executed in ${duration}ms (${res.length} result set)`;

            if (!res || res.length === 0) {
                out.innerHTML = `<span class="text-emerald-400">✓ Query berhasil dieksekusi (0 rows returned / DDL / DML write success).</span>
<span class="text-slate-500">Execution time: ${duration}ms</span>`;
                return;
            }

            let html = '';
            res.forEach((table, tIdx) => {
                html += `<div class="mb-4 overflow-x-auto">`;
                if (res.length > 1) {
                    html += `<div class="text-[11px] font-mono text-emerald-400 mb-1">Result Set #${tIdx + 1}:</div>`;
                }
                html += `<table class="w-full text-left text-xs border-collapse border border-white/10 rounded-lg overflow-hidden">`;
                html += `<thead class="bg-[#172033] text-emerald-300 font-mono"><tr>`;
                table.columns.forEach(col => {
                    html += `<th class="p-2 border-b border-white/10 whitespace-nowrap">${escapeHTML(col)}</th>`;
                });
                html += `</tr></thead><tbody class="divide-y divide-white/5 font-mono">`;
                table.values.forEach((row, rIdx) => {
                    const bg = rIdx % 2 === 0 ? 'bg-black/20' : 'bg-white/[0.02]';
                    html += `<tr class="${bg} hover:bg-white/5 transition">`;
                    row.forEach(val => {
                        const displayVal = val === null ? '<span class="text-slate-500 italic">NULL</span>' : escapeHTML(String(val));
                        html += `<td class="p-2 whitespace-nowrap">${displayVal}</td>`;
                    });
                    html += `</tr>`;
                });
                html += `</tbody></table></div>`;
            });
            html += `<div class="text-[11px] text-slate-500 font-mono">Total baris: ${res[0].values.length} baris • ${duration}ms</div>`;
            out.innerHTML = html;
        } catch (err) {
            const duration = (performance.now() - startTime).toFixed(2);
            if (meta) meta.innerText = `Error (${duration}ms)`;
            out.innerHTML = `<div class="text-rose-400 font-mono"><i class="fas fa-circle-xmark mr-1.5"></i><b>SQLite Error:</b>
${escapeHTML(err.message)}</div>`;
        }
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    window.resetCode = function() {
        if (lessons[currentLesson]) {
            const editor = document.getElementById('code-editor');
            if (editor) editor.value = lessons[currentLesson].code;
            const out = document.getElementById('output');
            if (out) out.innerHTML = '<span class="text-slate-500">// Query di-reset ke contoh awal. Klik Execute untuk menjalankan.</span>';
        }
    };

    function renderNav(filterText = '') {
        const nav = document.getElementById('lessons-nav');
        if (!nav) return;
        const query = filterText.toLowerCase().trim();

        let currentModule = '';
        let html = '';

        lessons.forEach((l, idx) => {
            if (query && !l.title.toLowerCase().includes(query) && !l.module.toLowerCase().includes(query)) {
                return;
            }

            if (l.module !== currentModule) {
                currentModule = l.module;
                html += `<div class="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">${currentModule}</div>`;
            }

            const isDone = completedLessons.has(l.id);
            const isActive = idx === currentLesson;

            let itemClass = 'group flex items-center justify-between px-3 py-2 my-0.5 rounded-xl text-xs transition cursor-pointer ';
            if (isActive) {
                itemClass += 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 font-semibold border border-emerald-500/30';
            } else if (isDone) {
                itemClass += 'text-slate-300 hover:bg-white/5';
            } else {
                itemClass += 'text-slate-400 hover:bg-white/5 hover:text-slate-200';
            }

            html += `
                <div class="${itemClass}" onclick="loadLesson(${idx})">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'} shrink-0">
                            ${isDone ? '✓' : (idx + 1)}
                        </span>
                        <span class="truncate">${escapeHTML(l.title)}</span>
                    </div>
                    ${isDone ? '<i class="fas fa-check text-[10px] text-emerald-400 shrink-0"></i>' : ''}
                </div>
            `;
        });

        nav.innerHTML = html;
        updateProgress();
    }

    function updateProgress() {
        const total = lessons.length;
        const done = completedLessons.size;
        const pct = Math.round((done / total) * 100);

        const statDone = document.getElementById('stat-done');
        if (statDone) statDone.innerText = done;

        const pText = document.getElementById('course-progress');
        if (pText) pText.innerText = `${pct}%`;

        const mProg = document.getElementById('mobile-progress');
        if (mProg) mProg.innerText = `${pct}%`;

        const pFill = document.getElementById('progress-fill');
        if (pFill) pFill.style.width = `${pct}%`;

        const pFillBar = document.getElementById('progress-fill-bar');
        if (pFillBar) pFillBar.style.width = `${pct}%`;
    }

    window.loadLesson = function(idx) {
        if (idx < 0 || idx >= lessons.length) return;
        currentLesson = idx;

        try { localStorage.setItem(RESUME_KEY, idx); } catch(e) {}

        const l = lessons[idx];
        const titleEl = document.getElementById('lesson-title');
        const breadcrumbEl = document.getElementById('breadcrumb');
        const contentEl = document.getElementById('lesson-content');
        const editor = document.getElementById('code-editor');
        const durEl = document.getElementById('lesson-duration');
        const lvlEl = document.getElementById('lesson-level');

        if (titleEl) titleEl.innerText = l.title;
        if (breadcrumbEl) breadcrumbEl.innerText = l.module;
        if (durEl) { durEl.innerText = l.duration; durEl.classList.remove('hidden'); }
        if (lvlEl) { lvlEl.innerText = l.level; lvlEl.classList.remove('hidden'); }

        if (contentEl && typeof marked !== 'undefined') {
            contentEl.innerHTML = marked.parse(l.content_md);
            contentEl.querySelectorAll('pre code').forEach(block => {
                if (typeof hljs !== 'undefined') hljs.highlightElement(block);
            });
        }

        if (editor) {
            editor.value = l.code;
        }

        const quizSec = document.getElementById('quiz-section');
        const quizContent = document.getElementById('quiz-content');
        const quizResult = document.getElementById('quiz-result');
        if (quizResult) quizResult.innerHTML = '';

        if (l.quiz && quizSec && quizContent) {
            quizSec.classList.remove('hidden');
            let qHtml = `<div class="text-sm font-semibold text-white mb-3">${escapeHTML(l.quiz.question)}</div>`;
            l.quiz.options.forEach((opt, oIdx) => {
                qHtml += `
                    <label class="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 cursor-pointer transition">
                        <input type="radio" name="quiz_option" value="${oIdx}" class="mt-1 text-emerald-500 focus:ring-emerald-500">
                        <span class="text-xs sm:text-sm text-slate-300 leading-relaxed">${escapeHTML(opt)}</span>
                    </label>
                `;
            });
            quizContent.innerHTML = qHtml;
        } else if (quizSec) {
            quizSec.classList.add('hidden');
        }

        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (prevBtn) prevBtn.disabled = idx === 0;
        if (nextBtn) nextBtn.disabled = idx === lessons.length - 1;

        updateCompleteButtons();
        renderNav();

        const scroller = document.getElementById('content-scroll');
        if (scroller) scroller.scrollTop = 0;

        if (window.closeSidebar && window.innerWidth < 1024) {
            window.closeSidebar();
        }
    }

    window.checkQuiz = function() {
        const l = lessons[currentLesson];
        const resEl = document.getElementById('quiz-result');
        if (!l || !l.quiz || !resEl) return;

        const selected = document.querySelector('input[name="quiz_option"]:checked');
        if (!selected) {
            resEl.innerHTML = '<div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">Pilih salah satu jawaban terlebih dahulu!</div>';
            return;
        }

        const ans = parseInt(selected.value, 10);
        if (ans === l.quiz.answer) {
            resEl.innerHTML = `
                <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm space-y-1">
                    <div class="font-bold flex items-center gap-2"><i class="fas fa-check-circle"></i> Jawaban Benar!</div>
                    <p class="text-slate-300 text-xs">${escapeHTML(l.quiz.explanation)}</p>
                </div>
            `;
            markComplete();
        } else {
            resEl.innerHTML = `
                <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm space-y-1">
                    <div class="font-bold flex items-center gap-2"><i class="fas fa-times-circle"></i> Jawaban Kurang Tepat</div>
                    <p class="text-slate-300 text-xs">Coba tinjau kembali materi di atas dan pilih jawaban yang paling sesuai.</p>
                </div>
            `;
        }
    };

    window.markComplete = function() {
        const l = lessons[currentLesson];
        if (!l) return;
        completedLessons.add(l.id);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedLessons)));
        } catch(e) {}
        updateCompleteButtons();
        renderNav();
    };

    function updateCompleteButtons() {
        const l = lessons[currentLesson];
        if (!l) return;
        const isDone = completedLessons.has(l.id);
        const btnComp = document.getElementById('complete-btn');
        const btnDone = document.getElementById('completed-btn');

        if (btnComp && btnDone) {
            if (isDone) {
                btnComp.style.display = 'none';
                btnDone.style.display = 'flex';
            } else {
                btnComp.style.display = 'flex';
                btnDone.style.display = 'none';
            }
        }
    }

    window.prevLesson = function() {
        if (currentLesson > 0) loadLesson(currentLesson - 1);
    };

    window.nextLesson = function() {
        if (currentLesson < lessons.length - 1) loadLesson(currentLesson + 1);
    };

    window.resetProgress = function() {
        if (confirm('Yakin ingin mereset seluruh progres pembelajaran SQL?')) {
            completedLessons.clear();
            try {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(RESUME_KEY);
            } catch(e) {}
            loadLesson(0);
        }
    };

    window.openCertificateModal = function() {
        const modal = document.getElementById('certificate-modal');
        const lockedView = document.getElementById('cert-locked-view');
        const unlockedView = document.getElementById('cert-unlocked-view');
        const unlockedFooter = document.getElementById('cert-unlocked-footer');

        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        const is100 = completedLessons.size === lessons.length;
        if (is100) {
            lockedView?.classList.add('hidden');
            unlockedView?.classList.remove('hidden');
            unlockedFooter?.classList.remove('hidden');
            drawCertificate();
        } else {
            lockedView?.classList.remove('hidden');
            unlockedView?.classList.add('hidden');
            unlockedFooter?.classList.add('hidden');

            const pct = Math.round((completedLessons.size / lessons.length) * 100);
            const lText = document.getElementById('cert-locked-progress-text');
            const lBar = document.getElementById('cert-locked-progress-bar');
            const lRem = document.getElementById('cert-locked-remaining-text');

            if (lText) lText.innerText = `${pct}%`;
            if (lBar) lBar.style.width = `${pct}%`;
            if (lRem) lRem.innerText = `Selesaikan ${lessons.length - completedLessons.size} pelajaran lagi untuk mengklaim sertifikat.`;
        }
    };

    window.closeCertificateModal = function() {
        const modal = document.getElementById('certificate-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    window.drawCertificate = function() {
        const canvas = document.getElementById('cert-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const nameInput = document.getElementById('cert-name-input');
        const name = (nameInput?.value || 'Software Engineer').trim();

        const w = canvas.width;
        const h = canvas.height;

        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#064e3b');
        bgGrad.addColorStop(0.5, '#0f172a');
        bgGrad.addColorStop(1, '#022c22');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 6;
        ctx.strokeRect(30, 30, w - 60, h - 60);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(40, 40, w - 80, h - 80);

        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SERTIFIKAT KELULUSAN RESMI', w / 2, 110);

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 36px Inter, sans-serif';
        ctx.fillText('SQL & RELATIONAL DATABASE MASTERY', w / 2, 160);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '15px Inter, sans-serif';
        ctx.fillText('Diberikan dengan bangga kepada:', w / 2, 230);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 40px Inter, sans-serif';
        ctx.fillText(name, w / 2, 290);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '15px Inter, sans-serif';
        ctx.fillText('Telah berhasil menyelesaikan 100% kurikulum komprehensif SQL:', w / 2, 350);
        ctx.fillText('DDL, DML, Multi-Table JOINs, Subqueries, Recursive CTE, Window Functions,', w / 2, 380);
        ctx.fillText('B-Tree Indexing & Query Optimization dengan Engine SQLite WebAssembly.', w / 2, 408);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 16px Inter, sans-serif';
        const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillText(`Diterbitkan pada: ${today}`, w / 2, 480);

        ctx.fillStyle = '#64748b';
        ctx.font = '13px monospace';
        ctx.fillText('VERIFIED ID: SQL-WASM-' + Math.random().toString(36).substring(2, 9).toUpperCase(), w / 2, 530);

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 100, 560);
        ctx.lineTo(w / 2 + 100, 560);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('personalbotai • Interactive Learning Path Fleet', w / 2, 585);
    };

    window.downloadCertificatePNG = function() {
        const canvas = document.getElementById('cert-canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'Sertifikat-SQL-Mastery.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    window.printCertificate = function() {
        const canvas = document.getElementById('cert-canvas');
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        const w = window.open('', '_blank');
        w.document.write(`
            <html>
                <head><title>Cetak Sertifikat SQL</title></head>
                <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#111;">
                    <img src="${dataUrl}" style="max-width:95vw;max-height:95vh;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);" />
                    <script>window.onload = () => { window.print(); };</script>
                </body>
            </html>
        `);
    };

    document.addEventListener('DOMContentLoaded', () => {
        initSQL();
        let resumeIdx = 0;
        try {
            const saved = localStorage.getItem(RESUME_KEY);
            if (saved !== null) resumeIdx = parseInt(saved, 10) || 0;
        } catch(e) {}
        loadLesson(resumeIdx);
    });
})();
