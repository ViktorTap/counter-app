import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TextInput, TouchableOpacity, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

const CreateCounter = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [count, setCount] = useState("");

  const handleCreate = async () => {
    const newCounter = {
      id: uuidv4(),
      title: title.trim() === "" ? "Counter" : title,
      count: count ? parseInt(count, 10) : 0,
    };

    try {
      await fetch("http://localhost:3000/counters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCounter),
      });

      setTitle("");
      setCount("");
      navigation.navigate("Home", { refresh: true }); // Redirect & trigger refresh
    } catch (error) {
      console.error("Error creating counter:", error);
    }
  };

  const handleCountChange = (text) => {
    // Remove non-numeric characters
    const filteredText = text.replace(/[^0-9]/g, "");
    setCount(filteredText);
  };

  return (
    <ThemedView className="flex-1 justify-center items-center p-6 bg-gray-900">
      <ThemedView className="w-full max-w-md p-6 border border-gray-700 rounded-xl shadow-md bg-gray-900">
        <ThemedText className="text-xl font-bold text-white text-center mb-4">
          Create Counter
        </ThemedText>

        <TextInput
          placeholder="Enter title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
          className="text-white font-bold border-b border-gray-500 p-2 bg-gray-500 rounded"
        />

        <TextInput
          placeholder="Enter initial count (optional)"
          placeholderTextColor="#aaa"
          value={count}
          onChangeText={handleCountChange}
          keyboardType="numeric"
          className="text-white font-bold border-b border-gray-500 p-2 bg-gray-500 rounded mt-4"
        />

        <View className="flex items-center mt-6">
          <TouchableOpacity
            onPress={handleCreate}
            className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center"
          >
            <ThemedText className="text-3xl font-bold text-white">+</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ThemedView>
  );
};

export default CreateCounter;
