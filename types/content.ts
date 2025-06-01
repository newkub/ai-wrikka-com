export interface Author {
	name: string;
	avatar: string;
	bio?: string;
}

export interface BlogPost {
	_path: string;
	title: string;
	description: string;
	image: string;
	date: string;
	readTime: string;
	tags: string[];
	category: string;
	author: Author;
}

export interface NavigationItem {
	title: string;
	items: Array<{ name: string; href: string }>;
}
