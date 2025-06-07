export interface Gradient {
	from: string;
	to: string;
}

export interface Tag {
	id: string;
	name: string;
	color?: string;
	bgColor?: string;
}

export interface Bookmark {
	id: string;
	title: string;
	url: string;
	domain: string;
	favicon?: string;
	description?: string;
	image?: string;
	gradient?: Gradient;
	tags: Tag[];
	createdAt?: string;
	updatedAt?: string;
}

export interface BookmarkFormData
	extends Omit<Bookmark, "id" | "createdAt" | "updatedAt"> {
	// Can add form-specific fields here if needed
}
