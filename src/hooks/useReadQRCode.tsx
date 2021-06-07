import { useMutation } from "react-query";

const { api } = window;

function useReadQRCode() {
  const { mutateAsync: readCode } = useMutation(
    "read-qr-code",
    async (qrFilePath: string) => {
      const { success, qrDecode } = await api.readQRCode(qrFilePath);

      return { success, qrDecode };
    }
  );
  return { readCode };
}

export default useReadQRCode;
