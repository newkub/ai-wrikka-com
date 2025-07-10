import { ref } from "vue";
import type { FileItem } from "../components/code/FileStructure.vue";

export const useFileSystem = () => {
	const fileStructure = ref<FileItem[]>([]);
	const activeFile = ref<string>("");

	const handleFileSelect = (fileName: string): string | null => {
		activeFile.value = fileName;
		return null; // ควรอ่านเนื้อหาไฟล์จริงจากระบบไฟล์
	};

	return {
		fileStructure,
		activeFile,
		handleFileSelect,
	};
};
