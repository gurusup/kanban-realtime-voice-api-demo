# Prueba de integración de la Realtime Voice API de OpenAI

## Instalación

```bash
yarn
```

## Ejecución

```bash
yarn dev
```

## Uso

En el archivo `index.html` encontrarás el iframe donde se cargará la OpenAI Realtime Console.

```html
<iframe id="realtime-voice-invisible-iframe" src="http://localhost:3000" style="display: none" allow="microphone"></iframe>
```

Este es el repositorio de la WebApp que debes modificar y levantar:
`https://github.com/openai/openai-realtime-console`

Por defecto, la WebApp se ejecuta en el puerto 3000. Si es necesario, puedes cambiarlo.

## Cómo funciona

La webapp del kanban cargará la OpenAI Realtime Console en el iframe.

El chatbot en tiempo real deberá tener la capacidad de ejecutar funciones y enviar mensajes a esta webapp de la siguiente manera:

```ts
// Send a message to the parent window to move a card
window.parent.postMessage(
  {
    type: "move_card",
    data: { column: "in_progress", card_id: "1" },
  },
  "*"
);
```

Esta webapp tiene un listener del evento `message` que captura el mensaje enviado por el chatbot y ejecuta la función pertinente (en este caso, mover una tarjeta del kanban).

```ts
// Add a listener to move the cards when the child iframe sends a "move_card" message
useEffect(() => {
  window.addEventListener("message", (event) => {
    if (event.data.type === "move_card") {
      const { card_id, column } = event.data;
      const task = tasks.find((task) => task.id === card_id);
      if (task) {
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === card_id ? { ...task, column } : task)));
      }
    }
  });
}, []);
```

De la misma manera, puedes enviar cualquier tipo de mensaje desde la app al chatbot (por ejemplo para iniciar o parar el audio):

```ts
const handleMessage = (event: MessageEvent) => {
  if (event.data.type === "connect") {
    console.log("Connecting conversation");
    connectConversation();
  } else if (event.data.type === "disconnect") {
    disconnectConversation();
  }
};

useEffect(() => {
  changeTurnEndType("server_vad");
  window.addEventListener("message", handleMessage);

  return () => {
    window.removeEventListener("message", handleMessage);
  };
}, []);
```
