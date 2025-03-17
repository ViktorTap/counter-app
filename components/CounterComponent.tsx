import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity, TextInput } from "react-native";
import { Button, View } from "react-native";

// Counter Component
const Counter = ({ id, title, count, onDelete, onArchive }) => {
  const [localCount, setLocalCount] = useState(count);
  const [localTitle, setLocalTitle] = useState(title);
  const [editingTitle, setEditingTitle] = useState(false);

  const updateCounter = async (updates) => {
    try {
      await fetch(`http://localhost:3000/counters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Error updating counter:", error);
    }
  };

  const handleCountChange = (newCount) => {
    setLocalCount(newCount);
    updateCounter({ count: newCount });
  };

  const handleTitleChange = () => {
    const newTitle = localTitle.trim() === "" ? "Counter" : localTitle;
    setLocalTitle(newTitle);
    setEditingTitle(false);
    updateCounter({ title: newTitle });
  };

  return (
    <ThemedView className="p-6 border border-gray-700 rounded-xl shadow-md bg-gray-900 m-1">
      {editingTitle ? (
        <TextInput
          value={localTitle}
          onChangeText={setLocalTitle}
          onBlur={handleTitleChange}
          autoFocus
          className="text-2xl font-bold text-white border-b border-gray-500 p-2 bg-gray-500 rounded"
        />
      ) : (
        <ThemedText
          className="text-2xl font-bold text-white"
          onPress={() => setEditingTitle(true)}
        >
          {localTitle}
        </ThemedText>
      )}

      <View className="flex-row justify-between items-center mt-4">
        {/* Minus Button */}
        <TouchableOpacity
          onPress={() => handleCountChange(localCount - 1)}
          className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center"
        >
          <ThemedText className="text-3xl font-bold text-white">−</ThemedText>
        </TouchableOpacity>

        <ThemedText className="text-4xl font-bold text-white">
          {localCount}
        </ThemedText>

        {/* Plus Button */}
        <TouchableOpacity
          onPress={() => handleCountChange(localCount + 1)}
          className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center"
        >
          <ThemedText className="text-3xl font-bold text-white">+</ThemedText>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mt-6">
        <TouchableOpacity
          onPress={() => onArchive(id)}
          className="px-4 py-2 bg-gray-300 rounded-lg "
        >
          <ThemedText className="text-white font-bold">Archive</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(id)}
          className="px-4 py-2 bg-red-600 rounded-lg"
        >
          <ThemedText className="text-white font-bold">Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default Counter;
