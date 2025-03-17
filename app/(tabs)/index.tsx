import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, Button, View } from "react-native";

import Counter from "@/components/CounterComponent";

const Home = () => {
  const [counters, setCounters] = useState([]);
  const navigation = useNavigation();

  const fetchCounters = async () => {
    try {
      const response = await fetch("http://localhost:3000/counters");
      const data = await response.json();
      setCounters(data.filter((counter) => !counter.archived)); // Only active counters
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };

  const deleteCounter = async (id) => {
    try {
      await fetch(`http://localhost:3000/counters/${id}`, { method: "DELETE" });
      setCounters((prev) => prev.filter((counter) => counter.id !== id));
    } catch (error) {
      console.error("Error deleting counter:", error);
    }
  };

  const archiveCounter = async (id) => {
    try {
      await fetch(`http://localhost:3000/counters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: true }),
      });
      setCounters((prev) => prev.filter((counter) => counter.id !== id));
    } catch (error) {
      console.error("Error archiving counter:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCounters();
    }, [])
  );

  return (
    <ThemedView className="flex-1 p-6 bg-black">
      {counters.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ThemedText className="text-xl text-white mb-4">
            No counters yet. Create one now!
          </ThemedText>
          <Button
            title="Add Counter"
            onPress={() => navigation.navigate("add")}
            color="gray"
          />
        </View>
      ) : (
        <ScrollView className="gap-4">
          {counters.map((counter) => (
            <Counter
              key={counter.id}
              {...counter}
              onDelete={deleteCounter}
              onArchive={archiveCounter}
            />
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
};

export default Home;
