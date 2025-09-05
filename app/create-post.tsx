import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
  Modal,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";
import { useCreatePostMutation } from "../redux/api/endpoints/posts";
import { useGetCategoriesQuery } from "../redux/api/endpoints/universalPosts";
import { TagInput } from "../components/TagInput";
import ThemedScreen from "@/components/ThemedScreen";

const { width } = Dimensions.get("window");

interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function CreatePostScreen() {
  const { colors } = useTheme();
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();
  const { data: categoriesData } = useGetCategoriesQuery();

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5 - selectedImages.length,
      });

      if (!result.canceled && result.assets) {
        const imageUris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...imageUris].slice(0, 5));
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выбрать изображения");
    }
  };

  const pickVideos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 3 - selectedVideos.length,
      });

      if (!result.canceled && result.assets) {
        const videoUris = result.assets.map((asset) => asset.uri);
        setSelectedVideos((prev) => [...prev, ...videoUris].slice(0, 3));
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выбрать видео");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Ошибка", "Пожалуйста, добавьте описание поста");
      return;
    }

    try {
      setIsUploading(true);

      const postData = {
        description: description.trim(),
        images: selectedImages,
        videos: selectedVideos,
        tags,
        category: selectedCategory?._id,
      };

      await createPost(postData).unwrap();

      Alert.alert("Успех", "Пост создан успешно", [{ text: "ОК", onPress: () => router.back() }]);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось создать пост");
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitDisabled = !description.trim() || isCreatingPost || isUploading;

  return (
    <ThemedScreen>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.darkBackground }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/community")}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="close" size={24} color={colors.hint} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Новый пост</Text>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isCreatingPost || isUploading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {/* Category Selection */}
          <View style={[styles.card]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Категория</Text>
            <TouchableOpacity
              style={[styles.categorySelector, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={() => setShowCategoryModal(true)}
            >
              <View style={styles.categorySelectorContent}>
                <Ionicons name="pricetag" size={18} color={colors.hint} style={styles.categoryIcon} />
                <Text style={[styles.categorySelectorText, { color: selectedCategory ? colors.text : colors.hint }]}>
                  {selectedCategory ? selectedCategory.name : "Выберите категорию"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={colors.hint} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={[styles.card]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Описание</Text>
              <Text style={[styles.characterCount, { color: colors.hint }]}>{description.length}/2000</Text>
            </View>
            <TextInput
              style={[styles.descriptionInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="О чем ваш пост? Поделитесь своими мыслями..."
              placeholderTextColor={colors.hint}
              multiline
              textAlignVertical="top"
              maxLength={2000}
            />
          </View>

          {/* Media */}
          <View style={[styles.card]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Медиа</Text>

            <View style={styles.mediaButtons}>
              <TouchableOpacity style={[styles.mediaButton, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={pickImages}>
                <View style={[styles.mediaButtonIcon, { backgroundColor: colors.accent + "20" }]}>
                  <Ionicons name="images" size={20} color={colors.accent} />
                </View>
                <Text style={[styles.mediaButtonText, { color: colors.text }]}>Фото</Text>
                {selectedImages.length > 0 && (
                  <View style={[styles.mediaBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.mediaBadgeText}>{selectedImages.length}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.mediaButton, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={pickVideos}>
                <View style={[styles.mediaButtonIcon, { backgroundColor: colors.accent + "20" }]}>
                  <Ionicons name="videocam" size={20} color={colors.accent} />
                </View>
                <Text style={[styles.mediaButtonText, { color: colors.text }]}>Видео</Text>
                {selectedVideos.length > 0 && (
                  <View style={[styles.mediaBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.mediaBadgeText}>{selectedVideos.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Images Preview */}
            {selectedImages.length > 0 && (
              <View style={styles.mediaPreview}>
                <Text style={[styles.mediaPreviewTitle, { color: colors.text }]}>Изображения ({selectedImages.length}/5)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScrollView}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.mediaItem}>
                      <Image source={{ uri }} style={styles.mediaItemImage} />
                      <TouchableOpacity style={[styles.removeMediaButton, { backgroundColor: colors.error }]} onPress={() => removeImage(index)}>
                        <Ionicons name="close" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Videos Preview */}
            {selectedVideos.length > 0 && (
              <View style={styles.mediaPreview}>
                <Text style={[styles.mediaPreviewTitle, { color: colors.text }]}>Видео ({selectedVideos.length}/3)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScrollView}>
                  {selectedVideos.map((uri, index) => (
                    <View key={index} style={styles.mediaItem}>
                      <View style={[styles.videoPlaceholder, { backgroundColor: colors.border }]}>
                        <View style={[styles.playButton, { backgroundColor: colors.accent }]}>
                          <Ionicons name="play" size={16} color="#fff" />
                        </View>
                      </View>
                      <TouchableOpacity style={[styles.removeMediaButton, { backgroundColor: colors.error }]} onPress={() => removeVideo(index)}>
                        <Ionicons name="close" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Tags */}
          <View style={[styles.card]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Теги</Text>
            <TagInput initialTags={tags} onTagsChange={setTags} placeholder="Добавить тег..." maxTags={10} />
            <Text style={[styles.helperText, { color: colors.hint }]}>Теги помогут другим пользователям найти ваш пост</Text>
          </View>
        </ScrollView>

        {/* Category Selection Modal */}
        <Modal visible={showCategoryModal} animationType="slide" presentationStyle="pageSheet">
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                <Ionicons name="close" size={24} color={colors.hint} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Выберите категорию</Text>
              <View style={{ width: 24 }} />
            </View>

            <FlatList
              data={categoriesData?.data || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryItem]}
                  onPress={() => {
                    setSelectedCategory(item);
                    setShowCategoryModal(false);
                  }}
                >
                  <View style={styles.categoryItemContent}>
                    <View style={[styles.categoryIconContainer, { backgroundColor: colors.accent + "20" }]}>
                      <Ionicons name="pricetag" size={16} color={colors.accent} />
                    </View>
                    <View style={styles.categoryTextContainer}>
                      <Text style={[styles.categoryItemName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.categoryItemDescription, { color: colors.hint }]} numberOfLines={1}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  {selectedCategory?._id === item._id && <Ionicons name="checkmark-circle" size={24} color={colors.accent} />}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.categoriesList}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  categorySelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categorySelectorText: {
    fontSize: 16,
    flex: 1,
  },
  descriptionInput: {
    fontSize: 16,
    minHeight: 120,
    borderWidth: 0.5,
    borderRadius: 14,
    padding: 10,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  characterCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  mediaButtons: {
    flexDirection: "row",
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 14,
    padding: 10,
    position: "relative",
    gap: 8,
  },
  mediaButtonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  mediaBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  mediaPreview: {
    marginTop: 16,
  },
  mediaPreviewTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  mediaScrollView: {
    marginHorizontal: -4,
  },
  mediaItem: {
    position: "relative",
    marginHorizontal: 4,
  },
  mediaItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  videoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  removeMediaButton: {
    position: "absolute",
    top: -6,
    right: -6,
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  helperText: {
    fontSize: 12,
    marginTop: 8,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  categoriesList: {
    padding: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 10,
  },
  categoryItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  categoryItemDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
});
