import { useState, useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { TextInput, Button } from "react-native";
import { v4 as uuidv4 } from "uuid";

const CreateCounter = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [count, setCount] = useState("");

  const handleCreate = async () => {
    const newCounter = {
      id: uuidv4(),
      title: title || "Counter",
      count: count ? parseInt(count, 10) : 0,
    };

    try {
      await fetch("http://localhost:3000/counters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCounter),
      });
      onCreate(newCounter);
      setTitle("");
      setCount("");
    } catch (error) {
      console.error("Error creating counter:", error);
    }
  };

  return (
    <ThemedView className="p-4 border rounded-lg shadow-md gap-2">
      <TextInput
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        className="border p-2 rounded"
      />
      <TextInput
        placeholder="Enter initial count (optional)"
        value={count}
        onChangeText={setCount}
        keyboardType="numeric"
        className="border p-2 rounded"
      />
      <Button title="Create Counter" onPress={handleCreate} />
    </ThemedView>
  );
};

export default CreateCounter;
