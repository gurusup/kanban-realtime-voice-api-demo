# Integration test of OpenAI's Realtime Voice API

## Installation

```bash
yarn
```

## Execution

```bash
yarn dev
```

## Usage

In the `index.html` file, you'll find the iframe where the OpenAI Realtime Console will be loaded.

```html
<iframe id="realtime-voice-invisible-iframe" src="http://localhost:3000" style="display: none" allow="microphone"></iframe>
```

This is the repository of the WebApp that you need to modify and run:
`https://github.com/openai/openai-realtime-console`

By default, the WebApp runs on port 3000. You can change it if necessary.

## How it works

The kanban webapp will load the OpenAI Realtime Console in the iframe.

The real-time chatbot should have the ability to execute functions and send messages to this webapp as follows:

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

This webapp has a listener for the `message` event that captures the message sent by the chatbot and executes the relevant function (in this case, moving a kanban card).

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

Similarly, you can send any type of message from the app to the chatbot (for example, to start or stop the audio):

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
