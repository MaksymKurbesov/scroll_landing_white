self.addEventListener('fetch', function(event) {
    // Проверяем, не является ли запрос запросом к самому Service Worker или другим служебным ресурсам
    const url = new URL(event.request.url);

    function isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    if (url.pathname === '/sw.js') {
        // Не перехватываем запросы к самому Service Worker
        return;
    }

    if (event.request.method === 'POST') {
        event.respondWith(
            (async function() {
                try {
                    const requestClone = event.request.clone();
                    const requestBody = await requestClone.text();

                    try {
                        console.log(requestBody, 'requestBody')
                        if (!isJsonString(requestBody)) return;

                        const data = JSON.parse(requestBody);

                        if (data && data.props && data.props.event) {
                            const propsEventValue = data.props.event;
                            console.log('Значение props.event:', propsEventValue);
                        } else {
                            console.log('Свойство data.props.event не найдено');
                        }
                    } catch (error) {
                        console.error('Ошибка при разборе JSON:', error);
                    }

                    // Продолжаем обработку запроса
                    const response = await fetch(event.request);
                    return response;

                } catch (fetchError) {
                    console.error('Ошибка в обработке fetch:', fetchError);
                    // Возвращаем ответ с ошибкой или пустой ответ
                    return new Response('Ошибка в обработке запроса', { status: 500 });
                }
            })()
        );
    } else {
        // event.respondWith(fetch(event.request));
    }
});