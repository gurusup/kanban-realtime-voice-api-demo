import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  description: string;
  column: "todo" | "in_progress" | "done";
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Finish design for homepage", description: "Create high-fidelity mockups and get client approval.", column: "todo" },
    { id: "2", title: "Write blog post", description: "Outline, research, and draft a new blog post.", column: "todo" },
    { id: "3", title: "Refactor codebase", description: "Review and clean up the codebase for better maintainability.", column: "todo" },
    { id: "4", title: "Implement new feature", description: "Add the ability to upload images to user profiles.", column: "in_progress" },
    { id: "5", title: "Fix bug in checkout flow", description: "Investigate and resolve the issue causing cart items to disappear.", column: "in_progress" },
    { id: "6", title: "Deploy to production", description: "Push the latest changes to the live environment.", column: "done" },
    { id: "7", title: "Update documentation", description: "Revise and publish the latest product documentation.", column: "done" },
  ]);

  const [isConnected, setIsConnected] = useState(false);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  useEffect(() => {
    const iframe = document.getElementById("realtime-voice-invisible-iframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: isConnected ? "connect" : "disconnect" }, "*");
    }
  }, [isConnected]);

  // Add a listener to move the cards when the child iframe sends a "move_card" message
  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type === "move_card") {
        const { card_id, column_id } = event.data;
        const task = tasks.find((task) => task.id === card_id);
        if (task) {
          setTasks((prevTasks) => prevTasks.map((task) => (task.id === card_id ? { ...task, column: column_id } : task)));
        }
      }
    });
  }, []);

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-6xl mb-4">
          <Button onClick={toggleConnection}>{isConnected ? "Disconnect" : "Connect"}</Button>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{column.title}</h2>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">Add Task</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {tasks
                  .filter((task) => task.column === column.id)
                  .map((task) => (
                    <Card key={task.id} className="cursor-grab">
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-1">ID: {task.id}</p>
                        <h3 className="text-sm font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
