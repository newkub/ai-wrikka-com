export interface Point {
	x: number;
	y: number;
}

export interface ViewState {
	x: number;
	y: number;
	scale: number;
}

export interface CanvasTransform {
	x: number;
	y: number;
	scale: number;
}

export type DrawingTool = "pen" | "rectangle" | "ellipse" | "text" | "select";

export interface Drawing {
	id: number;
	points: Point[];
	color: string;
	width: number;
	type: DrawingTool;
	text?: string;
	startPoint?: Point;
	endPoint?: Point;
}

export interface WhiteboardState {
	drawings: Drawing[];
	currentDrawing: Drawing | null;
	isDrawing: boolean;
	currentTool: DrawingTool;
	currentColor: string;
	currentWidth: number;
	showTextInput: boolean;
	textInput: string;
	textPosition: Point;
}

export const COLORS = [
	"var(--text)",
	"var(--background)",
	"var(--color-error)",
	"var(--color-success)",
	"var(--color-alert)",
	"var(--color-primary)",
	"var(--border)",
	"var(--text)/50",
];

export const TOOLS = [
	{ id: "pen", icon: "i-mdi-pencil", name: "pen" },
	{ id: "rectangle", icon: "i-mdi-rectangle-outline", name: "rectangle" },
	{ id: "ellipse", icon: "i-mdi-circle-outline", name: "ellipse" },
	{ id: "text", icon: "i-mdi-format-text", name: "text" },
	{ id: "select", icon: "i-mdi-cursor-default-outline", name: "select" },
] as const;
