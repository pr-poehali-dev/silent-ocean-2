"""Генерация кастомного промта (скила) для ИИ-ассистента через Claude."""
import os
import json
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        role = body.get("role", "").strip()
        business = body.get("business", "").strip()
        tasks = body.get("tasks", "").strip()
        tone = body.get("tone", "профессиональный")

        if not role or not business or not tasks:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Заполните все поля"}, ensure_ascii=False)}

        system_prompt = """Ты — эксперт по проектированию промтов для ИИ-ассистентов. 
Твоя задача — создать детальный, профессиональный системный промт для кастомного ИИ-ассистента.
Промт должен быть на русском языке, структурированным и готовым к использованию в ChatGPT или Claude.
Формат ответа: только готовый промт, без пояснений и вводных слов."""

        user_message = f"""Создай системный промт для ИИ-ассистента со следующими параметрами:

Роль ассистента: {role}
Сфера бизнеса: {business}
Ключевые задачи: {tasks}
Тон общения: {tone}

Промт должен включать:
1. Чёткое описание роли и личности ассистента
2. Основные обязанности и зоны ответственности
3. Что ассистент делает, а что — нет
4. Стиль и тон общения
5. Примеры типичных ситуаций и как на них реагировать"""

        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": "API ключ не настроен"}, ensure_ascii=False)}

        payload = json.dumps({
            "model": "claude-3-5-haiku-20241022",
            "max_tokens": 2000,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_message}]
        }).encode("utf-8")

        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=payload,
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            generated_prompt = result["content"][0]["text"]

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"prompt": generated_prompt}, ensure_ascii=False)
        }

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return {"statusCode": 502, "headers": headers, "body": json.dumps({"error": f"Ошибка API: {error_body}"}, ensure_ascii=False)}
