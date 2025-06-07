import { ref } from "vue";

export interface FileItem {
	name: string;
	type: "file" | "directory";
	isOpen?: boolean;
	children?: FileItem[];
}

export function useFileSystem() {
	const activeFile = ref("index.js");

	// Sample file structure data
	const fileStructure = ref<FileItem[]>([
		{
			name: "project",
			type: "directory",
			isOpen: true,
			children: [
				{
					name: "src",
					type: "directory",
					isOpen: true,
					children: [
						{ name: "main.js", type: "file" },
						{ name: "App.vue", type: "file" },
						{
							name: "assets",
							type: "directory",
							children: [{ name: "style.css", type: "file" }],
						},
					],
				},
				{
					name: "public",
					type: "directory",
					children: [{ name: "index.html", type: "file" }],
				},
				{ name: "package.json", type: "file" },
				{ name: "vite.config.js", type: "file" },
			],
		},
	]);

	const handleFileSelect = (fileName: string) => {
		activeFile.value = fileName;
		// Here you would typically load the file content
		return `// Content of ${fileName}\n// This is a sample file content.`;
	};

	return {
		activeFile,
		fileStructure,
		handleFileSelect,
	};
}
