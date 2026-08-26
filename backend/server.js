const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Veritabanı Bağlantısı (Kubernetes ConfigMap ve Secret'tan gelecek)
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'tododb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. Tabloyu Otomatik Oluştur
// Veritabanı boşsa çökmemesi için kendi tablosunu kendi yaratır.
db.query(`
    CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false
    )
`, (err) => {
    if (err) console.error("Tablo oluşturma hatası:", err);
    else console.log("Todos tablosu hazır veya zaten mevcut.");
});

// 3. Yeni Görev Ekleme (POST)
app.post('/api/todos', (req, res) => {
    const { task } = req.body;
    db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, task, completed: false });
    });
});

// 4. Görevleri Listeleme (GET)
app.get('/api/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// İşlevsellik: Görev Silme (DELETE) Endpoint'i
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM todos WHERE id = ?"; // MySQL silme sorgusu
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Silme hatası:", err);
            return res.status(500).send(err);
        }
        res.send({ message: "Görev başarıyla silindi!" });
    });
});

// Sunucuyu Başlat
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Backend ${PORT} portunda çalışıyor.`);
});