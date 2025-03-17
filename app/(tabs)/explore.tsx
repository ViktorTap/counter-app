import { useState, useEffect, useCallback } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

const ArchivedCounters = () => {
  const [archivedCounters, setArchivedCounters] = useState([]);

  const fetchArchivedCounters = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/counters?archived=true"
      );
      const data = await response.json();
      setArchivedCounters(data);
    } catch (error) {
      console.error("Error fetching archived counters:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchArchivedCounters();
    }, []) // Empty dependency array ensures it runs every time the screen is focused
  );

  const restoreCounter = async (id) => {
    try {
      await fetch(`http://localhost:3000/counters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: false }),
      });

      setArchivedCounters((prev) =>
        prev.filter((counter) => counter.id !== id)
      );
    } catch (error) {
      console.error("Error restoring counter:", error);
    }
  };

  const deleteCounter = async (id) => {
    try {
      await fetch(`http://localhost:3000/counters/${id}`, { method: "DELETE" });

      setArchivedCounters((prev) =>
        prev.filter((counter) => counter.id !== id)
      );
    } catch (error) {
      console.error("Error deleting counter:", error);
    }
  };

  return (
    <ScrollView className="p-6 flex-1">
      <ThemedText className="text-2xl font-bold text-white text-center mb-4">
        Archived Counters
      </ThemedText>

      {archivedCounters.length === 0 ? (
        <ThemedText className="text-lg text-gray-400 text-center">
          No archived counters
        </ThemedText>
      ) : (
        <ThemedView className="gap-4">
          {archivedCounters.map((counter) => (
            <ThemedView
              key={counter.id}
              className="p-6 border border-gray-700 rounded-xl shadow-md bg-gray-900 m-1"
            >
              <ThemedText className="text-2xl font-bold text-white">
                {counter.title}
              </ThemedText>

              <View className="flex-row justify-between items-center mt-4">
                <ThemedText className="text-4xl font-bold text-white">
                  {counter.count}
                </ThemedText>
              </View>

              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  onPress={() => restoreCounter(counter.id)}
                  className="px-4 py-2 bg-green-600 rounded-lg"
                >
                  <ThemedText className="text-white font-bold">
                    Restore
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteCounter(counter.id)}
                  className="px-4 py-2 bg-red-600 rounded-lg"
                >
                  <ThemedText className="text-white font-bold">
                    Delete
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
};

export default ArchivedCounters;
