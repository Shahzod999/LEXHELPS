import { Loading } from "@/components/common/LoadingScreen";
import SwipeDelete from "@/components/common/SwipeDelete";
import ThemedButton from "@/components/ThemedButton";
import { useToast } from "@/context/ToastContext";
import { useDeleteReminderMutation, useGetRemindersQuery } from "@/redux/api/endpoints/reminderApi";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CreateReminderModal from "./CreateReminderModal";
import Reminders from "./Reminders";

const ReindersList = () => {
  const { t } = useTranslation();
  const { data: reminders, isLoading } = useGetRemindersQuery();
  const [deleteReminder] = useDeleteReminderMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showToast } = useToast();

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteReminder(id).unwrap();
      showToast(t('reminderDeletedSuccessfully'), "success");
    } catch (error) {
      showToast(t('errorDeletingReminder'), "error");
    }
  };

  return (
    <View>
      <ThemedButton title={t('addReminder')} onPress={() => setShowCreateModal(true)} icon="add" />

      {isLoading && <Loading />}

      {reminders?.map((reminder) => (
        <SwipeDelete key={reminder._id} handleDelete={() => handleDeleteReminder(reminder._id)}>
          <Reminders
            title={reminder.title}
            description={reminder.description}
            time={reminder.createdAt}
            scheduledDate={reminder.schedule}
            deadline={reminder.deadline}
          />
        </SwipeDelete>
      ))}

      <CreateReminderModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </View>
  );
};

export default ReindersList;
