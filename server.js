import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Настройка подключения к базе данных
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cmotor"
});

db.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err);
    return;
  }
  console.log("Подключение к базе данных успешно установлено.");
});

// Добавление данных
app.post("/clients", (req, res) => {
  const newClient = req.body; // Данные нового клиента из тела запроса
  console.log("Данные для добавления:", newClient);

  const sql = "INSERT INTO clients SET ?"; // SQL-запрос для добавления данных

  db.query(sql, newClient, (err, result) => {
    if (err) {
      console.error("Ошибка добавления данных:", err); // Логирование ошибок
      res.status(500).send("Ошибка добавления данных");
      return;
    }
    res.send("Данные успешно добавлены");
  });
});


// Получение данных из таблицы
app.get("/clients", (req, res) => {
  db.query("SELECT * FROM clients", (err, results) => {
    if (err) {
      console.error("Ошибка получения данных:", err); // Логирование ошибок
      res.status(500).send("Ошибка получения данных");
      return;
    }
    res.json(results);
  });
});

// Редактирование данных
app.put("/clients/:id", (req, res) => {
  const { id } = req.params; // Получение ID клиента из параметров URL
  const updatedData = req.body; // Данные, отправленные для обновления

  console.log("Получены данные для редактирования:", updatedData);

  const sql = "UPDATE clients SET ? WHERE id = ?"; // SQL-запрос для обновления данных
  db.query(sql, [updatedData, id], (err, result) => {
    if (err) {
      console.error("Ошибка редактирования данных:", err); // Логирование ошибок
      res.status(500).send("Ошибка редактирования данных");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("Клиент не найден");
      return;
    }
    res.send("Данные успешно обновлены");
  });
});

// Удаление данных
app.delete("/clients/:id", (req, res) => {
  // Добавляем параметр ID в маршрут
  const { id } = req.params; // Извлекаем ID из параметров URL
  console.log("Получен ID для удаления:", id);

  // Исправленный SQL-запрос с условием WHERE
  const sql = "DELETE FROM clients WHERE id = ?";

  // Выполнение запроса с использованием подготовленных операторов
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Ошибка удаления данных:", err); // Логирование ошибок
      res.status(500).send("Ошибка удаления данных");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("Клиент не найден");
      return;
    }
    res.send("Данные успешно удалены");
  });
});

app.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});
