interface Fragment {
	Content: string;
	'Date Modified': string;
	Note: string;
	Title: string;
	Language: string;
	'Date Created': string;
}

interface Snippet {
	'Date Created': string;
	'Date Modified': string;
	Folder: string;
	Title: string;
	Fragments: Fragment[];
	Tags: any[];
}

export interface SnippetLabLib {
	'Library Name': string;
	'Date Exported': string;
	'Snippets Count': string;
	Snippets: Snippet[];
}

type VSCodeSnippet = {
	label: string;
	body: string;
};

const transformSnippetFragments = (snippet: Snippet): VSCodeSnippet[] => {
	const hasMultipleFragments = snippet.Fragments.length > 1;
	const isUntitled = snippet.Title === '';

	if (isUntitled) {
		return [];
	}

	if (!hasMultipleFragments) {
		return [
			{
				label: snippet.Title,
				body: snippet.Fragments[0].Content,
			},
		];
	}

	/* MULTI
  FRAGMENT SUPPORT
  */

	const namedFragments = snippet.Fragments.filter(
		({ Title }) => Title !== 'Fragment'
	).map((named) => ({
		label: snippet.Title + ' | ' + named.Title,
		body: named.Content,
	}));

	// Any unnamed fragment bodies are joined and concatenated

	const unnamedFragmentBody = snippet.Fragments.filter(
		({ Title }) => Title === 'Fragment'
	)
		.map((unnamed) => unnamed.Content)
		.join('\n\n');

	const unnamedFragment = unnamedFragmentBody
		? [
				{
					label: 'Unnamed Snippet',
					body: unnamedFragmentBody,
				},
		  ]
		: [];

	return [...namedFragments, ...unnamedFragment];
};

export const transformSnippetsLab = (snippets: SnippetLabLib) =>
	snippets.Snippets.map(transformSnippetFragments).flat(2);
