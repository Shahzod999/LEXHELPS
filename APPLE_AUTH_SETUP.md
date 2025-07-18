# Настройка Apple аутентификации для Lex

## Обзор

Этот документ описывает процесс настройки Apple аутентификации для приложения Lex.

## Предварительные требования

1. Apple Developer Account
2. Настроенный App ID в Apple Developer Console
3. Настроенный Service ID для Sign in with Apple

## Шаги настройки

### 1. Настройка в Apple Developer Console

#### Создание App ID
1. Войдите в [Apple Developer Console](https://developer.apple.com/account/)
2. Перейдите в "Certificates, Identifiers & Profiles"
3. Выберите "Identifiers" → "App IDs"
4. Создайте новый App ID или отредактируйте существующий
5. Включите "Sign In with Apple" capability

#### Создание Service ID
1. В разделе "Identifiers" выберите "Services IDs"
2. Создайте новый Service ID
3. Включите "Sign In with Apple"
4. Настройте домены и redirect URLs

### 2. Настройка в приложении

#### Конфигурация app.json
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.cdlcarolinas.lex",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["com.cdlcarolinas.lex"]
          }
        ]
      }
    },
    "plugins": [
      "expo-apple-authentication"
    ]
  }
}
```

#### Настройка сервера
1. Добавьте endpoint `/users/apple-auth` в API
2. Обработайте JWT токен от Apple
3. Создайте или обновите пользователя в базе данных

### 3. Тестирование

#### Локальное тестирование
1. Запустите приложение на iOS симуляторе или устройстве
2. Убедитесь, что Apple аутентификация доступна
3. Протестируйте процесс входа

#### Продакшн тестирование
1. Загрузите приложение в TestFlight
2. Протестируйте на реальных устройствах
3. Убедитесь в корректной работе в продакшне

## Структура кода

### Frontend (React Native)
- `LogRegOptions.tsx` - компонент с кнопками аутентификации
- `authApiSlice.ts` - API endpoints для аутентификации

### Backend (Node.js)
- `usersController.ts` - контроллер для обработки Apple аутентификации
- `usersRoutes.ts` - маршруты для Apple аутентификации

## Безопасность

1. Всегда проверяйте JWT токены от Apple
2. Храните секретные ключи в безопасном месте
3. Используйте HTTPS для всех API вызовов
4. Валидируйте все входящие данные

## Устранение неполадок

### Частые проблемы

1. **"Apple authentication is not available"**
   - Убедитесь, что устройство поддерживает Apple аутентификацию
   - Проверьте настройки в Apple Developer Console

2. **"Invalid identity token"**
   - Проверьте правильность настройки Service ID
   - Убедитесь в корректности JWT декодирования

3. **"User not found"**
   - Проверьте логику создания пользователей
   - Убедитесь в правильности обработки email

## Дополнительные ресурсы

- [Apple Developer Documentation](https://developer.apple.com/documentation/sign_in_with_apple)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [JWT Decoding](https://jwt.io/)

## Поддержка

При возникновении проблем обратитесь к команде разработки или создайте issue в репозитории проекта. 