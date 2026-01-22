import { useState, useCallback } from "react";

interface ModalConfig {
  critical?: boolean;
  maintenance?: boolean;
  message?: string | { title?: string; body?: string; button_text?: string };
  updateUrl?: string;
}

export function useUpdateModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});

  const showModal = useCallback((config: ModalConfig = {}) => {
    setModalConfig(config);
    setModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    modalVisible,
    modalConfig,
    showModal,
    hideModal,
  };
}
