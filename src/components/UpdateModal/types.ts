export interface UpdateModalMessage {
  title?: string;
  body?: string;
  button_text?: string;
}

export interface UpdateModalProps {
  visible: boolean;
  critical?: boolean;
  message?: UpdateModalMessage | string;
  updateUrl?: string;
  onClose: () => void;
  maintenance?: boolean;
}
