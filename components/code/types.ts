export interface FileItem {
	name: string;
	type: "file" | "directory";
	isOpen?: boolean;
	children?: FileItem[];
}

export interface ContextMenuPosition {
	x: number;
	y: number;
	target: FileItem;
}
