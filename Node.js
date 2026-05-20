responseText += 🧼 Чистота: ${toilet.status}\n\n;
    });

    // Отправляем заполненный список пользователю
    bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });
});

// --- ДЕЙСТВИЕ: Обработка текстовых кнопок ---
// Отслеживает нажатия на пункты меню "Выбрать город" и "Добавить точку"
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Если нажата кнопка ручного выбора города
    if (text === "🏙️ Выбрать город") {
        // Создаем аккуратные кнопки прямо под сообщением (Inline-клавиатура)
        const cityMenu = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Пермь", callback_data: "city_perm" }],
                    [{ text: "Москва", callback_data: "city_moscow" }]
                ]
            }
        };
        bot.sendMessage(chatId, "Выберите интересующий город из списка:", cityMenu);
    }

    // Если нажата кнопка добавления новой точки
    if (text === "➕ Добавить точку") {
        bot.sendMessage(chatId, "👤 Чтобы добавить новый туалет в базу, пришлите его название, точный адрес и код (если есть) нашему модератору. Скоро этот раздел станет полностью автоматическим!");
    }
});

// --- ДЕЙСТВИЕ: Обработка выбора города из списка ---
// Слушает, какую именно инлайн-кнопку города нажал пользователь
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    let filteredToilets = [];
    let cityName = "";

    // Фильтруем базу данных в зависимости от выбранного города
    if (data === "city_perm") {
        filteredToilets = toiletsDatabase.filter(t => t.city === "Пермь");
        cityName = "Пермь";
    } else if (data === "city_moscow") {
        filteredToilets = toiletsDatabase.filter(t => t.city === "Москва");
        cityName = "Москва";
    }

    // Собираем текстовый отчет по городу
    let responseText = 🏙️ **Доступные туалеты в г. ${cityName}:**\n\n;
    
    filteredToilets.forEach(toilet => {
        responseText += 🚽 **${toilet.name}** (${toilet.area} район)\n;
        responseText += 📍 Адрес: ${toilet.address}\n;
        responseText += 🔑 Код на двери: \`${toilet.code}\`\n\n;
    });

    // Отправляем список в чат
    bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });
    
    // Гасим часики анимации на кнопке в Телеграме
    bot.answerCallbackQuery(query.id);
});

console.log("Сервер текстового бота успешно запущен!");
